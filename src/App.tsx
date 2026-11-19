import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import {
  ArrowDownRight, ArrowUpRight, Bone,
  Droplet, Facebook, FileText, GraduationCap,
  Instagram, MessageCircle, Phone,
} from 'lucide-react'
import { domAnimation, LazyMotion, MotionConfig, useReducedMotion } from 'motion/react'
import { chapters, contacts, credits, dianaPortrait, donation, foundation, schoolContact, solidarity, sphereEvents, whatsapp } from './content'
import { FlightStage } from './worldflight/FlightStage'
import { flightLength, flightStops } from './worldflight'
import type { FlightPose, StopId } from './worldflight'
import SphereImageGrid from './components/ui/img-sphere'
import GadgetGallery from './components/GadgetGallery'
import { IbanBox } from './components/IbanBox'
import { useScrollStory } from './worldflight/useScrollStory'
import { rainbowBorder, rainbowGradient, rainbowPastelWash, rainbowSurface } from './rainbow'

const rainbowVars = {
  '--rainbow-gradient': rainbowGradient,
  '--rainbow-border': rainbowBorder,
  '--rainbow-pastel': rainbowPastelWash,
  '--rainbow-surface': rainbowSurface,
} as const
const rainbowStyle = rainbowVars as CSSProperties

function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
}

function SiteHeader({ activeChapter }: { activeChapter: StopId }) {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="brand" href="#inizio" aria-label={`${foundation}, inizio pagina`}>
          <img src="/media/marchio.webp" width="38" height="48" alt="" />
        </a>
        <nav className="site-nav" aria-label="Tappe della storia">
          {chapters.map(({ id, label }) => {
            const isCurrent = id === activeChapter
            return (
              <a
                key={id}
                href={`#${id}`}
                className={isCurrent ? 'is-active' : undefined}
                aria-current={isCurrent ? 'location' : undefined}
              >
                {label}
              </a>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

function Hero({ fallback }: { fallback: boolean }) {
  return (
    <section className="hero" aria-labelledby="hero-title" tabIndex={-1}>
      <div className="shell hero-inner">
        <h1 id="hero-title" aria-label={foundation}>Gli Unicorni <em>di Diana.</em></h1>
        <div className="hero-stage" aria-hidden="true">
          {fallback && (
            <img className="fallback-poster" src="/media/unicorno-poster.webp" width={1024} height={1024} alt="" />
          )}
        </div>
        <p className="hero-cue">Scorri per scoprire di più</p>
        <p className="hero-credit">
          Scultura «Unicorn 3D» di <ExternalLink href={credits.model}>{credits.author}</ExternalLink>, adattata per questa pagina ·{' '}
          <ExternalLink href={credits.license}>licenza CC BY 4.0</ExternalLink>
        </p>
      </div>
    </section>
  )
}

function Story({ fallback }: { fallback: boolean }) {
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
          {fallback && (
            <figure className="story-portrait">
              <img
                src={dianaPortrait.src}
                width={dianaPortrait.width}
                height={dianaPortrait.height}
                alt="Ritratto di Diana"
                decoding="async"
              />
            </figure>
          )}
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
            <p>Dai 18 anni, in buona salute, dopo un colloquio medico: scopri come funziona la donazione e trova un centro trasfusionale.</p>
            <ExternalLink className="text-link" href={donation.blood}>Come donare il sangue <ArrowUpRight size={18} /></ExternalLink>
          </article>
          <article className="pathway">
            <span className="pathway-icon"><Bone size={28} strokeWidth={1.5} /></span>
            <h3>Donare midollo osseo</h3>
            <p>Iscrizione tra i 18 e i 35 anni nel Registro italiano dei donatori: per iniziare basta un prelievo di sangue o un tampone salivare.</p>
            <ExternalLink className="text-link" href={donation.marrow}>Vai al registro donatori <ArrowUpRight size={18} /></ExternalLink>
            <ExternalLink className="text-link resource-link" href="/media/archivio/guida-midollo.pdf"><FileText size={16} /> Pieghevole della campagna (PDF, 2,3 MB) <ArrowUpRight size={16} /></ExternalLink>
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

function Gadgets({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <section className="chapter gadgets" aria-labelledby="gadgets-title" tabIndex={-1}>
      <div className="shell chapter-shell">
        <GadgetGallery selectedId={selectedId} onSelect={onSelect} />
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
              <a className="button button-outline" href={`tel:${contacts.telephone}`}><Phone size={20} /> {contacts.phone}</a>
              <ExternalLink className="button button-outline" href={contacts.instagram}><Instagram size={20} /> Instagram <ArrowUpRight size={16} /></ExternalLink>
              <ExternalLink className="button button-outline" href={contacts.facebook}><Facebook size={20} /> Facebook <ArrowUpRight size={16} /></ExternalLink>
            </div>
            <IbanBox compact />
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
  const [webglUnavailable, setWebglUnavailable] = useState(false)
  const [selectedGadgetId, setSelectedGadgetId] = useState<string>(solidarity[0].id)
  const reducedMotion = useReducedMotion() ?? false
  const flight = !webglUnavailable

  // Any loading or WebGL failure falls back cleanly instead of leaving an empty stage.
  const onUnavailable = useCallback(() => { setWebglUnavailable(true) }, [])
  const controller = useScrollStory(track, flight, pose.current, setActive, onUnavailable)

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
  const activeChapter = flightStops[active].id
  const panels = [
    <Hero fallback={webglUnavailable} />,
    <Story fallback={webglUnavailable} />,
    <Objectives />,
    <Archive active={!flight || active === archiveStop} />,
    <Gadgets selectedId={selectedGadgetId} onSelect={setSelectedGadgetId} />,
    <Contacts />,
  ]

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div
          className={flight ? 'flight-mode' : 'fallback-mode'}
          data-chapter={activeChapter}
          onClick={navigate}
          style={rainbowStyle}
        >
          <div className="page-atmosphere" aria-hidden="true" />
          <a className="skip-link" href="#inizio">Vai al contenuto</a>
          <SiteHeader activeChapter={activeChapter} />
          {flight && (
            <FlightStage
              pose={pose.current}
              isGadgetActive={activeChapter === 'gadget'}
              selectedGadgetId={selectedGadgetId}
              onSelectGadget={setSelectedGadgetId}
              reducedMotion={reducedMotion}
              onReady={onReady}
              onUnavailable={onUnavailable}
            />
          )}
          <main ref={track} className="flight-track" style={{ '--flight-length': flightLength } as CSSProperties}>
            {webglUnavailable && (
              <p className="shell fallback-notice" role="status">
                La scena 3D non è disponibile su questo dispositivo: puoi comunque consultare tutti i contenuti della Fondazione.
              </p>
            )}
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
