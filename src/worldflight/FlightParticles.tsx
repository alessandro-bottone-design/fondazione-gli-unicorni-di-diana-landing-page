import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import {
  BufferAttribute, CanvasTexture, Color, DynamicDrawUsage, MathUtils, Points, PointsMaterial,
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
    const pixel = ink[Math.floor((index + .5) * ink.length / count)]
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
    cloud[index + 1] = Math.sin(angle) * radius * .76
    cloud[index + 2] = (random(index + 6179) - .5) * .3
  }
  return cloud
}

function sampleShapeColors(shape: Float32Array, diagonal: boolean) {
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

  const spanX = Math.max(.001, maxX - minX)
  const spanY = Math.max(.001, maxY - minY)
  const color = new Color()
  const colors = new Float32Array(shape.length)
  for (let index = 0; index < shape.length; index += 3) {
    const nx = (shape[index] - minX) / spanX
    const ny = (shape[index + 1] - minY) / spanY
    const progress = diagonal ? nx * .62 + (1 - ny) * .38 : nx
    sampleRainbow(progress, color).toArray(colors, index)
  }
  return colors
}

function makeColors(unicornShape: Float32Array, heartShape: Float32Array) {
  const unicorn = sampleShapeColors(unicornShape, true)
  const heart = sampleShapeColors(heartShape, false)
  const attribute = new BufferAttribute(unicorn.slice(), 3).setUsage(DynamicDrawUsage)
  return { unicorn, heart, attribute, current: unicorn }
}

const smooth = MathUtils.smoothstep

export function FlightParticles({ pose, unicorn, heart, narrow, heartScale, heartY }: {
  pose: FlightPose
  unicorn: HTMLImageElement
  heart: HTMLImageElement
  narrow: boolean
  heartScale: number
  heartY: number
}) {
  const points = useRef<Points>(null!)
  const material = useRef<PointsMaterial>(null!)
  const count = narrow ? 850 : 1800
  const shapes = useMemo(() => ({
    unicorn: sampleInk(unicorn, count),
    heart: sampleInk(heart, count),
    cloud: makeCloud(count),
  }), [unicorn, heart, count])
  const position = useMemo(() => new BufferAttribute(new Float32Array(count * 3), 3).setUsage(DynamicDrawUsage), [count])
  const colors = useMemo(() => makeColors(shapes.unicorn, shapes.heart), [shapes.unicorn, shapes.heart])
  const dot = useMemo(makeDot, [])

  useEffect(() => () => dot.dispose(), [dot])

  useFrame(() => {
    const distance = pose.progress * flightLength
    const closing = distance >= 5.3
    const opacity = closing
      ? smooth(distance, 5.3, 5.56) * .96
      : smooth(distance, .42, .82) * (1 - smooth(distance, 1.13, 1.92)) * .86
    points.current.visible = opacity > .005
    if (!points.current.visible) return

    const palette = closing ? colors.heart : colors.unicorn
    if (colors.current !== palette) {
      colors.attribute.array.set(palette)
      colors.attribute.needsUpdate = true
      colors.current = palette
      material.current.size = closing ? (narrow ? .07 : .06) : (narrow ? .058 : .05)
    }

    const scatter = closing ? 1 - smooth(distance, 5.44, 6.06) : smooth(distance, .8, 1.37)
    const shape = closing ? shapes.heart : shapes.unicorn
    const scale = closing
      ? heartScale
      : MathUtils.lerp(narrow ? 1.35 : 2.45, narrow ? 2 : 3.35, scatter)
    const storyX = MathUtils.lerp(narrow ? -1.25 : -3.1, narrow ? .05 : .65, scatter)
    const storyY = MathUtils.lerp(narrow ? 1.35 : .95, narrow ? .8 : .62, scatter)
    points.current.position.set(
      closing ? 0 : storyX,
      closing ? heartY : storyY,
      closing ? -56.9 : -.42,
    )
    points.current.scale.setScalar(scale)
    material.current.opacity = opacity

    const values = position.array
    for (let index = 0; index < values.length; index += 3) {
      // Every point uses the same destination going forwards or backwards.
      values[index] = MathUtils.lerp(shape[index], shapes.cloud[index], scatter)
      values[index + 1] = MathUtils.lerp(shape[index + 1], shapes.cloud[index + 1], scatter)
      values[index + 2] = shapes.cloud[index + 2] * scatter
    }
    position.needsUpdate = true
  })

  return (
    <points ref={points} frustumCulled={false} visible={false} renderOrder={2}>
      <bufferGeometry>
        <primitive object={position} attach="attributes-position" />
        <primitive object={colors.attribute} attach="attributes-color" />
      </bufferGeometry>
      <pointsMaterial ref={material} vertexColors size={narrow ? .055 : .047} map={dot} transparent depthWrite={false} />
    </points>
  )
}
