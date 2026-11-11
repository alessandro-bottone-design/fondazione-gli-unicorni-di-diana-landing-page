import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import {
  ArrowDown, ArrowDownRight, ArrowRight, ArrowUp, ArrowUpRight, Badge, Bone,
  BookOpen, Circle, CookingPot, Droplet, Facebook, FileText, GraduationCap,
  Instagram, MapPin, Menu, MessageCircle, PencilLine, Phone, Shirt, Tag,
} from 'lucide-react'
import { domAnimation, LazyMotion, MotionConfig } from 'motion/react'
import * as m from 'motion/react-m'
import { archiveMedia, chapters, contacts, credits, donation, events, foundation, gifts, schoolContact, solidarity, whatsapp } from './content'
import { Fork, WingedHeart } from './components/Art'
import { UnicornFigure } from './components/UnicornFigure'
import { FlightStage } from './worldflight/FlightStage'
import { flightLength, flightStops } from './worldflight'
import type { FlightPose, StopId } from './worldflight'
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger,
} from './components/ui/dialog'
import { useScrollStory } from './worldflight/useScrollStory'

const itemIcons = {
  pen: PencilLine,
  pin: Badge,
  bracelet: Circle,
  shirt: Shirt,
  sweatshirt: Shirt,
  hat: Tag,
  book: BookOpen,
}

function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
}

function ChapterMark({ label }: { label: string }) {
  return <p className="chapter-mark" aria-hidden="true">{label}</p>
}

function SiteHeader({ active, modeLabel, toggleMode }: {
  active: StopId
  modeLabel: string | null
  toggleMode: (destination?: StopId) => void
}) {
  const menuNavigating = useRef(false)
  const chapterAtOpen = useRef(active)
  const changeModeAfterClose = useRef<StopId | null>(null)

  function focusDestination(event: Event) {
    const destination = changeModeAfterClose.current
    if (destination) {
      changeModeAfterClose.current = null
      requestAnimationFrame(() => toggleMode(destination))
    }
    if (!menuNavigating.current) return
    menuNavigating.current = false
    event.preventDefault()
  }

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="brand" href="#inizio" aria-label={`${foundation}, inizio pagina`}>
          <img src="/media/marchio.webp" width="38" height="48" alt="" />
          <span>Fondazione<br /><strong>Gli Unicorni di Diana</strong></span>
        </a>
        <nav className="desktop-nav" aria-label="Capitoli">
          {chapters.map(({ id, label }) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>{label}</a>)}
        </nav>
        {modeLabel && <button className="header-action" type="button" onClick={() => toggleMode()}>{modeLabel}</button>}
        <Dialog onOpenChange={(open) => { if (open) chapterAtOpen.current = active }}>
          <DialogTrigger asChild>
            <button className="mobile-menu icon-button" type="button" aria-label="Apri navigazione"><Menu size={24} /></button>
          </DialogTrigger>
          <DialogContent className="menu-dialog" onCloseAutoFocus={focusDestination}>
            <DialogTitle>Capitoli</DialogTitle>
            <DialogDescription className="sr-only">Navigazione della pagina</DialogDescription>
            <nav aria-label="Capitoli">
              {chapters.map(({ id, label }, index) => (
                <DialogClose asChild key={id}>
                  <a href={`#${id}`} onClick={() => { menuNavigating.current = true }}>
                    <span className="menu-index">0{index + 1}</span>{label}<ArrowDownRight size={20} />
                  </a>
                </DialogClose>
              ))}
              {modeLabel && (
                <DialogClose asChild>
                  <button className="menu-mode" type="button" onClick={() => { changeModeAfterClose.current = chapterAtOpen.current }}>{modeLabel}</button>
                </DialogClose>
              )}
            </nav>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title" tabIndex={-1}>
      <div className="shell hero-inner">
        <h1 id="hero-title" aria-label={foundation}>Gli Unicorni <em>di Diana.</em></h1>
        <UnicornFigure />
        <div className="hero-copy">
          <p className="hero-intro">Parliamo di donazione di sangue e midollo osseo. Cominciamo dalle scuole.</p>
          <div className="hero-actions">
            <m.a whileTap={{ scale: 0.97 }} className="button button-ink" href="#obiettivi">Scopri come donare <ArrowDownRight size={19} /></m.a>
            <ExternalLink className="text-link" href={schoolContact}>Portaci nella tua scuola <ArrowUpRight size={17} /></ExternalLink>
          </div>
        </div>
        <a className="hero-next" href="#storia"><ArrowDown size={18} /> <span>La storia di Diana</span></a>
        <p className="scene-credit">Unicorn 3D di <ExternalLink href={credits.model}>Soufiane Oujihi</ExternalLink> · adattato · <ExternalLink href={credits.license}>CC BY 4.0</ExternalLink></p>
      </div>
    </section>
  )
}

