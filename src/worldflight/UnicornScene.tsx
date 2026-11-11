import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import {
  BufferGeometry, CatmullRomCurve3, Float32BufferAttribute, Group, Line, LineBasicMaterial,
  MathUtils, MeshBasicMaterial, Shape, ShapeGeometry, SRGBColorSpace, TextureLoader, Vector3,
} from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import { archiveMedia } from '../content'
import { flightLength } from './index'
import type { FlightPose } from './index'
import { heartPaths } from '../components/Art'

interface SceneProps {
  pose: FlightPose
  onReady: () => void
  onUnavailable: () => void
}

const draco = new DRACOLoader().setDecoderPath('/media/draco/').setWorkerLimit(1)
const media = ['/media/diana.webp', ...archiveMedia.map(({ file }) => `/media/archivio/${file}-thumb.webp`)]

type Position = [number, number, number]
type Keyframe = { at: number; eye: Position; target: Position }

const route: Keyframe[] = [
  { at: 0, eye: [0, .4, 14], target: [0, 0, 0] },
  { at: .85, eye: [-2, .2, 8], target: [-2.05, -.36, 0] },
  { at: 1.32, eye: [-2.3, .14, 6.8], target: [-2.36, -.57, 0] },
  { at: 1.8, eye: [0, .8, -4.2], target: [0, -.65, -15] },
  { at: 2.45, eye: [.16, .46, -11.3], target: [0, -.51, -20] },
  { at: 2.85, eye: [0, .24, -17.5], target: [0, -.74, -34] },
  { at: 3.72, eye: [0, .2, -23.7], target: [0, -.74, -34] },
  { at: 4.23, eye: [0, .2, -23.7], target: [0, -.74, -34] },
  { at: 4.5, eye: [.4, .62, -35.6], target: [.32, -.27, -46] },
  { at: 5.03, eye: [.1, .49, -39], target: [0, -.37, -48] },
  { at: 5.3, eye: [0, .25, -46.6], target: [0, -.7, -57] },
  { at: 6.06, eye: [0, .25, -49], target: [0, -.7, -57] },
  { at: flightLength, eye: [0, .25, -49], target: [0, -.7, -57] },
]

const smooth = (value: number, start: number, end: number) => MathUtils.smoothstep(value, start, end)

function makeArch() {
  const shape = new Shape()
  shape.moveTo(-.5, -.07)
  shape.bezierCurveTo(-.5, .27, -.3, .5, 0, .5)
  shape.bezierCurveTo(.3, .5, .5, .27, .5, -.07)
  shape.bezierCurveTo(.5, -.36, .32, -.5, 0, -.5)
  shape.bezierCurveTo(-.32, -.5, -.5, -.36, -.5, -.07)
  const geometry = new ShapeGeometry(shape, 32)
  const uv = geometry.attributes.uv
  for (let index = 0; index < uv.count; index++) {
    uv.setXY(index, .5 + uv.getX(index) * .66, uv.getY(index) + .5)
  }
  return geometry
}

function makeHeart() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg">${heartPaths.map((path) => `<path d="${path}"/>`).join('')}</svg>`
  return new SVGLoader().parse(svg).paths.map(({ subPaths }) => {
    const points = subPaths[0].getPoints(24).map(({ x, y }) => new Vector3((x - 284) / 77, (200 - y) / 77, 0))
    return new Line(
      new BufferGeometry().setFromPoints(points),
      new LineBasicMaterial({ color: '#edc9ff', fog: false }),
    )
  })
}

function makeStars() {
  const positions = []
  for (let index = 0; index < 320; index++) {
    const x = Math.sin(index * 17.381) * (6 + index % 8)
    const y = Math.cos(index * 4.763) * (2 + index % 6)
    const z = 6 - (index * 13.71) % 75
    positions.push(x, y, z)
  }
  return new Float32BufferAttribute(positions, 3)
}

function makeTrail(side: number, endY: number) {
  return new CatmullRomCurve3([
    [side * 6, -.12, .15], [side * 2.7, -1.02, -3], [side * .7, -1.7, -7],
    [side * 2.2, -1.87, -13], [side * 3.5, -1.42, -18], [side * .85, -1.8, -24],
    [side * 4.4, -.92, -32], [side * 5.5, -.78, -36], [side * 2.8, -1.46, -40],
    [side * 1.5, -1.7, -46], [side * .3, -1.15, -51], [0, endY, -56.95],
  ].map(([x, y, z]) => new Vector3(x, y, z)))
}

