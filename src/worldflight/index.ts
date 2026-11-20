export const flightStops = [
  { id: 'inizio', at: 0, arrival: 0 },
  { id: 'storia', at: 0.85, arrival: 1.08 },
  { id: 'obiettivi', at: 1.8, arrival: 2.05 },
  { id: 'progetti', at: 2.65, arrival: 2.95 },
  { id: 'nuovi-eventi', at: 3.5, arrival: 3.8 },
  { id: 'eventi', at: 4.35, arrival: 4.95 },
  { id: 'gadget', at: 5.65, arrival: 5.95 },
  { id: 'contatti', at: 6.5, arrival: 7.2 },
] as const

export const flightLength = 7.45

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
