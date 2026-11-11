export const flightStops = [
  { id: 'inizio', at: 0, arrival: 0 },
  { id: 'storia', at: 0.85, arrival: 1.08 },
  { id: 'obiettivi', at: 1.8, arrival: 2.05 },
  { id: 'eventi', at: 2.85, arrival: 3.72 },
  { id: 'gadget', at: 4.5, arrival: 4.76 },
  { id: 'contatti', at: 5.3, arrival: 6.06 },
] as const

export const flightLength = 6.3

export type StopId = typeof flightStops[number]['id']

export interface FlightPose {
  progress: number
  invalidate?: () => void
}

export function stopAt(distance: number) {
  for (let index = flightStops.length - 1; index > 0; index--) {
    if (distance + 0.001 >= flightStops[index].at) return index
  }
  return 0
}
