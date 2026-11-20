import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Component, Suspense, useEffect, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import {
  CanvasTexture, CatmullRomCurve3, Color, Float32BufferAttribute, Fog, Group,
  MathUtils, MeshBasicMaterial, SRGBColorSpace, TextureLoader, TubeGeometry, Vector3,
} from 'three'
import { brandLogo, dianaPortrait, illustrations } from '../content'
import type { SolidarityProduct } from '../content'
import { flightLength } from './index'
import type { FlightPose } from './index'
import { FlightParticles } from './FlightParticles'
import { MerchStage3D } from './MerchStage3D'
import { sampleRainbow } from './rainbow'

interface SceneProps {
  pose: FlightPose
  gadgets: readonly SolidarityProduct[]
  isGadgetActive: boolean
  selectedGadgetId: string
  onSelectGadget: (id: string) => void
  reducedMotion: boolean
  onReady: () => void
  onUnavailable: () => void
}

class SceneErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

const logoWidth = 3.55
const logoHeight = logoWidth * (brandLogo.height / brandLogo.width)
const portraitWidth = 3.66
const portraitHeight = portraitWidth * (dianaPortrait.height / dianaPortrait.width)
const media = [brandLogo.src, dianaPortrait.src, illustrations.wingedHeart]

type Position = [number, number, number]
type Keyframe = { at: number; eye: Position; target: Position }

const route: Keyframe[] = [
  { at: 0, eye: [0, 0.4, 14], target: [0, 0, 0] },
  { at: 0.85, eye: [-2, 0.2, 8], target: [-2.05, -0.36, 0] },
  { at: 1.35, eye: [-2.3, 0.14, 6.8], target: [-2.36, -0.57, 0] },
  { at: 1.8, eye: [0, 0.8, -4.2], target: [0, -0.65, -15] },
  { at: 2.35, eye: [0.16, 0.46, -8.5], target: [0, -0.51, -18] },
  { at: 2.65, eye: [0.22, 0.42, -11.8], target: [0, -0.55, -22] },
  { at: 3.25, eye: [0.12, 0.36, -14.2], target: [0, -0.58, -25] },
  { at: 3.5, eye: [-0.18, 0.32, -17.2], target: [0, -0.64, -29] },
  { at: 4.1, eye: [-0.08, 0.26, -19.8], target: [0, -0.68, -31] },
  { at: 4.35, eye: [0, 0.24, -21.5], target: [0, -0.74, -34] },
  { at: 4.95, eye: [0, 0.2, -23.7], target: [0, -0.74, -34] },
  { at: 5.4, eye: [0, 0.2, -23.7], target: [0, -0.74, -34] },
  { at: 5.65, eye: [0.4, 0.62, -35.6], target: [0.32, -0.27, -46] },
  { at: 6.18, eye: [0.1, 0.49, -39], target: [0, -0.37, -48] },
  { at: 6.5, eye: [0, 0.25, -46.6], target: [0, -0.7, -57] },
  { at: 7.2, eye: [0, 0.25, -49], target: [0, -0.7, -57] },
  { at: flightLength, eye: [0, 0.25, -49], target: [0, -0.7, -57] },
]

const smooth = (value: number, start: number, end: number) => MathUtils.smoothstep(value, start, end)

function makePortraitFadeTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 4
  canvas.height = 128
  const context = canvas.getContext('2d')
  if (context) {
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#ffffff')
    gradient.addColorStop(0.84, '#ffffff')
    gradient.addColorStop(1, '#000000')
    context.fillStyle = gradient
    context.fillRect(0, 0, canvas.width, canvas.height)
  }
  return new CanvasTexture(canvas)
}

function makeStars() {
  const count = 320
  const positions = []
  const colors = new Float32Array(count * 3)
  const color = new Color()
  const pearl = new Color('#f7f0fd')
  for (let index = 0; index < count; index++) {
    const x = Math.sin(index * 17.381) * (6 + (index % 8))
    const y = Math.cos(index * 4.763) * (2 + (index % 6))
    const z = 6 - ((index * 13.71) % 75)
    positions.push(x, y, z)
    sampleRainbow((index % 23) / 22, color).lerp(pearl, 0.25).toArray(colors, index * 3)
  }
  return {
    positions: new Float32BufferAttribute(positions, 3),
    colors: new Float32BufferAttribute(colors, 3),
  }
}

const triangleWave = (value: number) => 1 - Math.abs((((value % 2) + 2) % 2) - 1)

