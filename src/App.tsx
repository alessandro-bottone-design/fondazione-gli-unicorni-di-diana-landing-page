import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import {
  ArrowDownRight, ArrowUpRight, Bone,
  Droplet, Facebook, FileText, GraduationCap,
  Instagram, MessageCircle,
} from 'lucide-react'
import { domAnimation, LazyMotion, MotionConfig } from 'motion/react'
import { chapters, contacts, credits, donation, foundation, schoolContact, sphereEvents, whatsapp } from './content'
import { FlightStage } from './worldflight/FlightStage'
import { flightLength, flightStops } from './worldflight'
import type { FlightPose } from './worldflight'
import SphereImageGrid from './components/ui/img-sphere'
import GadgetGallery from './components/GadgetGallery'
import { useScrollStory } from './worldflight/useScrollStory'
import { rainbowBorder, rainbowGradient, rainbowPastelWash, rainbowSurface } from './rainbow'

const rainbowVars = {
  '--rainbow-gradient': rainbowGradient,
  '--rainbow-border': rainbowBorder,
  '--rainbow-pastel': rainbowPastelWash,
  '--rainbow-surface': rainbowSurface,
} as const
const rainbowStyle = rainbowVars as CSSProperties

type Mode = 'flight' | 'linear'

function prefersLinear() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
}

function SiteHeader({ mode, onToggleMode }: { mode: Mode; onToggleMode: () => void }) {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="brand" href="#inizio" aria-label={`${foundation}, inizio pagina`}>
          <img src="/media/marchio.webp" width="38" height="48" alt="" />
        </a>
        <nav className="site-nav" aria-label="Tappe della storia">
          {chapters.map(({ id, label }) => (
            <a key={id} href={`#${id}`}>{label}</a>
          ))}
        </nav>
        <button
          type="button"
          className="nav-toggle"
          aria-pressed={mode === 'linear'}
          onClick={onToggleMode}
        >
          {mode === 'linear' ? 'Torna al viaggio' : 'Versione lineare'}
        </button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title" tabIndex={-1}>
      <div className="shell hero-inner">
        <h1 id="hero-title" aria-label={foundation}>Gli Unicorni <em>di Diana.</em></h1>
        <div className="hero-stage" aria-hidden="true" />
        <p className="hero-cue">Scorri per scoprire di più</p>
        <p className="hero-credit">
          Scultura «Unicorn 3D» di <ExternalLink href={credits.model}>{credits.author}</ExternalLink>, adattata per questa pagina ·{' '}
          <ExternalLink href={credits.license}>licenza CC BY 4.0</ExternalLink>
        </p>
      </div>
    </section>
  )
}

