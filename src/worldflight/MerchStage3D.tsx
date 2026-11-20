import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { Group, MathUtils } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { solidarity } from '../content'
import type { SolidarityProduct } from '../content'
import { flightLength } from './index'
import type { FlightPose } from './index'
import { dracoLoader } from './draco'

const defaultMerchUrls = solidarity.map((item) => item.glb)

// Halo slots for the non-selected models around the foreground item (supports up to 6 items).
const DESKTOP_HALO: [number, number, number][] = [
  [-2.15, 0.72, -44.6],
  [0, 1.38, -46.2],
  [2.15, 0.72, -44.6],
  [-1.45, 1.25, -45.4],
  [1.45, 1.25, -45.4],
  [0, -0.35, -45.8],
]

const MOBILE_HALO: [number, number, number][] = [
  [-1.08, 1.32, -44.5],
  [0, 1.84, -45.6],
  [1.08, 1.32, -44.5],
  [-0.72, 1.62, -45.1],
  [0.72, 1.62, -45.1],
  [0, 1.05, -45.3],
]

export interface MerchStage3DProps {
  pose: FlightPose
  gadgets: readonly SolidarityProduct[]
  narrow: boolean
  isGadgetActive: boolean
  selectedGadgetId: string
  onSelectGadget: (id: string) => void
  reducedMotion: boolean
}

