import { Component, Suspense, lazy } from 'react'
import type { ReactNode } from 'react'
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
        src="/media/unicorno-poster.webp"
        width={1024}
        height={1024}
        alt=""
        decoding="async"
      />
    </div>
  )
}

export function FlightStage({
  pose,
  isGadgetActive,
  selectedGadgetId,
  onSelectGadget,
  reducedMotion,
  onReady,
  onUnavailable,
}: {
  pose: FlightPose
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