function Story() {
  return (
    <section className="chapter story" aria-labelledby="story-title" tabIndex={-1}>
      <div className="shell chapter-shell">
        <ChapterMark label="Storia" />
        <div className="story-layout">
          <div className="story-copy">
            <h2 id="story-title">Da Diana,<br /> <em>il primo passo.</em></h2>
            <p>Diana aveva sei anni. Nel suo ricordo è nato l’impegno degli Unicorni di Diana per far conoscere la donazione di sangue e midollo osseo.</p>
            <p>Oggi questo impegno passa anche dalle scuole. Incontriamo studentesse e studenti, ascoltiamo le loro domande e raccontiamo da dove cominciare.</p>
          </div>
          <div className="story-art" aria-hidden="true">
            <div className="story-orbit" />
            <img src="/media/silhouette.webp" width="840" height="960" alt="" loading="lazy" />
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
        <ChapterMark label="Obiettivi" />
        <div className="objective-heading">
          <h2 id="objectives-title">Come si comincia<br /> <em>a donare?</em></h2>
          <p>Se hai almeno 18 anni e vuoi fare il primo passo, scegli da dove iniziare. Ogni percorso ha requisiti e passaggi propri.</p>
        </div>
        <div className="pathways">
          <Fork />
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
          <ExternalLink className="text-link" href={schoolContact}>Proponi un incontro <ArrowUpRight size={18} /></ExternalLink>
        </div>
      </div>
    </section>
  )
}

type EventItem = typeof events[number]

function EventDetails({ event, children }: { event: EventItem; children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="event-dialog">
        <p className="event-category">{event.type}</p>
        <DialogTitle>{event.title}</DialogTitle>
        <DialogDescription>{event.summary}</DialogDescription>
        <div className="event-where"><MapPin size={18} /> {event.place}</div>
        {event.dateTime && <time dateTime={event.dateTime}>{event.date}</time>}
        <p>{event.detail}</p>
        <ExternalLink className="button button-ink" href={event.url}>{event.source} <ArrowUpRight size={18} /></ExternalLink>
      </DialogContent>
    </Dialog>
  )
}