export function MerchStage3D({
  pose,
  gadgets,
  narrow,
  isGadgetActive,
  selectedGadgetId,
  onSelectGadget,
  reducedMotion,
}: MerchStage3DProps) {
  const gltfs = useLoader(GLTFLoader, defaultMerchUrls, (loader) => loader.setDRACOLoader(dracoLoader))
  const { gl, invalidate } = useThree()

  const stageGroup = useRef<Group>(null!)
  const itemRefs = useRef<(Group | null)[]>([])
  const hoveredIndex = useRef<number | null>(null)

  const dragState = useRef({
    active: false,
    moved: 0,
    lastX: 0,
    lastY: 0,
    yaw: 0,
    pitch: 0.06,
    yawVel: 0,
  })

  const scenesByUrl = useMemo(() => {
    const map = new Map<string, Group>()
    defaultMerchUrls.forEach((url, index) => {
      if (gltfs[index]?.scene) {
        map.set(url, gltfs[index].scene)
      }
    })
    return map
  }, [gltfs])

  const items = gadgets.length > 0 ? gadgets : solidarity

  const clonedScenes = useMemo(
    () =>
      items.map((item) => {
        const template = scenesByUrl.get(item.glb) ?? gltfs[0]?.scene
        return template ? template.clone(true) : new Group()
      }),
    [items, scenesByUrl, gltfs],
  )

  const currentTransforms = useMemo(
    () => items.map(() => ({ x: 0, y: 0.6, z: -45, scale: 1 })),
    [items],
  )

  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => item.id === selectedGadgetId),
  )
  const activeKind = items[selectedIndex]?.kind ?? 'solidale'

  useEffect(() => {
    dragState.current.yaw = 0
    dragState.current.pitch = 0.06
    dragState.current.yawVel = 0
    invalidate()
  }, [selectedGadgetId, isGadgetActive, invalidate])

  useEffect(() => {
    const dom = gl.domElement
    if (!isGadgetActive) {
      dragState.current.active = false
      dom.style.cursor = ''
      return
    }

    function onPointerDown(event: PointerEvent) {
      if (event.button !== 0) return
      dragState.current.active = true
      dragState.current.moved = 0
      dragState.current.lastX = event.clientX
      dragState.current.lastY = event.clientY
      dragState.current.yawVel = 0
      dom.style.cursor = 'grabbing'
    }

    function onPointerMove(event: PointerEvent) {
      if (!dragState.current.active) return
      const dx = event.clientX - dragState.current.lastX
      const dy = event.clientY - dragState.current.lastY
      dragState.current.lastX = event.clientX
      dragState.current.lastY = event.clientY
      dragState.current.moved += Math.hypot(dx, dy)
      dragState.current.yaw += dx * 0.011
      dragState.current.yawVel = dx * 0.008
      dragState.current.pitch = MathUtils.clamp(dragState.current.pitch + dy * 0.0045, -0.45, 0.45)
      invalidate()
    }

    function onPointerUp() {
      if (!dragState.current.active) return
      dragState.current.active = false
      dom.style.cursor = hoveredIndex.current !== null ? 'pointer' : 'grab'
      invalidate()
    }

    dom.style.cursor = 'grab'
    dom.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    return () => {
      dom.style.cursor = ''
      dom.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [gl, isGadgetActive, invalidate])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const distance = pose.progress * flightLength
    const visible = distance > 4.95 && distance < 6.75
    stageGroup.current.visible = visible
    if (!visible) return

    const enter = MathUtils.smoothstep(distance, 5.05, 5.62)
    const exit = 1 - MathUtils.smoothstep(distance, 6.25, 6.65)
    const presence = enter * exit

    const haloSlots = narrow ? MOBILE_HALO : DESKTOP_HALO
    const heroPos: [number, number, number] = narrow ? [0, 0.54, -42.4] : [0, 0.42, -41.7]
    const heroScale = (narrow ? 1.48 : 1.92) * presence
    const haloBaseScale = (narrow ? 0.78 : 1.02) * presence

    let haloCursor = 0
    let needsMoreFrames = isGadgetActive && !reducedMotion

    if (!dragState.current.active) {
      if (Math.abs(dragState.current.yawVel) > 0.0004) {
        dragState.current.yaw += dragState.current.yawVel
        dragState.current.yawVel *= Math.pow(0.06, dt)
        needsMoreFrames = true
      } else if (isGadgetActive && !reducedMotion) {
        dragState.current.yaw += dt * 0.34
      }
    }

    const lerpAlpha = 1 - Math.exp(-8.5 * dt)

    items.forEach((product, index) => {
      const group = itemRefs.current[index]
      if (!group) return

      const inActiveGroup = product.kind === activeKind
      if (!inActiveGroup) {
        group.visible = false
        return
      }
      group.visible = true

      const isSelected = index === selectedIndex
      const isHovered = hoveredIndex.current === index
      const slotPos = haloSlots[haloCursor % haloSlots.length]
      if (!isSelected) haloCursor++

      const targetPos = isSelected ? heroPos : slotPos
      const targetScale = isSelected ? heroScale : haloBaseScale * (isHovered ? 1.1 : 1)

      const cur = currentTransforms[index] ?? { x: targetPos[0], y: targetPos[1], z: targetPos[2], scale: targetScale }
      cur.x = MathUtils.lerp(cur.x, targetPos[0], lerpAlpha)
      cur.y = MathUtils.lerp(cur.y, targetPos[1], lerpAlpha)
      cur.z = MathUtils.lerp(cur.z, targetPos[2], lerpAlpha)
      cur.scale = MathUtils.lerp(cur.scale, targetScale, lerpAlpha)

      if (
        Math.abs(cur.x - targetPos[0]) > 0.003 ||
        Math.abs(cur.y - targetPos[1]) > 0.003 ||
        Math.abs(cur.z - targetPos[2]) > 0.003 ||
        Math.abs(cur.scale - targetScale) > 0.003
      ) {
        needsMoreFrames = true
      }

      const floatY =
        isGadgetActive && !reducedMotion
          ? Math.sin(performance.now() * 0.0014 + index * 1.6) * (isSelected ? 0.035 : 0.025)
          : 0

      group.position.set(cur.x, cur.y + floatY, cur.z)
      group.scale.setScalar(Math.max(0.001, cur.scale))

      if (isSelected) {
        group.rotation.set(dragState.current.pitch, dragState.current.yaw, 0)
      } else {
        const restYaw = (index - selectedIndex) * 0.28 + (isHovered ? 0.16 : 0)
        group.rotation.set(0.08, restYaw, 0)
      }
    })

    if (needsMoreFrames) {
      invalidate()
    }
  })

  return (
    <group ref={stageGroup}>
      <pointLight position={[0, 2.2, -39.5]} intensity={14} distance={20} decay={2} color="#fffaff" />
      <pointLight position={[-3.2, 0.2, -41.5]} intensity={6} distance={18} decay={2} color="#efe4ff" />
      {items.map((product, index) => (
        <group
          key={product.id}
          ref={(el) => {
            itemRefs.current[index] = el
          }}
          onPointerOver={(event) => {
            if (!isGadgetActive) return
            event.stopPropagation()
            hoveredIndex.current = index
            gl.domElement.style.cursor = index === selectedIndex ? 'grab' : 'pointer'
            invalidate()
          }}
          onPointerOut={(event) => {
            if (!isGadgetActive) return
            event.stopPropagation()
            if (hoveredIndex.current === index) {
              hoveredIndex.current = null
              gl.domElement.style.cursor = dragState.current.active ? 'grabbing' : 'grab'
              invalidate()
            }
          }}
          onClick={(event) => {
            if (!isGadgetActive) return
            event.stopPropagation()
            if (dragState.current.moved > 8) return
            onSelectGadget(product.id)
          }}
        >
          <primitive object={clonedScenes[index]} />
        </group>
      ))}
    </group>
  )
}