function makeTrail(side: number, endY: number) {
  const curve = new CatmullRomCurve3(
    [
      [side * 6, -0.12, 0.15],
      [side * 2.7, -1.02, -3],
      [side * 0.7, -1.7, -7],
      [side * 2.2, -1.87, -13],
      [side * 3.5, -1.42, -18],
      [side * 0.85, -1.8, -24],
      [side * 4.4, -0.92, -32],
      [side * 5.5, -0.78, -36],
      [side * 2.8, -1.46, -40],
      [side * 1.5, -1.7, -46],
      [side * 0.3, -1.15, -51],
      [0, endY, -56.95],
    ].map(([x, y, z]) => new Vector3(x, y, z)),
  )
  const geometry = new TubeGeometry(curve, 220, 0.028, 5, false)
  const { position } = geometry.attributes
  const colors = new Float32Array(position.count * 4)
  const color = new Color()

  for (let index = 0; index < position.count; index++) {
    const depth = -position.getZ(index)
    const towardCenter = (1 - smooth(Math.abs(position.getX(index)), 1.65, 3.9)) * 0.5
    const openSample = side < 0 ? towardCenter : 1 - towardCenter
    const flightSample = triangleWave(depth / 13 + (side > 0 ? 0.6 : 0))
    const towardHeart = smooth(depth, 46, 57) * 0.5
    const closeSample = side < 0 ? towardHeart : 1 - towardHeart

    const progress = MathUtils.lerp(
      MathUtils.lerp(openSample, flightSample, smooth(depth, 5, 11)),
      closeSample,
      smooth(depth, 44, 52),
    )
    sampleRainbow(progress, color)
    color.toArray(colors, index * 4)
    const closing = smooth(depth, 45, 49) * (1 - smooth(depth, 51, 55))
    colors[index * 4 + 3] = 1 - closing * 0.56
  }
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 4))
  return geometry
}

const fogStartColor = new Color('#f9eef4')
const fogMidColor = new Color('#eef7f4')
const fogEndColor = new Color('#f0ecfb')

