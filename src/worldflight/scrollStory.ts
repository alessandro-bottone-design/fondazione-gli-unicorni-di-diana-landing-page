import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { flightLength, flightStops, stopAt } from './index'
import type { FlightPose } from './index'

gsap.registerPlugin(ScrollTrigger)

export function createScrollStory(track: HTMLElement, pose: FlightPose, setActive: (index: number) => void) {
  const panels = [...track.querySelectorAll<HTMLElement>('.flight-panel')]
  const finish = track.querySelector<HTMLElement>('.flight-finish')!
  let previous = -1

  function render(progress: number) {
    const distance = progress * flightLength
    const index = Math.max(0, stopAt(distance))
    const stop = flightStops[index]
    const next = flightStops[index + 1]
    const entrance = index === 0 ? 1 : Math.min(1, (distance - stop.at) / 0.16)
    const exit = next ? Math.min(1, (next.at - distance) / 0.16) : 1

    if (previous !== index) {
      panels[previous]?.style.removeProperty('--flight-opacity')
      previous = index
      setActive(index)
    }
    panels[index]?.style.setProperty('--flight-opacity', String(0.9 + 0.1 * Math.min(entrance, exit)))
    if (index === 0) {
      const departure = gsap.utils.clamp(0, 1, (distance - .18) / .38)
      panels[0]?.style.setProperty('--hero-copy-opacity', String(1 - departure))
    }
    pose.progress = progress
    pose.invalidate?.()
  }

  const trigger = ScrollTrigger.create({
    start: 0,
    end: () => finish.offsetTop,
    invalidateOnRefresh: true,
    onUpdate: ({ progress }) => render(progress),
    onRefresh: ({ progress }) => render(progress),
  })

  const update = () => {
    const length = Math.max(1, finish.offsetTop)
    render(Math.min(1, Math.max(0, window.scrollY / length)))
  }
  update()

  return {
    update,
    destroy() {
      trigger.kill()
      panels[0]?.style.removeProperty('--hero-copy-opacity')
      panels.forEach((panel) => panel.style.removeProperty('--flight-opacity'))
    },
  }
}
