import { Color, MathUtils, SRGBColorSpace } from 'three'
import { rainbowVividStops } from '../rainbow'

function toSRGBStops(hexStops: readonly string[]) {
  return hexStops.map((hex) => new Color(hex).convertLinearToSRGB())
}

const vividStops = toSRGBStops(rainbowVividStops)

function sampleStops(stops: Color[], progress: number, color: Color) {
  const position = MathUtils.clamp(progress, 0, 1) * (stops.length - 1)
  const index = Math.min(Math.floor(position), stops.length - 2)
  color.copy(stops[index]).lerp(stops[index + 1], position - index)
  return color.setRGB(color.r, color.g, color.b, SRGBColorSpace)
}

export function sampleRainbow(progress: number, color: Color) {
  return sampleStops(vividStops, progress, color)
}
