import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import {
  BufferAttribute, CanvasTexture, Color, DynamicDrawUsage, Group, MathUtils, Points, PointsMaterial,
} from 'three'
import { flightLength } from './index'
import type { FlightPose } from './index'
import { sampleRainbow } from './rainbow'

function sampleInk(image: HTMLImageElement, count: number) {
  const canvas = document.createElement('canvas')
  canvas.width = 288
  canvas.height = 288
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Impossibile leggere le illustrazioni per le particelle')

  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height)
  const ink: number[] = []
  let minX = canvas.width
  let minY = canvas.height
  let maxX = 0
  let maxY = 0

  for (let offset = 0; offset < data.length; offset += 4) {
    if (data[offset + 3] < 120 || data[offset] + data[offset + 1] + data[offset + 2] > 435) continue
    const index = offset / 4
    const x = index % canvas.width
    const y = Math.floor(index / canvas.width)
    ink.push(index)
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
  }
  if (!ink.length) throw new Error('L’illustrazione non contiene una sagoma per le particelle')

  const span = Math.max(1, maxX - minX, maxY - minY)
  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2
  const points = new Float32Array(count * 3)
  for (let index = 0; index < count; index++) {
    const pixel = ink[Math.floor((index + 0.5) * ink.length / count)]
    points[index * 3] = (pixel % canvas.width - centerX) / span
    points[index * 3 + 1] = (centerY - Math.floor(pixel / canvas.width)) / span
  }
  return points
}

function makeDot() {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Impossibile disegnare le particelle')
  context.fillStyle = '#fff'
  context.beginPath()
  context.arc(16, 16, 15, 0, Math.PI * 2)
  context.fill()
  return new CanvasTexture(canvas)
}

function makeCloud(count: number) {
  const cloud = new Float32Array(count * 3)
  const random = MathUtils.seededRandom
  for (let index = 0; index < cloud.length; index += 3) {
    const angle = random(index + 537) * Math.PI * 2
    const radius = Math.sqrt(random(index + 2449))
    cloud[index] = Math.cos(angle) * radius
    cloud[index + 1] = Math.sin(angle) * radius * 0.76
    cloud[index + 2] = (random(index + 6179) - 0.5) * 0.3
  }
  return cloud
}

function sampleShapeColors(shape: Float32Array) {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (let index = 0; index < shape.length; index += 3) {
    minX = Math.min(minX, shape[index])
    maxX = Math.max(maxX, shape[index])
    minY = Math.min(minY, shape[index + 1])
    maxY = Math.max(maxY, shape[index + 1])
  }

  const spanX = Math.max(0.001, maxX - minX)
  const color = new Color()
  const colors = new Float32Array(shape.length)
  for (let index = 0; index < shape.length; index += 3) {
    const nx = (shape[index] - minX) / spanX
    sampleRainbow(nx, color).toArray(colors, index)
  }
  return colors
}

const smooth = MathUtils.smoothstep