function CampaignGallery() {
  return (
    <div className="campaigns">
      <h3>Dall’archivio</h3>
      <div className="campaign-grid">
        {archiveMedia.map(({ file, label, caption }) => (
          <Dialog key={file}>
            <DialogTrigger asChild>
              <m.button className="campaign-card" type="button" whileTap={{ scale: 0.97 }}>
                <span className="campaign-image"><img src={`/media/archivio/${file}-thumb.webp`} alt="" loading="lazy" /></span>
                <span>{label}<ArrowUpRight size={16} /></span>
              </m.button>
            </DialogTrigger>
            <DialogContent className="media-dialog">
              <DialogTitle>{label}</DialogTitle>
              <DialogDescription>{caption}</DialogDescription>
              <img src={`/media/archivio/${file}.webp`} alt={label} />
              <ExternalLink className="text-link" href={`/media/archivio/${file}.webp`}>Apri l’immagine a grandezza originale <ArrowUpRight size={16} /></ExternalLink>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}

function ArchiveRecords() {
  const [featured, ...otherEvents] = events
  return (
    <>
    <div className="archive-layout">
      <article className="featured-event">
        <div className="event-date">
          <span>{featured.type}</span>
          <time dateTime={featured.dateTime}>{featured.date}</time>
        </div>
        <svg className="event-art" viewBox="0 0 208 184" fill="none" aria-hidden="true">
          <circle cx="107" cy="92" r="77" strokeDasharray="1 5" />
          <path data-thread d="M2 146C41 144 61 121 78 105c17-17 34-45 58-58 18-10 46-4 48 17 5 46-77 84-108 66-21-12-9-47 11-57 19-10 35 3 40 20" />
          <path d="M107 0v16m0 152v16M15 92h16m152 0h16" />
        </svg>
        <h3>{featured.title}</h3>
        <p>{featured.summary}</p>
        <EventDetails event={featured}>
          <m.button className="text-link featured-link" type="button" whileTap={{ scale: 0.96 }}>Apri il racconto <ArrowRight size={18} /></m.button>
        </EventDetails>
      </article>
      <div className="archive-list">
        {otherEvents.map((event) => {
          const Icon = event.type === 'Scuole' ? GraduationCap : CookingPot
          return (
            <article key={event.id}>
              <EventDetails event={event}>
                <m.button className="event-row" type="button" whileTap={{ scale: 0.98 }}>
                  <span className="event-row-icon"><Icon size={24} strokeWidth={1.5} /></span>
                  <span className="event-row-body"><span className="event-category">{event.type}</span><span className="event-row-title">{event.title}</span><span className="event-row-place">{event.place}</span></span>
                  <ArrowRight size={20} />
                </m.button>
              </EventDetails>
            </article>
          )
        })}
      </div>
    </div>
    <CampaignGallery />
    </>
  )
}

function Archive({ flight }: { flight: boolean }) {
  return (
    <section className="chapter archive" aria-labelledby="archive-title" tabIndex={-1}>
      <div className="shell chapter-shell">
        <ChapterMark label="Bacheca eventi" />
        <div className="archive-heading">
          <h2 id="archive-title">Dove ci siamo<br /> <em>incontrati.</em></h2>
          <p>Dalle aule alle iniziative solidali. I volti e le storie degli Unicorni di Diana.</p>
        </div>
        {flight ? (
          <Dialog>
            <DialogTrigger asChild>
              <m.button className="button button-ink" type="button" whileTap={{ scale: 0.97 }}>Apri la bacheca <ArrowUpRight size={19} /></m.button>
            </DialogTrigger>
            <DialogContent className="archive-dialog">
              <DialogTitle>La bacheca degli Unicorni</DialogTitle>
              <DialogDescription>Incontri, campagne e iniziative a Napoli.</DialogDescription>
              <ArchiveRecords />
            </DialogContent>
          </Dialog>
        ) : <ArchiveRecords />}
      </div>
    </section>
  )
}

function Gadgets() {
  return (
    <section className="chapter gadgets" aria-labelledby="gadgets-title" tabIndex={-1}>
      <div className="shell chapter-shell">
        <ChapterMark label="Gadget" />
        <div className="gadget-layout">
          <div className="gadget-heading">
            <h2 id="gadgets-title">Da portare<br /> <em>con te.</em></h2>
            <p>Piccoli omaggi e articoli per sostenere le attività degli Unicorni di Diana.</p>
            <img className="gadget-mascot" src="/media/unicorno-poster.webp" alt="" width="1024" height="1024" loading="lazy" />
          </div>
          <div className="gadget-lists">
            <div className="gift-group">
              <h3>In omaggio</h3>
              <ul>
                {gifts.map(({ label, icon }) => {
                  const Icon = itemIcons[icon]
                  return <li key={label}><Icon size={20} strokeWidth={1.6} /> {label}</li>
                })}
              </ul>
            </div>
            <div className="solidarity-group">
              <h3>Acquisti solidali</h3>
              <p>Chiedi a Rossella disponibilità e modalità di acquisto su WhatsApp.</p>
              <ul>
                {solidarity.map(({ label, item, icon }) => {
                  const Icon = itemIcons[icon]
                  return (
                    <li key={label}>
                      <m.a
                        href={whatsapp(`Ciao Rossella, vorrei informazioni per acquistare ${item} degli Unicorni di Diana e sostenere le vostre attività.`)}
                        target="_blank" rel="noopener noreferrer"
                        aria-label={`${label}, chiedi informazioni su WhatsApp`}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon size={22} strokeWidth={1.6} /> <span>{label}</span> <ArrowUpRight size={18} />
                      </m.a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Contacts() {
  return (
    <section className="chapter contact" aria-labelledby="contact-title" tabIndex={-1}>
      <div className="shell chapter-shell">
        <div className="contact-layout">
          <div className="contact-art"><WingedHeart /></div>
          <div className="contact-copy">
            <ChapterMark label="Contatti" />
            <h2 id="contact-title">Restiamo <em>vicini.</em></h2>
            <p>Segui le prossime iniziative o scrivi a Rossella per fare una domanda e capire da dove partire.</p>
            <div className="contact-actions">
              <ExternalLink className="button button-ink" href={contacts.instagram}><Instagram size={20} /> Segui su Instagram <ArrowUpRight size={16} /></ExternalLink>
              <ExternalLink className="button button-outline" href={contacts.facebook}><Facebook size={20} /> Segui su Facebook <ArrowUpRight size={16} /></ExternalLink>
              <ExternalLink className="button button-outline" href={whatsapp('Ciao Rossella, vorrei informazioni sulle attività degli Unicorni di Diana.')}><MessageCircle size={20} /> Scrivi a Rossella <ArrowUpRight size={16} /></ExternalLink>
            </div>
            <div className="contact-secondary">
              <a className="phone-link" href={`tel:${contacts.telephone}`}><Phone size={18} /> {contacts.phone}</a>
              <a className="top-link" href="#inizio">Torna all’inizio <ArrowUp size={18} /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const motionQuery = '(prefers-reduced-motion: no-preference)'
const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '])

function indexForHash(hash: string) {
  return flightStops.findIndex(({ id }) => hash === `#${id}`)
}

export default function App() {
  const track = useRef<HTMLElement>(null)
  const pose = useRef<FlightPose>({ progress: 0 })
  const [motionAllowed, setMotionAllowed] = useState(() => matchMedia(motionQuery).matches)
  const [linear, setLinear] = useState(false)
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading')
  const [active, setActive] = useState(() => Math.max(0, indexForHash(location.hash)))
  const nextStop = useRef<number | null>(active)
  const loadingTarget = useRef<number | null>(active)
  const activeRef = useRef(active)
  const modeRef = useRef(false)
  const canFly = motionAllowed && status !== 'failed' && 'WebGL2RenderingContext' in window
  const load = canFly && !linear
  const flight = load && status === 'ready'

  const currentStop = useCallback(() => {
    if (modeRef.current) return activeRef.current
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      return flightStops.length - 1
    }
    const header = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
    return flightStops.reduce((nearest, { id }, index) => {
      const position = document.getElementById(id)?.getBoundingClientRect().top ?? Infinity
      return position <= header + 12 ? index : nearest
    }, 0)
  }, [])

  const onReady = useCallback(() => {
    nextStop.current = loadingTarget.current ?? currentStop()
    loadingTarget.current = null
    setStatus('ready')
  }, [currentStop])

  const onUnavailable = useCallback(() => {
    nextStop.current = currentStop()
    setStatus('failed')
  }, [currentStop])

  const controller = useScrollStory(track, flight, pose.current, setActive, onUnavailable)

  const goTo = useCallback((index: number, focus = false) => {
    const stop = document.getElementById(flightStops[index].id)
    if (!stop) return
    if (!modeRef.current) loadingTarget.current = index
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
    modeRef.current = flight
    const destination = nextStop.current
    if (destination !== null) {
      nextStop.current = null
      goTo(destination)
    }
  }, [flight, goTo])

  useLayoutEffect(() => { activeRef.current = active }, [active])

  useEffect(() => {
    const media = matchMedia(motionQuery)
    function update() {
      nextStop.current = currentStop()
      setMotionAllowed(media.matches)
      if (media.matches) setStatus((value) => value === 'failed' ? value : 'loading')
    }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [currentStop])

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

  useEffect(() => {
    if (flight) return
    function update() { setActive(currentStop()) }
    function allowScrollToChoose() { loadingTarget.current = null }
    function handleScrollKey(event: KeyboardEvent) {
      if (event.defaultPrevented || !scrollKeys.has(event.key)) return
      const target = event.target
      if (target instanceof HTMLElement) {
        if (target.isContentEditable || target.closest('input, textarea, select, [role="dialog"]')) return
        if (event.key === ' ' && target.closest('button, [role="button"]')) return
      }
      allowScrollToChoose()
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('wheel', allowScrollToChoose, { passive: true })
    window.addEventListener('touchmove', allowScrollToChoose, { passive: true })
    window.addEventListener('keydown', handleScrollKey)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('wheel', allowScrollToChoose)
      window.removeEventListener('touchmove', allowScrollToChoose)
      window.removeEventListener('keydown', handleScrollKey)
    }
  }, [currentStop, flight])

  function navigate(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const href = (event.target as Element).closest('a')?.getAttribute('href')
    if (!href) return
    const index = indexForHash(href)
    if (index === -1) return
    event.preventDefault()
    if (location.hash !== href) history.pushState(null, '', href)
    goTo(index, true)
  }

  function toggleMode(stop?: StopId) {
    const destination = stop ? indexForHash(`#${stop}`) : currentStop()
    nextStop.current = destination
    loadingTarget.current = destination
    setStatus('loading')
    setLinear((value) => !value)
  }

  const panels = [<Hero />, <Story />, <Objectives />, <Archive flight={flight} />, <Gadgets />, <Contacts />]

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className={flight ? 'flight-mode' : 'linear-mode'} onClick={navigate}>
          <a className="skip-link" href="#inizio">Vai al contenuto</a>
          <SiteHeader active={flightStops[active].id} modeLabel={canFly ? (linear ? 'Viaggio 3D' : flight ? 'Versione lineare' : null) : null} toggleMode={toggleMode} />
          {load && <FlightStage pose={pose.current} onReady={onReady} onUnavailable={onUnavailable} />}
          <main ref={track} className="flight-track" style={{ '--flight-length': flightLength } as CSSProperties}>
            {flightStops.map(({ id, arrival }, index) => (
              <div className="flight-stop" id={id} key={id} style={{ '--flight-arrival': arrival } as CSSProperties}>
                <div className={`flight-panel${active === index ? ' is-active' : ''}`} inert={flight && active !== index}>
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