function Story() {
  return (
    <section className="chapter story" aria-labelledby="story-title" tabIndex={-1}>
      <div className="shell chapter-shell">
        <div className="story-layout">
          <div className="story-copy">
            <h2 id="story-title">Da Diana,<br /> <em>il primo passo.</em></h2>
            <p>Diana aveva sei anni. Il suo sorriso è il punto da cui parte questa storia.</p>
            <p>Nel suo ricordo sono nati Gli Unicorni di Diana, per far conoscere la donazione di sangue e midollo osseo.</p>
            <p>Oggi incontriamo studentesse e studenti, ascoltiamo le loro domande e raccontiamo da dove cominciare.</p>
            <a className="text-link story-next" href="#obiettivi">Scopri come donare <ArrowDownRight size={17} /></a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Objectives() {
  return (
    <section className="chapter objectives" aria-labelledby="objectives-title" tabIndex={-1}>
      <div className="shell chapter-shell">
        <div className="objective-heading">
          <h2 id="objectives-title">Come si comincia<br /> <em>a donare?</em></h2>
          <p>Se hai almeno 18 anni e vuoi fare il primo passo, scegli da dove iniziare. Ogni percorso ha requisiti e passaggi propri.</p>
        </div>
        <div className="pathways">
          <article className="pathway">
            <span className="pathway-icon"><Droplet size={28} strokeWidth={1.5} /></span>
            <h3>Donare sangue</h3>
            <p>Scopri come funziona la donazione e come trovare un centro trasfusionale.</p>
            <ExternalLink className="text-link" href={donation.blood}>Come donare il sangue <ArrowUpRight size={18} /></ExternalLink>
          </article>
          <article className="pathway">
            <span className="pathway-icon"><Bone size={28} strokeWidth={1.5} /></span>
            <h3>Donare midollo osseo</h3>
            <p>Scopri come dare la tua disponibilità nel Registro italiano dei donatori di midollo osseo.</p>
            <ExternalLink className="text-link" href={donation.marrow}>Vai al registro donatori <ArrowUpRight size={18} /></ExternalLink>
            <ExternalLink className="text-link resource-link" href="/media/archivio/guida-midollo.pdf"><FileText size={16} /> Pieghevole della campagna <ArrowUpRight size={16} /></ExternalLink>
          </article>
        </div>
        <div className="school-note">
          <GraduationCap size={28} strokeWidth={1.5} />
          <p>Vuoi parlare di donazione nella tua scuola?</p>
          <ExternalLink className="text-link" href={schoolContact}>Portaci nella tua scuola <ArrowUpRight size={18} /></ExternalLink>
        </div>
      </div>
    </section>
  )
}

function computeSphereSize() {
  if (window.innerWidth < 720) {
    return Math.round(Math.min(380, window.innerWidth * 0.92, window.innerHeight * 0.52))
  }
  if (window.innerWidth < 960) {
    return Math.round(Math.min(520, window.innerWidth * 0.72, window.innerHeight * 0.58))
  }
  return Math.round(Math.min(680, window.innerWidth * 0.52, window.innerHeight * 0.76))
}

function Archive({ active }: { active: boolean }) {
  const [sphereSize, setSphereSize] = useState(computeSphereSize)

  useEffect(() => {
    function update() { setSphereSize(computeSphereSize()) }
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <section className="chapter archive" aria-labelledby="archive-title" tabIndex={-1}>
      <div className="shell chapter-shell">
        <div className="archive-stage">
          <div className="archive-heading">
            <h2 id="archive-title">Dove ci siamo<br /> <em>incontrati.</em></h2>
            <p>Dalle aule alle iniziative solidali. Trascina la sfera e clicca una bolla per scoprire ogni evento.</p>
          </div>
          <div className="archive-sphere">
            <SphereImageGrid
              images={sphereEvents}
              containerSize={sphereSize}
              sphereRadius={Math.round(sphereSize * 0.4)}
              dragSensitivity={0.65}
              momentumDecay={0.96}
              maxRotationSpeed={6}
              baseImageScale={0.17}
              hoverScale={1.2}
              autoRotate={active}
              autoRotateSpeed={0.22}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function Gadgets() {
  return (
    <section className="chapter gadgets" aria-labelledby="gadgets-title" tabIndex={-1}>
      <div className="shell chapter-shell">
        <GadgetGallery />
      </div>
    </section>
  )
}

function Contacts() {
  return (
    <section className="chapter contact" aria-labelledby="contact-title" tabIndex={-1}>
      <div className="shell chapter-shell">
        <div className="contact-layout">
          <div className="contact-copy">
            <h2 id="contact-title">Un gesto può far <em>volare una vita.</em></h2>
            <p className="contact-intro">Segui le iniziative o scrivi a Rossella per sapere da dove partire.</p>
            <div className="contact-actions">
              <ExternalLink className="button button-ink" href={whatsapp('Ciao Rossella, vorrei informazioni sulle attività degli Unicorni di Diana.')}><MessageCircle size={20} /> Scrivi a Rossella <ArrowUpRight size={16} /></ExternalLink>
              <ExternalLink className="button button-outline" href={contacts.instagram}><Instagram size={20} /> Instagram <ArrowUpRight size={16} /></ExternalLink>
              <ExternalLink className="button button-outline" href={contacts.facebook}><Facebook size={20} /> Facebook <ArrowUpRight size={16} /></ExternalLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function indexForHash(hash: string) {
  return flightStops.findIndex(({ id }) => hash === `#${id}`)
}

export default function App() {
  const track = useRef<HTMLElement>(null)
  const pose = useRef<FlightPose>({ progress: 0 })
  const [active, setActive] = useState(() => Math.max(0, indexForHash(location.hash)))
  const [mode, setMode] = useState<Mode>(() => (prefersLinear() ? 'linear' : 'flight'))
  const flight = mode === 'flight'

  // Any loading or WebGL failure falls back to the linear page instead of an empty stage.
  const onUnavailable = useCallback(() => { setMode('linear') }, [])
  const controller = useScrollStory(track, flight, pose.current, setActive, onUnavailable)

  const toggleMode = useCallback(() => {
    setMode((current) => (current === 'flight' ? 'linear' : 'flight'))
  }, [])

  const onReady = useCallback(() => {
    controller.current?.update()
  }, [controller])

  const goTo = useCallback((index: number, focus = false) => {
    const stop = document.getElementById(flightStops[index].id)
    if (!stop) return
    stop.scrollIntoView({ behavior: 'instant', block: 'start' })
    controller.current?.update()
    setActive(index)
    if (focus) {
      requestAnimationFrame(() => {
        stop.querySelector<HTMLElement>('.flight-panel > section')?.focus({ preventScroll: true })
      })
    }
  }, [controller])

  const activeRef = useRef(active)
  activeRef.current = active
  const firstMode = useRef(true)

  // Switching mode keeps the chapter the visitor was reading.
  useEffect(() => {
    if (firstMode.current) {
      firstMode.current = false
      return
    }
    const id = flightStops[activeRef.current].id
    if (mode === 'linear') {
      document.getElementById(id)?.scrollIntoView({ block: 'start' })
    } else {
      goTo(activeRef.current)
    }
  }, [mode, goTo])

  useLayoutEffect(() => {
    const rootStyle = document.documentElement.style
    Object.entries(rainbowVars).forEach(([name, value]) => {
      rootStyle.setProperty(name, value)
    })
  }, [])

  useLayoutEffect(() => {
    const index = indexForHash(location.hash)
    if (index > 0) goTo(index)
  }, [goTo])

  useEffect(() => {
    function readHash() {
      const index = indexForHash(location.hash)
      if (index !== -1) goTo(index)
      else if (!location.hash) goTo(0)
    }
    const restoration = history.scrollRestoration
    history.scrollRestoration = 'manual'
    window.addEventListener('hashchange', readHash)
    return () => {
      history.scrollRestoration = restoration
      window.removeEventListener('hashchange', readHash)
    }
  }, [goTo])

  function navigate(event: MouseEvent<HTMLDivElement>) {
    if (!flight) return
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const href = (event.target as Element).closest('a')?.getAttribute('href')
    if (!href) return
    const index = indexForHash(href)
    if (index === -1) return
    event.preventDefault()
    if (location.hash !== href) history.pushState(null, '', href)
    goTo(index, true)
  }

  const archiveStop = flightStops.findIndex(({ id }) => id === 'eventi')
  const panels = [<Hero />, <Story />, <Objectives />, <Archive active={!flight || active === archiveStop} />, <Gadgets />, <Contacts />]
  const activeChapter = flightStops[active].id

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div
          className={flight ? 'flight-mode' : 'linear-mode'}
          data-chapter={activeChapter}
          data-mode={mode}
          onClick={navigate}
          style={rainbowStyle}
        >
          <div className="page-atmosphere" aria-hidden="true" />
          <a className="skip-link" href="#inizio">Vai al contenuto</a>
          <SiteHeader mode={mode} onToggleMode={toggleMode} />
          {flight && <FlightStage pose={pose.current} onReady={onReady} onUnavailable={onUnavailable} />}
          <main ref={track} className="flight-track" style={{ '--flight-length': flightLength } as CSSProperties}>
            {flightStops.map(({ id, arrival }, index) => (
              <div className="flight-stop" id={id} key={id} style={{ '--flight-arrival': arrival } as CSSProperties}>
                <div className={`flight-panel${flight && active === index ? ' is-active' : ''}`} inert={flight && active !== index}>
                  {panels[index]}
                </div>
              </div>
            ))}
            {flight && <div className="flight-finish" aria-hidden="true" />}
          </main>
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}