export function FlightParticles({
  pose,
  heart,
  narrow,
  sceneAspect,
  heartScale,
  heartY,
}: {
  pose: FlightPose
  heart: HTMLImageElement
  narrow: boolean
  sceneAspect: number
  heartScale: number
  heartY: number
}) {
  const heroGroup = useRef<Group>(null!)
  const leftHeroPoints = useRef<Points>(null!)
  const rightHeroPoints = useRef<Points>(null!)
  const leftHeroMat = useRef<PointsMaterial>(null!)
  const rightHeroMat = useRef<PointsMaterial>(null!)

  const closingPoints = useRef<Points>(null!)
  const closingMat = useRef<PointsMaterial>(null!)

  const count = narrow ? 900 : 1800
  const shapes = useMemo(() => {
    const heartPts = sampleInk(heart, count)
    return {
      heart: heartPts,
      cloud: makeCloud(count),
      colors: new BufferAttribute(sampleShapeColors(heartPts), 3),
    }
  }, [heart, count])

  const heroPosition = useMemo(
    () => new BufferAttribute(new Float32Array(count * 3), 3).setUsage(DynamicDrawUsage),
    [count],
  )
  const closingPosition = useMemo(
    () => new BufferAttribute(new Float32Array(count * 3), 3).setUsage(DynamicDrawUsage),
    [count],
  )
  const dot = useMemo(makeDot, [])

  useEffect(() => () => dot.dispose(), [dot])

  useFrame(() => {
    const distance = pose.progress * flightLength

    // 1. Opening Winged Hearts in the Home (#inizio): replace the old 3D unicorns on left & right
    const heroOpacity = (1 - smooth(distance, 0.35, 1.05)) * 0.94
    const heroVisible = heroOpacity > 0.005
    heroGroup.current.visible = heroVisible

    if (heroVisible) {
      const heroScatter = smooth(distance, 0.18, 0.92)
      const spread = Math.min(4.85, sceneAspect * (narrow ? 2.55 : 2.95))
      const baseScale = narrow ? 2.15 : 3.55
      const currentScale = MathUtils.lerp(baseScale, baseScale * 1.32, heroScatter)
      const liftY = narrow ? 0.25 : 0.12

      leftHeroPoints.current.position.set(-spread - heroScatter * 0.9, liftY + heroScatter * 0.35, -0.3 - heroScatter * 1.4)
      rightHeroPoints.current.position.set(spread + heroScatter * 0.9, liftY + heroScatter * 0.35, -0.3 - heroScatter * 1.4)
      leftHeroPoints.current.rotation.set(0, 0.24 + heroScatter * 0.35, 0.06)
      rightHeroPoints.current.rotation.set(0, -0.24 - heroScatter * 0.35, -0.06)
      leftHeroPoints.current.scale.setScalar(currentScale)
      rightHeroPoints.current.scale.setScalar(currentScale)

      leftHeroMat.current.opacity = heroOpacity
      rightHeroMat.current.opacity = heroOpacity

      const heroValues = heroPosition.array
      for (let index = 0; index < heroValues.length; index += 3) {
        heroValues[index] = MathUtils.lerp(shapes.heart[index], shapes.cloud[index], heroScatter)
        heroValues[index + 1] = MathUtils.lerp(shapes.heart[index + 1], shapes.cloud[index + 1], heroScatter)
        heroValues[index + 2] = shapes.cloud[index + 2] * heroScatter
      }
      heroPosition.needsUpdate = true
    }

    // 2. Closing Winged Heart at #contatti
    const closingStart = 6.35
    const closingOpacity = smooth(distance, closingStart, closingStart + 0.35) * 0.96
    const closingVisible = closingOpacity > 0.005
    closingPoints.current.visible = closingVisible

    if (closingVisible) {
      const scatter = 1 - smooth(distance, closingStart + 0.12, flightLength - 0.22)
      closingPoints.current.position.set(0, heartY, -56.9)
      closingPoints.current.scale.setScalar(heartScale)
      closingMat.current.opacity = closingOpacity

      const values = closingPosition.array
      for (let index = 0; index < values.length; index += 3) {
        values[index] = MathUtils.lerp(shapes.heart[index], shapes.cloud[index], scatter)
        values[index + 1] = MathUtils.lerp(shapes.heart[index + 1], shapes.cloud[index + 1], scatter)
        values[index + 2] = shapes.cloud[index + 2] * scatter
      }
      closingPosition.needsUpdate = true
    }
  })

  const pointSize = narrow ? 0.062 : 0.054

  return (
    <>
      <group ref={heroGroup} renderOrder={2}>
        <points ref={leftHeroPoints} frustumCulled={false}>
          <bufferGeometry>
            <primitive object={heroPosition} attach="attributes-position" />
            <primitive object={shapes.colors} attach="attributes-color" />
          </bufferGeometry>
          <pointsMaterial
            ref={leftHeroMat}
            vertexColors
            size={pointSize}
            map={dot}
            transparent
            depthWrite={false}
          />
        </points>
        <points ref={rightHeroPoints} frustumCulled={false}>
          <bufferGeometry>
            <primitive object={heroPosition} attach="attributes-position" />
            <primitive object={shapes.colors} attach="attributes-color" />
          </bufferGeometry>
          <pointsMaterial
            ref={rightHeroMat}
            vertexColors
            size={pointSize}
            map={dot}
            transparent
            depthWrite={false}
          />
        </points>
      </group>

      <points ref={closingPoints} frustumCulled={false} visible={false} renderOrder={2}>
        <bufferGeometry>
          <primitive object={closingPosition} attach="attributes-position" />
          <primitive object={shapes.colors} attach="attributes-color" />
        </bufferGeometry>
        <pointsMaterial
          ref={closingMat}
          vertexColors
          size={narrow ? 0.07 : 0.06}
          map={dot}
          transparent
          depthWrite={false}
        />
      </points>
    </>
  )
}