function World({
  pose,
  gadgets,
  isGadgetActive,
  selectedGadgetId,
  onSelectGadget,
  reducedMotion,
  onReady,
  onUnavailable,
}: SceneProps) {
  const textures = useLoader(TextureLoader, media)
  const { camera, gl, invalidate, size } = useThree()
  const fog = useRef<Fog>(null!)
  const logoGroup = useRef<Group>(null!)
  const logoMat = useRef<MeshBasicMaterial>(null!)
  const portrait = useRef<Group>(null!)
  const portraitMat = useRef<MeshBasicMaterial>(null!)
  const ready = useRef(false)
  const aim = useMemo(() => new Vector3(), [])
  const portraitFadeTexture = useMemo(makePortraitFadeTexture, [])
  const stars = useMemo(makeStars, [])
  const narrow = size.width / Math.max(1, size.height) < 1
  const sceneAspect = size.width / Math.max(1, size.height)
  const sideScale = Math.min(1, sceneAspect / 1.4)
  const heartScale = Math.min(4.55, sceneAspect * 4.55)
  const heartY = narrow ? 1.36 : 0.94
  const trailEnd = heartY - heartScale * 0.29 - 0.12
  const trails = useMemo(() => [-1, 1].map((side) => makeTrail(side, trailEnd)), [trailEnd])

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = SRGBColorSpace
    })
    pose.invalidate = invalidate
    const canvas = gl.domElement
    canvas.addEventListener('webglcontextlost', onUnavailable)
    return () => {
      delete pose.invalidate
      canvas.removeEventListener('webglcontextlost', onUnavailable)
    }
  }, [gl, invalidate, onUnavailable, pose, textures])

  useEffect(
    () => () => {
      portraitFadeTexture.dispose()
    },
    [portraitFadeTexture],
  )
  useEffect(() => () => trails.forEach((trail) => trail.dispose()), [trails])

  useFrame(() => {
    const distance = pose.progress * flightLength
    if (fog.current) {
      if (pose.progress < 0.5) {
        fog.current.color.copy(fogStartColor).lerp(fogMidColor, pose.progress * 2)
      } else {
        fog.current.color.copy(fogMidColor).lerp(fogEndColor, (pose.progress - 0.5) * 2)
      }
    }
    const nextIndex = route.findIndex((keyframe) => keyframe.at > distance)
    const end = route[nextIndex < 0 ? route.length - 1 : nextIndex]
    const start = route[nextIndex < 0 ? route.length - 2 : Math.max(0, nextIndex - 1)]
    const t = smooth(distance, start.at, end.at)
    const mix = (a: number, b: number) => MathUtils.lerp(a, b, t)
    camera.position.set(
      mix(start.eye[0], end.eye[0]) * sideScale,
      mix(start.eye[1], end.eye[1]),
      mix(start.eye[2], end.eye[2]),
    )
    aim.set(
      mix(start.target[0], end.target[0]) * sideScale,
      mix(start.target[1], end.target[1]),
      mix(start.target[2], end.target[2]),
    )
    camera.lookAt(aim)

    const openingLift = narrow ? 0.42 * (1 - smooth(distance, 0.28, 1.1)) : 0

    // Big Brand Logo in Home (#inizio): visible at the beginning, fades out before #storia
    const logoOpacity = 1 - smooth(distance, 0.34, 0.76)
    logoGroup.current.visible = logoOpacity > 0.01
    if (logoGroup.current.visible) {
      logoGroup.current.position.set(0, 0.08 + openingLift * 0.6, 0.24)
      logoMat.current.opacity = logoOpacity
    }

    // Diana's Portrait: ONLY visible in #storia (never in Home #inizio!)
    const portraitEnter = smooth(distance, 0.58, 0.88)
    const portraitExit = 1 - smooth(distance, 1.48, 1.78)
    const portraitOpacity = portraitEnter * portraitExit
    portrait.current.visible = portraitOpacity > 0.01
    if (portrait.current.visible) {
      portrait.current.position.set(0, 0.03 + openingLift, 0.18)
      portraitMat.current.opacity = portraitOpacity
    }

    if (!ready.current) {
      ready.current = true
      onReady()
    }
  })

  const logoScale = narrow ? 0.68 : 1.02
  const portraitScale = narrow ? 0.52 : 0.96

  return (
    <>
      <fog ref={fog} attach="fog" args={['#f9eef4', 22, 54]} />
      <ambientLight color="#f9f3ff" intensity={1.18} />
      <directionalLight color="#fff8fc" position={[-4, 7, 7]} intensity={2.2} />
      <directionalLight color="#cde8ff" position={[2, 4, -6]} intensity={2.1} />
      <points>
        <bufferGeometry>
          <primitive object={stars.positions} attach="attributes-position" />
          <primitive object={stars.colors} attach="attributes-color" />
        </bufferGeometry>
        <pointsMaterial vertexColors size={0.048} transparent opacity={0.42} depthWrite={false} />
      </points>
      <group scale={[narrow ? 0.61 : 1, 1, 1]}>
        {trails.map((trail, index) => (
          <mesh key={index} geometry={trail}>
            <meshBasicMaterial vertexColors transparent opacity={index ? 0.86 : 0.94} />
          </mesh>
        ))}
      </group>

      {/* Big Foundation Logo in Home (#inizio) */}
      <group ref={logoGroup} position={[0, 0.08, 0.24]} scale={logoScale}>
        <mesh renderOrder={4}>
          <planeGeometry args={[logoWidth, logoHeight]} />
          <meshBasicMaterial
            ref={logoMat}
            map={textures[0]}
            toneMapped={false}
            fog={false}
            transparent
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Diana's Portrait in Story (#storia only) */}
      <group ref={portrait} position={[0, 0.03, 0.18]} scale={portraitScale} visible={false}>
        <mesh renderOrder={4}>
          <planeGeometry args={[portraitWidth, portraitHeight]} />
          <meshBasicMaterial
            ref={portraitMat}
            map={textures[1]}
            alphaMap={portraitFadeTexture}
            toneMapped={false}
            fog={false}
            transparent
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
      </group>

      <FlightParticles
        pose={pose}
        heart={textures[2].image}
        narrow={narrow}
        sceneAspect={sceneAspect}
        heartScale={heartScale}
        heartY={heartY}
      />
      <Suspense fallback={null}>
        <MerchStage3D
          pose={pose}
          gadgets={gadgets}
          narrow={narrow}
          isGadgetActive={isGadgetActive}
          selectedGadgetId={selectedGadgetId}
          onSelectGadget={onSelectGadget}
          reducedMotion={reducedMotion}
        />
      </Suspense>
    </>
  )
}

export default function UnicornScene(props: SceneProps) {
  return (
    <Canvas
      flat
      frameloop="demand"
      dpr={[1, window.innerWidth < 840 ? 1.2 : 1.5]}
      camera={{ fov: 43, position: [0, 0.4, 14], near: 0.1, far: 90 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      aria-hidden="true"
    >
      <SceneErrorBoundary onError={props.onUnavailable}>
        <World {...props} />
      </SceneErrorBoundary>
    </Canvas>
  )
}
