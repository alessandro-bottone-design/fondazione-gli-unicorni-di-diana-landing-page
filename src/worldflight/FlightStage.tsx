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

export function FlightStage({ pose, onReady, onUnavailable }: {
  pose: FlightPose
  onReady: () => void
  onUnavailable: () => void
}) {
  return (
    <div className="flight-stage" aria-hidden="true">
      <SceneBoundary onError={onUnavailable}>
        <Suspense fallback={null}>
          <Scene pose={pose} onReady={onReady} onUnavailable={onUnavailable} />
        </Suspense>
      </SceneBoundary>
    </div>
  )
}