const desktopPhotos: Position[] = [
  [-4.65, .38, -34], [-2.44, 1.02, -34.35], [0, 1.51, -34.6],
  [2.43, 1.02, -34.34], [4.64, .38, -34],
]
const mobilePhotos: Position[] = [
  [-1.15, 1.32, -34], [0, 1.64, -34.22], [1.15, 1.32, -34],
  [-.64, -.06, -34.1], [.64, -.06, -34.1],
]

function World({ pose, onReady, onUnavailable }: SceneProps) {
  const { nodes } = useLoader(GLTFLoader, '/media/scena-unicorni.glb', (loader) => loader.setDRACOLoader(draco))
  const textures = useLoader(TextureLoader, media)
  const { camera, gl, invalidate, size } = useThree()
  const left = useRef<Group>(null!)
  const right = useRef<Group>(null!)
  const portrait = useRef<Group>(null!)
  const photoGroups = useRef<(Group | null)[]>([])
  const photoMaterials = useRef<(MeshBasicMaterial | null)[]>([])
  const photoFrames = useRef<(MeshBasicMaterial | null)[]>([])
  const ready = useRef(false)
  const aim = useMemo(() => new Vector3(), [])
  const arch = useMemo(makeArch, [])
  const heart = useMemo(makeHeart, [])
  const stars = useMemo(makeStars, [])
  const narrow = size.width / Math.max(1, size.height) < 1
  const sceneAspect = size.width / Math.max(1, size.height)
  const sideScale = Math.min(1, sceneAspect / 1.4)
  const photoPositions = narrow ? mobilePhotos : desktopPhotos
  const heartScale = Math.min(.74, sceneAspect * .83)
  const heartY = narrow ? .76 : .59
  const trailEnd = heartY - (118 / 77) * heartScale
  const trails = useMemo(() => [-1, 1].map((side) => makeTrail(side, trailEnd)), [trailEnd])

  useEffect(() => {
    textures.forEach((texture) => { texture.colorSpace = SRGBColorSpace })
    pose.invalidate = invalidate
    const canvas = gl.domElement
    canvas.addEventListener('webglcontextlost', onUnavailable)
    return () => {
      delete pose.invalidate
      canvas.removeEventListener('webglcontextlost', onUnavailable)
    }
  }, [gl, invalidate, onUnavailable, pose, textures])

  useEffect(() => () => {
    arch.dispose()
    heart.forEach((line) => { line.geometry.dispose(); line.material.dispose() })
  }, [arch, heart])

  useFrame(() => {
    const distance = pose.progress * flightLength
    const nextIndex = route.findIndex((keyframe) => keyframe.at > distance)
    const end = route[nextIndex < 0 ? route.length - 1 : nextIndex]
    const start = route[nextIndex < 0 ? route.length - 2 : Math.max(0, nextIndex - 1)]
    const t = smooth(distance, start.at, end.at)
    const mix = (a: number, b: number) => MathUtils.lerp(a, b, t)
    camera.position.set(mix(start.eye[0], end.eye[0]) * sideScale, mix(start.eye[1], end.eye[1]), mix(start.eye[2], end.eye[2]))
    aim.set(mix(start.target[0], end.target[0]) * sideScale, mix(start.target[1], end.target[1]), mix(start.target[2], end.target[2]))
    camera.lookAt(aim)

    const departure = smooth(distance, 0, .79)
    const spread = Math.min(5.1, sceneAspect * (narrow ? 3.34 : 2.8))
    const openingLift = narrow ? .52 * (1 - smooth(distance, .28, 1.1)) : 0
    left.current.position.set(-spread - departure * 1.35, openingLift + departure * .54, -departure * 1.65)
    right.current.position.set(spread + departure * 1.35, openingLift + departure * .54, -departure * 1.65)
    portrait.current.position.y = .03 + openingLift
    left.current.rotation.set(0, departure * .7, -departure * .1)
    right.current.rotation.set(0, -departure * .7, departure * .1)
    left.current.visible = distance < 1.62
    right.current.visible = distance < 1.62
    portrait.current.visible = distance < 1.72

    photoGroups.current.forEach((group, index) => {
      if (!group) return
      const arrival = smooth(distance, 2.92 + index * .115, 3.26 + index * .115)
      const leave = 1 - smooth(distance, 4.27, 4.5)
      const material = photoMaterials.current[index]
      const frame = photoFrames.current[index]
      group.visible = arrival * leave > .005
      group.position.y = photoPositions[index][1] - (1 - arrival) * .65
      if (material) material.opacity = arrival * leave
      if (frame) frame.opacity = arrival * leave * .94
    })

    const drawn = smooth(distance, 5.27, 6.06)
    heart.forEach((line, index) => {
      const length = line.geometry.attributes.position.count
      const segment = MathUtils.clamp(drawn * 1.65 - index * .28, 0, 1)
      line.geometry.setDrawRange(0, Math.ceil(length * segment))
    })

    if (!ready.current) {
      ready.current = true
      onReady()
    }
  })

  const statueScale = narrow ? .52 : .92
  const portraitScale = narrow ? .58 : .96

  return (
    <>
      <fog attach="fog" args={['#3b1768', 15, 39]} />
      <ambientLight color="#e5cafa" intensity={1.12} />
      <directionalLight color="#fff0fd" position={[-4, 7, 7]} intensity={2.15} />
      <directionalLight color="#c9acff" position={[2, 4, -6]} intensity={2.3} />
      <points>
        <bufferGeometry><primitive object={stars} attach="attributes-position" /></bufferGeometry>
        <pointsMaterial color="#d5b2f7" size={.041} transparent opacity={.35} depthWrite={false} />
      </points>
      <group scale={[narrow ? .61 : 1, 1, 1]}>
        {trails.map((trail, index) => (
          <mesh key={index}>
            <tubeGeometry args={[trail, 220, .02, 5, false]} />
            <meshBasicMaterial color={index ? '#ac72e2' : '#ddabff'} transparent opacity={index ? .65 : .84} />
          </mesh>
        ))}
      </group>
      <group ref={left} scale={statueScale}><primitive object={nodes.UnicornoSinistra} /></group>
      <group ref={right} scale={statueScale}><primitive object={nodes.UnicornoDestra} /></group>
      <group ref={portrait} position={[0, .03, .18]} scale={portraitScale}>
        <mesh geometry={arch} scale={[3.76, 4.12, 1]} renderOrder={3}>
          <meshBasicMaterial color="#deb4ff" fog={false} transparent depthTest={false} depthWrite={false} />
        </mesh>
        <mesh geometry={arch} scale={[3.66, 4.02, 1]} renderOrder={4}>
          <meshBasicMaterial map={textures[0]} toneMapped={false} fog={false} transparent depthTest={false} depthWrite={false} />
        </mesh>
      </group>
      {archiveMedia.map(({ file }, index) => {
        const texture = textures[index + 1]
        const ratio = texture.image.width / texture.image.height
        const height = narrow ? 1.13 : 2.65
        const width = height * ratio
        return (
          <group
            key={file}
            ref={(group) => { photoGroups.current[index] = group }}
            position={photoPositions[index]}
            rotation={[0, (2 - index) * .068, (index % 2 ? 1 : -1) * .047]}
            visible={false}
          >
            <mesh position={[0, 0, -.045]}>
              <planeGeometry args={[width + .10, height + .10]} />
              <meshBasicMaterial ref={(material) => { photoFrames.current[index] = material }} color="#ead0fb" transparent opacity={0} depthWrite={false} />
            </mesh>
            <mesh>
              <planeGeometry args={[width, height]} />
              <meshBasicMaterial ref={(material) => { photoMaterials.current[index] = material }} map={texture} transparent opacity={0} depthWrite={false} toneMapped={false} />
            </mesh>
          </group>
        )
      })}
      <group position={[0, heartY, -56.9]} scale={heartScale}>
        {heart.map((line, index) => <primitive key={index} object={line} />)}
      </group>
    </>
  )
}

export default function UnicornScene(props: SceneProps) {
  return (
    <Canvas
      flat
      frameloop="demand"
      dpr={[1, window.innerWidth < 840 ? 1.2 : 1.5]}
      camera={{ fov: 43, position: [0, .4, 14], near: .1, far: 90 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      aria-hidden="true"
    >
      <World {...props} />
    </Canvas>
  )
}
