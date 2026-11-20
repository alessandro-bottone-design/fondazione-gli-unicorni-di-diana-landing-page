import { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import {
  ArrowLeft, Calendar, Check, Eye, EyeOff, FolderHeart,
  Gift, Globe, ImagePlus, LogOut, Plus, Save, Trash2,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import {
  baseSphereEvents,
  featuredProjects as defaultProjects,
  foundation,
  solidarity as defaultGadgets,
  upcomingEvents as defaultUpcomingEvents,
  whatsapp,
} from '@/content'
import { rainbowBorder, rainbowGradient, rainbowPastelWash, rainbowSurface } from '@/rainbow'
import type { Session } from '@supabase/supabase-js'

type AdminTab = 'upcoming' | 'projects' | 'gadgets' | 'archive'

interface UpcomingRow {
  id: string
  title: string
  category: string
  place: string
  date_label: string
  date_iso: string
  summary: string
  detail: string
  image_src: string
  cta_label: string
  cta_url: string
  sort_order: number
  is_visible: boolean
}

interface ProjectRow {
  id: string
  title: string
  badge: string
  place: string
  summary: string
  detail: string
  image_src: string
  cta_label: string
  cta_url: string
  sort_order: number
  is_visible: boolean
}

interface GadgetRow {
  id: string
  label: string
  item: string
  kind: 'solidale' | 'gratuito'
  icon: string
  category: string
  price: string
  badge: string
  glb: string
  src: string
  alt: string
  description: string
  availability_note: string
  sort_order: number
  is_visible: boolean
}

interface ArchiveRow {
  id: string
  title: string
  category: string
  place: string
  date_label: string
  summary: string
  description: string
  source_label: string
  url: string
  src: string
  full_src: string
  alt: string
  is_placeholder: boolean
  sort_order: number
  is_visible: boolean
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `voce-${Date.now()}`
  )
}

async function compressImageToWebp(file: File, maxDim = 1400, quality = 0.84): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height, 1))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(img.width * scale))
      canvas.height = Math.max(1, Math.round(img.height * scale))
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(file)
        return
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else resolve(file)
        },
        'image/webp',
        quality,
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Impossibile elaborare l’immagine selezionata'))
    }
    img.src = objectUrl
  })
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<AdminTab>('upcoming')
  const [upcomingList, setUpcomingList] = useState<UpcomingRow[]>([])
  const [projectsList, setProjectsList] = useState<ProjectRow[]>([])
  const [gadgetsList, setGadgetsList] = useState<GadgetRow[]>([])
  const [archiveList, setArchiveList] = useState<ArchiveRow[]>([])

  const [loadingData, setLoadingData] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  useEffect(() => {
    const rootStyle = document.documentElement.style
    rootStyle.setProperty('--rainbow-gradient', rainbowGradient)
    rootStyle.setProperty('--rainbow-border', rainbowBorder)
    rootStyle.setProperty('--rainbow-pastel', rainbowPastelWash)
    rootStyle.setProperty('--rainbow-surface', rainbowSurface)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const notify = (msg: string) => {
    setErrorMessage(null)
    setStatusMessage(msg)
    window.setTimeout(() => {
      setStatusMessage((prev) => (prev === msg ? null : prev))
    }, 3600)
  }

  const loadAll = useCallback(async () => {
    setLoadingData(true)
    setErrorMessage(null)
    try {
      const [upRes, projRes, gadRes, archRes] = await Promise.all([
        supabase.from('upcoming_events').select('*').order('sort_order', { ascending: true }),
        supabase.from('projects').select('*').order('sort_order', { ascending: true }),
        supabase.from('gadgets').select('*').order('sort_order', { ascending: true }),
        supabase.from('archive_events').select('*').order('sort_order', { ascending: true }),
      ])

      if (upRes.data && upRes.data.length > 0) {
        setUpcomingList(
          upRes.data.map((r, i) => ({
            id: String(r.id),
            title: String(r.title ?? ''),
            category: String(r.category ?? 'Incontro'),
            place: String(r.place ?? ''),
            date_label: String(r.date_label ?? ''),
            date_iso: String(r.date_iso ?? ''),
            summary: String(r.summary ?? ''),
            detail: String(r.detail ?? ''),
            image_src: String(r.image_src ?? '/media/archivio/donare-insieme.webp'),
            cta_label: String(r.cta_label ?? 'Chiedi informazioni a Rossella'),
            cta_url: String(r.cta_url ?? ''),
            sort_order: Number(r.sort_order ?? i + 1),
            is_visible: Boolean(r.is_visible ?? true),
          })),
        )
      } else {
        setUpcomingList(
          defaultUpcomingEvents.map((e, i) => ({
            id: e.id,
            title: e.title,
            category: e.category,
            place: e.place,
            date_label: e.dateLabel,
            date_iso: e.dateIso ?? '',
            summary: e.summary,
            detail: e.detail,
            image_src: e.imageSrc,
            cta_label: e.ctaLabel,
            cta_url: e.ctaUrl,
            sort_order: i + 1,
            is_visible: true,
          })),
        )
      }

      if (projRes.data && projRes.data.length > 0) {
        setProjectsList(
          projRes.data.map((r, i) => ({
            id: String(r.id),
            title: String(r.title ?? ''),
            badge: String(r.badge ?? 'Progetto in evidenza'),
            place: String(r.place ?? ''),
            summary: String(r.summary ?? ''),
            detail: String(r.detail ?? ''),
            image_src: String(r.image_src ?? '/media/archivio/donare-insieme.webp'),
            cta_label: String(r.cta_label ?? 'Scopri di più'),
            cta_url: String(r.cta_url ?? ''),
            sort_order: Number(r.sort_order ?? i + 1),
            is_visible: Boolean(r.is_visible ?? true),
          })),
        )
      } else {
        setProjectsList(
          defaultProjects.map((p, i) => ({
            id: p.id,
            title: p.title,
            badge: p.badge,
            place: p.place,
            summary: p.summary,
            detail: p.detail,
            image_src: p.imageSrc,
            cta_label: p.ctaLabel,
            cta_url: p.ctaUrl,
            sort_order: i + 1,
            is_visible: true,
          })),
        )
      }

      if (gadRes.data && gadRes.data.length > 0) {
        setGadgetsList(
          gadRes.data.map((r, i) => ({
            id: String(r.id),
            label: String(r.label ?? ''),
            item: String(r.item ?? ''),
            kind: r.kind === 'gratuito' ? 'gratuito' : 'solidale',
            icon: String(r.icon ?? 'shirt'),
            category: String(r.category ?? 'Gadget solidale'),
            price: String(r.price ?? ''),
            badge: String(r.badge ?? ''),
            glb: String(r.glb ?? '/media/gadget/spilla.glb'),
            src: String(r.src ?? '/media/gadget/spilla.webp'),
            alt: String(r.alt ?? r.label ?? ''),
            description: String(r.description ?? ''),
            availability_note: String(r.availability_note ?? ''),
            sort_order: Number(r.sort_order ?? i + 1),
            is_visible: Boolean(r.is_visible ?? true),
          })),
        )
      } else {
        setGadgetsList(
          defaultGadgets.map((g, i) => ({
            id: g.id,
            label: g.label,
            item: g.item,
            kind: g.kind,
            icon: g.icon,
            category: g.category,
            price: g.price,
            badge: g.badge ?? '',
            glb: g.glb,
            src: g.src,
            alt: g.alt,
            description: g.description,
            availability_note: g.availabilityNote,
            sort_order: i + 1,
            is_visible: true,
          })),
        )
      }

      if (archRes.data && archRes.data.length > 0) {
        setArchiveList(
          archRes.data.map((r, i) => ({
            id: String(r.id),
            title: String(r.title ?? ''),
            category: String(r.category ?? 'Solidarietà'),
            place: String(r.place ?? ''),
            date_label: String(r.date_label ?? ''),
            summary: String(r.summary ?? ''),
            description: String(r.description ?? ''),
            source_label: String(r.source_label ?? ''),
            url: String(r.url ?? ''),
            src: String(r.src ?? '/media/silhouette.webp'),
            full_src: String(r.full_src ?? r.src ?? '/media/silhouette.webp'),
            alt: String(r.alt ?? r.title ?? ''),
            is_placeholder: Boolean(r.is_placeholder ?? false),
            sort_order: Number(r.sort_order ?? i + 1),
            is_visible: Boolean(r.is_visible ?? true),
          })),
        )
      } else {
        setArchiveList(
          baseSphereEvents.map((a, i) => ({
            id: a.id,
            title: a.title,
            category: a.category ?? 'Solidarietà',
            place: a.place ?? '',
            date_label: a.date ?? '',
            summary: a.summary ?? '',
            description: a.description ?? '',
            source_label: a.sourceLabel ?? '',
            url: a.url ?? '',
            src: a.src,
            full_src: a.fullSrc,
            alt: a.alt,
            is_placeholder: Boolean(a.isPlaceholder),
            sort_order: i + 1,
            is_visible: true,
          })),
        )
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Errore nel caricamento dei dati')
    } finally {
      setLoadingData(false)
    }
  }, [])

  useEffect(() => {
    if (session) {
      void loadAll()
    }
  }, [session, loadAll])

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setAuthError(null)
    setAuthLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setAuthLoading(false)
    if (error) {
      setAuthError('Credenziali non valide. Controlla email e password.')
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  async function uploadPhoto(file: File, folder: string, itemId: string): Promise<string | null> {
    setUploadingId(itemId)
    setErrorMessage(null)
    try {
      const compressed = await compressImageToWebp(file)
      const path = `${folder}/${slugify(itemId)}-${Date.now()}.webp`
      const { error } = await supabase.storage
        .from('media')
        .upload(path, compressed, { contentType: 'image/webp', upsert: true })
      if (error) throw error
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      notify('Foto caricata e ottimizzata! Ricorda di cliccare "Salva" sulla scheda.')
      return data.publicUrl
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Errore durante il caricamento della foto')
      return null
    } finally {
      setUploadingId(null)
    }
  }

  // --- CRUD Handlers for Upcoming Events ---
  function addUpcoming() {
    const id = `evento-${Date.now()}`
    setUpcomingList((prev) => [
      {
        id,
        title: 'Nuovo Evento Gli Unicorni di Diana',
        category: 'Incontro',
        place: 'Napoli',
        date_label: 'Data da definire',
        date_iso: '',
        summary: 'Breve presentazione dell’incontro o della giornata solidale.',
        detail: '',
        image_src: '/media/archivio/donare-insieme.webp',
        cta_label: 'Chiedi informazioni a Rossella',
        cta_url: whatsapp('Ciao Rossella, vorrei informazioni sul prossimo evento degli Unicorni di Diana.'),
        sort_order: prev.length + 1,
        is_visible: true,
      },
      ...prev,
    ])
  }

  async function saveUpcoming(row: UpcomingRow) {
    const payload = {
      ...row,
      cta_url:
        row.cta_url.trim() ||
        whatsapp(`Ciao Rossella, vorrei informazioni sull'evento «${row.title}».`),
      updated_at: new Date().toISOString(),
    }
    const { error } = await supabase.from('upcoming_events').upsert(payload)
    if (error) setErrorMessage(error.message)
    else notify(`Evento «${row.title}» salvato e pubblicato!`)
  }

  async function deleteUpcoming(id: string, title: string) {
    if (!window.confirm(`Vuoi davvero eliminare l'evento «${title}»?`)) return
    await supabase.from('upcoming_events').delete().eq('id', id)
    setUpcomingList((prev) => prev.filter((item) => item.id !== id))
    notify(`Evento «${title}» eliminato.`)
  }

  // --- CRUD Handlers for Projects ---
  function addProject() {
    const id = `progetto-${Date.now()}`
    setProjectsList((prev) => [
      ...prev,
      {
        id,
        title: 'Nuovo Progetto Solidale',
        badge: 'Progetto in evidenza',
        place: 'Napoli',
        summary: 'Breve descrizione del progetto in evidenza.',
        detail: '',
        image_src: '/media/archivio/donare-insieme.webp',
        cta_label: 'Chiedi informazioni a Rossella',
        cta_url: whatsapp('Ciao Rossella, vorrei informazioni sui progetti degli Unicorni di Diana.'),
        sort_order: prev.length + 1,
        is_visible: true,
      },
    ])
  }

  async function saveProject(row: ProjectRow) {
    const { error } = await supabase.from('projects').upsert({
      ...row,
      updated_at: new Date().toISOString(),
    })
    if (error) setErrorMessage(error.message)
    else notify(`Progetto «${row.title}» salvato e aggiornato sul sito!`)
  }

  async function deleteProject(id: string, title: string) {
    if (!window.confirm(`Vuoi davvero eliminare il progetto «${title}»?`)) return
    await supabase.from('projects').delete().eq('id', id)
    setProjectsList((prev) => prev.filter((item) => item.id !== id))
    notify(`Progetto «${title}» eliminato.`)
  }

  // --- CRUD Handlers for Gadgets ---
  function addGadget(kind: 'solidale' | 'gratuito') {
    const id = `gadget-${Date.now()}`
    setGadgetsList((prev) => [
      ...prev,
      {
        id,
        label: kind === 'gratuito' ? 'Nuovo Gadget Gratuito' : 'Nuovo Gadget Solidale',
        item: 'il nuovo gadget',
        kind,
        icon: kind === 'gratuito' ? 'pin' : 'shirt',
        category: kind === 'gratuito' ? 'Gadget gratuito' : 'Gadget solidale',
        price: kind === 'gratuito' ? 'Gratuito' : '10 €',
        badge: kind === 'gratuito' ? 'Omaggio gratuito' : 'Novità',
        glb: kind === 'gratuito' ? '/media/gadget/spilla.glb' : '/media/gadget/t-shirt.glb',
        src: kind === 'gratuito' ? '/media/gadget/spilla.webp' : '/media/gadget/t-shirt.webp',
        alt: 'Gadget Gli Unicorni di Diana',
        description: 'Descrizione del gadget.',
        availability_note: 'Contatta direttamente Rossella per richiederlo.',
        sort_order: prev.length + 1,
        is_visible: true,
      },
    ])
  }

  async function saveGadget(row: GadgetRow) {
    const { error } = await supabase.from('gadgets').upsert({
      ...row,
      badge: row.badge.trim() || null,
      updated_at: new Date().toISOString(),
    })
    if (error) setErrorMessage(error.message)
    else notify(`Gadget «${row.label}» salvato e pubblicato!`)
  }

  async function deleteGadget(id: string, label: string) {
    if (!window.confirm(`Vuoi davvero eliminare il gadget «${label}»?`)) return
    await supabase.from('gadgets').delete().eq('id', id)
    setGadgetsList((prev) => prev.filter((item) => item.id !== id))
    notify(`Gadget «${label}» eliminato.`)
  }

  // --- CRUD Handlers for Archive Sphere Events ---
  function addArchiveEvent() {
    const id = `archivio-${Date.now()}`
    setArchiveList((prev) => [
      {
        id,
        title: 'Nuovo Incontro in Archivio',
        category: 'Scuole',
        place: 'Napoli',
        date_label: '',
        summary: 'Racconto breve dell’incontro o della locandina.',
        description: '',
        source_label: 'Apri immagine o post',
        url: '',
        src: '/media/archivio/donare-insieme-thumb.webp',
        full_src: '/media/archivio/donare-insieme.webp',
        alt: 'Foto incontro Gli Unicorni di Diana',
        is_placeholder: false,
        sort_order: prev.length + 1,
        is_visible: true,
      },
      ...prev,
    ])
  }

  async function saveArchiveEvent(row: ArchiveRow) {
    const { error } = await supabase.from('archive_events').upsert({
      ...row,
      place: row.place.trim() || null,
      date_label: row.date_label.trim() || null,
      description: row.description.trim() || null,
      source_label: row.source_label.trim() || null,
      url: row.url.trim() || null,
      updated_at: new Date().toISOString(),
    })
    if (error) setErrorMessage(error.message)
    else notify(`Voce d'archivio «${row.title}» salvata nella sfera 3D!`)
  }

  async function deleteArchiveEvent(id: string, title: string) {
    if (!window.confirm(`Vuoi davvero eliminare «${title}» dalla sfera degli eventi?`)) return
    await supabase.from('archive_events').delete().eq('id', id)
    setArchiveList((prev) => prev.filter((item) => item.id !== id))
    notify(`Voce «${title}» rimossa dalla sfera.`)
  }

  if (authLoading) {
    return (
      <div className="admin-page">
        <div className="page-atmosphere" aria-hidden="true" />
        <main className="shell admin-login-wrap">
          <div className="admin-card">
            <p>Caricamento area gestione...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="admin-page">
        <div className="page-atmosphere" aria-hidden="true" />
        <main className="shell admin-login-wrap">
          <form className="admin-card admin-login-card" onSubmit={handleLogin}>
            <a href="/" className="text-link admin-back-link">
              <ArrowLeft size={16} />
              <span>Torna al sito pubblico</span>
            </a>
            <div className="admin-login-brand">
              <img src="/media/marchio.webp" width={64} height={80} alt={foundation} />
              <h1>
                Ciao <em>Rossella.</em>
              </h1>
              <p>Accedi per aggiungere nuovi eventi, aggiornare i progetti, caricare foto e gestire i gadget.</p>
            </div>

            {authError && (
              <p className="admin-alert admin-alert--error" role="alert">
                {authError}
              </p>
            )}

            <label className="admin-field">
              <span>La tua Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="rossella@unicornididiana.it"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="admin-field">
              <span>Password</span>
              <div className="admin-password-row">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Inserisci la password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="button button-outline admin-pw-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  <span>{showPassword ? 'Nascondi' : 'Mostra'}</span>
                </button>
              </div>
            </label>

            <button type="submit" className="button button-ink admin-login-submit">
              <span>Entra nel pannello di gestione</span>
            </button>
          </form>
        </main>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="page-atmosphere" aria-hidden="true" />
      <header className="admin-topbar">
        <div className="shell admin-topbar-inner">
          <div className="admin-topbar-brand">
            <img src="/media/marchio.webp" width={38} height={48} alt="" />
            <div>
              <strong>Pannello di Rossella</strong>
              <span>{foundation}</span>
            </div>
          </div>
          <div className="admin-topbar-actions">
            <a href="/" className="button button-outline">
              <ArrowLeft size={16} />
              <span>Vedi il sito aggiornato</span>
            </a>
            <button type="button" className="button button-outline" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Esci</span>
            </button>
          </div>
        </div>
      </header>

      <main className="shell admin-main">
        {statusMessage && (
          <div className="admin-toast admin-toast--ok" role="status">
            <Check size={18} />
            <span>{statusMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="admin-toast admin-toast--err" role="alert">
            <span>{errorMessage}</span>
          </div>
        )}

        <nav className="admin-tabs" aria-label="Aree del sito da modificare">
          <button
            type="button"
            className={`admin-tab${activeTab === 'upcoming' ? ' is-active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <Calendar size={18} />
            <span>1. Nuovi Eventi ({upcomingList.length})</span>
          </button>
          <button
            type="button"
            className={`admin-tab${activeTab === 'projects' ? ' is-active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <FolderHeart size={18} />
            <span>2. Progetti in Evidenza ({projectsList.length})</span>
          </button>
          <button
            type="button"
            className={`admin-tab${activeTab === 'gadgets' ? ' is-active' : ''}`}
            onClick={() => setActiveTab('gadgets')}
          >
            <Gift size={18} />
            <span>3. Gadget Solidali e Gratuiti ({gadgetsList.length})</span>
          </button>
          <button
            type="button"
            className={`admin-tab${activeTab === 'archive' ? ' is-active' : ''}`}
            onClick={() => setActiveTab('archive')}
          >
            <Globe size={18} />
            <span>4. Archivio Sfera Eventi ({archiveList.length})</span>
          </button>
        </nav>

        {loadingData ? (
          <div className="admin-card">
            <p>Caricamento contenuti in corso...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: NUOVI EVENTI */}
            {activeTab === 'upcoming' && (
              <section className="admin-section">
                <div className="admin-section-header">
                  <div>
                    <h2>Nuovi Eventi in programma</h2>
                    <p>Questi eventi compaiono nella sezione «Nuovi Eventi» subito prima della sfera degli eventi passati.</p>
                  </div>
                  <button type="button" className="button button-ink" onClick={addUpcoming}>
                    <Plus size={18} />
                    <span>Aggiungi Nuovo Evento</span>
                  </button>
                </div>

                <div className="admin-items-list">
                  {upcomingList.map((row, idx) => (
                    <article key={row.id} className="admin-card admin-item-card">
                      <div className="admin-item-preview">
                        <img src={row.image_src} alt={row.title} />
                        <label className="button button-outline admin-upload-btn">
                          <ImagePlus size={16} />
                          <span>{uploadingId === row.id ? 'Caricamento...' : 'Cambia locandina / foto'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              const url = await uploadPhoto(file, 'upcoming', row.id)
                              if (url) {
                                setUpcomingList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, image_src: url } : item)),
                                )
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div className="admin-item-fields">
                        <div className="admin-row-2">
                          <label className="admin-field">
                            <span>Titolo dell’evento</span>
                            <input
                              type="text"
                              value={row.title}
                              onChange={(e) =>
                                setUpcomingList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, title: e.target.value } : item)),
                                )
                              }
                            />
                          </label>
                          <label className="admin-field">
                            <span>Categoria (es. Scuole, Raccolta solidale)</span>
                            <input
                              type="text"
                              value={row.category}
                              onChange={(e) =>
                                setUpcomingList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, category: e.target.value } : item)),
                                )
                              }
                            />
                          </label>
                        </div>

                        <div className="admin-row-2">
                          <label className="admin-field">
                            <span>Data o periodo mostrato (es. 15 Maggio 2027)</span>
                            <input
                              type="text"
                              value={row.date_label}
                              onChange={(e) =>
                                setUpcomingList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, date_label: e.target.value } : item)),
                                )
                              }
                            />
                          </label>
                          <label className="admin-field">
                            <span>Luogo (es. Napoli · Liceo o Ospedale)</span>
                            <input
                              type="text"
                              value={row.place}
                              onChange={(e) =>
                                setUpcomingList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, place: e.target.value } : item)),
                                )
                              }
                            />
                          </label>
                        </div>

                        <label className="admin-field">
                          <span>Breve descrizione principale</span>
                          <textarea
                            rows={2}
                            value={row.summary}
                            onChange={(e) =>
                              setUpcomingList((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, summary: e.target.value } : item)),
                              )
                            }
                          />
                        </label>

                        <label className="admin-field">
                          <span>Dettagli aggiuntivi (opzionale)</span>
                          <textarea
                            rows={2}
                            value={row.detail}
                            onChange={(e) =>
                              setUpcomingList((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, detail: e.target.value } : item)),
                              )
                            }
                          />
                        </label>

                        <div className="admin-row-2">
                          <label className="admin-field">
                            <span>Testo del pulsante</span>
                            <input
                              type="text"
                              value={row.cta_label}
                              onChange={(e) =>
                                setUpcomingList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, cta_label: e.target.value } : item)),
                                )
                              }
                            />
                          </label>
                          <label className="admin-field">
                            <span>Link esterno (lascia vuoto per aprire WhatsApp con te)</span>
                            <input
                              type="text"
                              placeholder="Automatico su WhatsApp a Rossella"
                              value={row.cta_url}
                              onChange={(e) =>
                                setUpcomingList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, cta_url: e.target.value } : item)),
                                )
                              }
                            />
                          </label>
                        </div>

                        <div className="admin-item-actions">
                          <label className="admin-toggle">
                            <input
                              type="checkbox"
                              checked={row.is_visible}
                              onChange={(e) =>
                                setUpcomingList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, is_visible: e.target.checked } : item)),
                                )
                              }
                            />
                            <span>{row.is_visible ? 'Visibile sul sito' : 'Nascosto'}</span>
                          </label>

                          <div className="admin-item-buttons">
                            <button
                              type="button"
                              className="button button-outline admin-btn-danger"
                              onClick={() => deleteUpcoming(row.id, row.title)}
                            >
                              <Trash2 size={16} />
                              <span>Elimina</span>
                            </button>
                            <button
                              type="button"
                              className="button button-ink"
                              onClick={() => saveUpcoming(row)}
                            >
                              <Save size={16} />
                              <span>Salva evento</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* TAB 2: PROGETTI IN EVIDENZA */}
            {activeTab === 'projects' && (
              <section className="admin-section">
                <div className="admin-section-header">
                  <div>
                    <h2>Progetti in Evidenza (Scuole, Disneyland Paris, Cucina delle mamme)</h2>
                    <p>Modifica testi e foto delle card animate nella sezione «Progetti».</p>
                  </div>
                  <button type="button" className="button button-ink" onClick={addProject}>
                    <Plus size={18} />
                    <span>Aggiungi Progetto</span>
                  </button>
                </div>

                <div className="admin-items-list">
                  {projectsList.map((row, idx) => (
                    <article key={row.id} className="admin-card admin-item-card">
                      <div className="admin-item-preview">
                        <img src={row.image_src} alt={row.title} />
                        <label className="button button-outline admin-upload-btn">
                          <ImagePlus size={16} />
                          <span>{uploadingId === row.id ? 'Caricamento...' : 'Carica nuova foto progetto'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              const url = await uploadPhoto(file, 'projects', row.id)
                              if (url) {
                                setProjectsList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, image_src: url } : item)),
                                )
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div className="admin-item-fields">
                        <div className="admin-row-2">
                          <label className="admin-field">
                            <span>Titolo del progetto</span>
                            <input
                              type="text"
                              value={row.title}
                              onChange={(e) =>
                                setProjectsList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, title: e.target.value } : item)),
                                )
                              }
                            />
                          </label>
                          <label className="admin-field">
                            <span>Etichetta in alto (es. Dona un ricordo felice)</span>
                            <input
                              type="text"
                              value={row.badge}
                              onChange={(e) =>
                                setProjectsList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, badge: e.target.value } : item)),
                                )
                              }
                            />
                          </label>
                        </div>

                        <label className="admin-field">
                          <span>Luogo / Destinatari</span>
                          <input
                            type="text"
                            value={row.place}
                            onChange={(e) =>
                              setProjectsList((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, place: e.target.value } : item)),
                              )
                            }
                          />
                        </label>

                        <label className="admin-field">
                          <span>Riassunto sulla card</span>
                          <textarea
                            rows={2}
                            value={row.summary}
                            onChange={(e) =>
                              setProjectsList((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, summary: e.target.value } : item)),
                              )
                            }
                          />
                        </label>

                        <label className="admin-field">
                          <span>Racconto completo quando si apre la scheda</span>
                          <textarea
                            rows={3}
                            value={row.detail}
                            onChange={(e) =>
                              setProjectsList((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, detail: e.target.value } : item)),
                              )
                            }
                          />
                        </label>

                        <div className="admin-row-2">
                          <label className="admin-field">
                            <span>Testo del pulsante</span>
                            <input
                              type="text"
                              value={row.cta_label}
                              onChange={(e) =>
                                setProjectsList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, cta_label: e.target.value } : item)),
                                )
                              }
                            />
                          </label>
                          <label className="admin-field">
                            <span>Link o collegamento WhatsApp</span>
                            <input
                              type="text"
                              value={row.cta_url}
                              onChange={(e) =>
                                setProjectsList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, cta_url: e.target.value } : item)),
                                )
                              }
                            />
                          </label>
                        </div>

                        <div className="admin-item-actions">
                          <label className="admin-toggle">
                            <input
                              type="checkbox"
                              checked={row.is_visible}
                              onChange={(e) =>
                                setProjectsList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, is_visible: e.target.checked } : item)),
                                )
                              }
                            />
                            <span>{row.is_visible ? 'Visibile sul sito' : 'Nascosto'}</span>
                          </label>

                          <div className="admin-item-buttons">
                            <button
                              type="button"
                              className="button button-outline admin-btn-danger"
                              onClick={() => deleteProject(row.id, row.title)}
                            >
                              <Trash2 size={16} />
                              <span>Elimina</span>
                            </button>
                            <button
                              type="button"
                              className="button button-ink"
                              onClick={() => saveProject(row)}
                            >
                              <Save size={16} />
                              <span>Salva progetto</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* TAB 3: GADGET SOLIDALI E GRATUITI */}
            {activeTab === 'gadgets' && (
              <section className="admin-section">
                <div className="admin-section-header">
                  <div>
                    <h2>Gadget Solidali e Gadget Gratuiti (Spilla, Penna, Bracciale)</h2>
                    <p>Tutti i gadget rimandano esclusivamente al contatto diretto con Rossella.</p>
                  </div>
                  <div className="admin-header-btns">
                    <button type="button" className="button button-outline" onClick={() => addGadget('gratuito')}>
                      <Plus size={17} />
                      <span>Nuovo Gadget Gratuito</span>
                    </button>
                    <button type="button" className="button button-ink" onClick={() => addGadget('solidale')}>
                      <Plus size={17} />
                      <span>Nuovo Gadget Solidale</span>
                    </button>
                  </div>
                </div>

                <div className="admin-items-list">
                  {gadgetsList.map((row, idx) => (
                    <article key={row.id} className="admin-card admin-item-card">
                      <div className="admin-item-preview">
                        <img src={row.src} alt={row.label} />
                        <label className="button button-outline admin-upload-btn">
                          <ImagePlus size={16} />
                          <span>{uploadingId === row.id ? 'Caricamento...' : 'Cambia immagine'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              const url = await uploadPhoto(file, 'gadgets', row.id)
                              if (url) {
                                setGadgetsList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, src: url } : item)),
                                )
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div className="admin-item-fields">
                        <div className="admin-row-3">
                          <label className="admin-field">
                            <span>Nome del gadget</span>
                            <input
                              type="text"
                              value={row.label}
                              onChange={(e) =>
                                setGadgetsList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, label: e.target.value } : item)),
                                )
                              }
                            />
                          </label>
                          <label className="admin-field">
                            <span>Tipo</span>
                            <select
                              value={row.kind}
                              onChange={(e) => {
                                const nextKind = e.target.value === 'gratuito' ? 'gratuito' : 'solidale'
                                setGadgetsList((prev) =>
                                  prev.map((item, i) =>
                                    i === idx
                                      ? {
                                          ...item,
                                          kind: nextKind,
                                          price: nextKind === 'gratuito' ? 'Gratuito' : item.price,
                                          category: nextKind === 'gratuito' ? 'Gadget gratuito' : 'Gadget solidale',
                                        }
                                      : item,
                                  ),
                                )
                              }}
                            >
                              <option value="solidale">Gadget Solidale</option>
                              <option value="gratuito">Gadget Gratuito (Omaggio)</option>
                            </select>
                          </label>
                          <label className="admin-field">
                            <span>Contributo o Gratuito (es. 10 € / Gratuito)</span>
                            <input
                              type="text"
                              value={row.price}
                              onChange={(e) =>
                                setGadgetsList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, price: e.target.value } : item)),
                                )
                              }
                            />
                          </label>
                        </div>

                        <div className="admin-row-2">
                          <label className="admin-field">
                            <span>Badge speciale (es. Novità, Omaggio gratuito)</span>
                            <input
                              type="text"
                              value={row.badge}
                              onChange={(e) =>
                                setGadgetsList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, badge: e.target.value } : item)),
                                )
                              }
                            />
                          </label>
                          <label className="admin-field">
                            <span>Nome nel messaggio WhatsApp (es. la spilla ufficiale)</span>
                            <input
                              type="text"
                              value={row.item}
                              onChange={(e) =>
                                setGadgetsList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, item: e.target.value } : item)),
                                )
                              }
                            />
                          </label>
                        </div>

                        <label className="admin-field">
                          <span>Descrizione del gadget</span>
                          <textarea
                            rows={2}
                            value={row.description}
                            onChange={(e) =>
                              setGadgetsList((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, description: e.target.value } : item)),
                              )
                            }
                          />
                        </label>

                        <label className="admin-field">
                          <span>Nota per contattare Rossella</span>
                          <input
                            type="text"
                            value={row.availability_note}
                            onChange={(e) =>
                              setGadgetsList((prev) =>
                                prev.map((item, i) =>
                                  i === idx ? { ...item, availability_note: e.target.value } : item,
                                ),
                              )
                            }
                          />
                        </label>

                        <div className="admin-item-actions">
                          <label className="admin-toggle">
                            <input
                              type="checkbox"
                              checked={row.is_visible}
                              onChange={(e) =>
                                setGadgetsList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, is_visible: e.target.checked } : item)),
                                )
                              }
                            />
                            <span>{row.is_visible ? 'Visibile sul sito' : 'Nascosto'}</span>
                          </label>

                          <div className="admin-item-buttons">
                            <button
                              type="button"
                              className="button button-outline admin-btn-danger"
                              onClick={() => deleteGadget(row.id, row.label)}
                            >
                              <Trash2 size={16} />
                              <span>Elimina</span>
                            </button>
                            <button
                              type="button"
                              className="button button-ink"
                              onClick={() => saveGadget(row)}
                            >
                              <Save size={16} />
                              <span>Salva gadget</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* TAB 4: ARCHIVIO SFERA EVENTI */}
            {activeTab === 'archive' && (
              <section className="admin-section">
                <div className="admin-section-header">
                  <div>
                    <h2>Archivio Eventi Passati (Sfera 3D «Dove ci siamo incontrati»)</h2>
                    <p>Aggiungi o aggiorna le foto e i racconti degli incontri già svolti nella sfera interattiva.</p>
                  </div>
                  <button type="button" className="button button-ink" onClick={addArchiveEvent}>
                    <Plus size={18} />
                    <span>Aggiungi Evento nella Sfera</span>
                  </button>
                </div>

                <div className="admin-items-list">
                  {archiveList.map((row, idx) => (
                    <article key={row.id} className="admin-card admin-item-card">
                      <div className="admin-item-preview">
                        <img src={row.full_src || row.src} alt={row.title} />
                        <label className="button button-outline admin-upload-btn">
                          <ImagePlus size={16} />
                          <span>{uploadingId === row.id ? 'Caricamento...' : 'Carica foto evento'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              const url = await uploadPhoto(file, 'archive', row.id)
                              if (url) {
                                setArchiveList((prev) =>
                                  prev.map((item, i) =>
                                    i === idx ? { ...item, src: url, full_src: url, is_placeholder: false } : item,
                                  ),
                                )
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div className="admin-item-fields">
                        <div className="admin-row-3">
                          <label className="admin-field">
                            <span>Titolo</span>
                            <input
                              type="text"
                              value={row.title}
                              onChange={(e) =>
                                setArchiveList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, title: e.target.value } : item)),
                                )
                              }
                            />
                          </label>
                          <label className="admin-field">
                            <span>Categoria</span>
                            <input
                              type="text"
                              value={row.category}
                              onChange={(e) =>
                                setArchiveList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, category: e.target.value } : item)),
                                )
                              }
                            />
                          </label>
                          <label className="admin-field">
                            <span>Luogo / Data</span>
                            <input
                              type="text"
                              value={row.place}
                              onChange={(e) =>
                                setArchiveList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, place: e.target.value } : item)),
                                )
                              }
                            />
                          </label>
                        </div>

                        <label className="admin-field">
                          <span>Didascalia / Riassunto</span>
                          <textarea
                            rows={2}
                            value={row.summary}
                            onChange={(e) =>
                              setArchiveList((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, summary: e.target.value } : item)),
                              )
                            }
                          />
                        </label>

                        <label className="admin-field">
                          <span>Link approfondimento o post social (opzionale)</span>
                          <input
                            type="text"
                            value={row.url}
                            onChange={(e) =>
                              setArchiveList((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, url: e.target.value } : item)),
                              )
                            }
                          />
                        </label>

                        <div className="admin-item-actions">
                          <label className="admin-toggle">
                            <input
                              type="checkbox"
                              checked={row.is_visible}
                              onChange={(e) =>
                                setArchiveList((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, is_visible: e.target.checked } : item)),
                                )
                              }
                            />
                            <span>{row.is_visible ? 'Visibile nella sfera' : 'Nascosto'}</span>
                          </label>

                          <div className="admin-item-buttons">
                            <button
                              type="button"
                              className="button button-outline admin-btn-danger"
                              onClick={() => deleteArchiveEvent(row.id, row.title)}
                            >
                              <Trash2 size={16} />
                              <span>Elimina</span>
                            </button>
                            <button
                              type="button"
                              className="button button-ink"
                              onClick={() => saveArchiveEvent(row)}
                            >
                              <Save size={16} />
                              <span>Salva nella sfera</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}
