import { Component, Suspense, lazy } from 'react'
import type { ReactNode } from 'react'
import type { SolidarityProduct } from '@/content'
import type { FlightPose } from './index'

const Scene = lazy(() => import('./UnicornScene'))

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
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

function FlightPoster() {
  return (
    <div className="flight-poster" aria-hidden="true">
      <img
        src="/media/marchio.webp"
        width={653}
        height={822}
        alt=""
        decoding="async"
      />
    </div>
  )
}

export function FlightStage({
  pose,
  gadgets,
  isGadgetActive,
  selectedGadgetId,
  onSelectGadget,
  reducedMotion,
  onReady,
  onUnavailable,
}: {
  pose: FlightPose
  gadgets: readonly SolidarityProduct[]
  isGadgetActive: boolean
  selectedGadgetId: string
  onSelectGadget: (id: string) => void
  reducedMotion: boolean
  onReady: () => void
  onUnavailable: () => void
}) {
  return (
    <div className="flight-stage" aria-hidden="true">
      <SceneBoundary onError={onUnavailable}>
        <Suspense fallback={<FlightPoster />}>
          <Scene
            pose={pose}
            gadgets={gadgets}
            isGadgetActive={isGadgetActive}
            selectedGadgetId={selectedGadgetId}
            onSelectGadget={onSelectGadget}
            reducedMotion={reducedMotion}
            onReady={onReady}
            onUnavailable={onUnavailable}
          />
        </Suspense>
      </SceneBoundary>
    </div>
  )
}
