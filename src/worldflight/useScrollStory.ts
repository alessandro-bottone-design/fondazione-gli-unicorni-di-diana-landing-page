import { useLayoutEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { FlightPose } from './index'
import type { createScrollStory } from './scrollStory'

export function useScrollStory(
  track: RefObject<HTMLElement | null>,
  flight: boolean,
  pose: FlightPose,
  setActive: (index: number) => void,
  onUnavailable: () => void,
) {
  const controller = useRef<ReturnType<typeof createScrollStory> | null>(null)

  useLayoutEffect(() => {
    const element = track.current
    if (!flight || !element) return

    let current = true
    void import('./scrollStory').then(({ createScrollStory }) => {
      if (current) controller.current = createScrollStory(element, pose, setActive)
    }).catch(() => {
      if (current) onUnavailable()
    })

    return () => {
      current = false
      controller.current?.destroy()
      controller.current = null
    }
  }, [track, flight, pose, setActive, onUnavailable])

  return controller
}
