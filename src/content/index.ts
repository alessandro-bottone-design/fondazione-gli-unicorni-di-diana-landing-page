export const foundation = 'Fondazione Gli Unicorni di Diana'

export const dianaPortrait = { src: '/media/ritratto-diana.webp', width: 916, height: 1020 } as const

export const brandLogo = { src: '/media/marchio.webp', width: 653, height: 822 } as const

export const illustrations = {
  unicornHead: '/media/unicorn-line.webp',
  flyingUnicorn: '/media/unicorn-full-line.webp',
  wingedHeart: '/media/winged-heart-line.webp',
} as const

// Used for the events that do not have their own photograph yet.
export const placeholderMedia = {
  src: '/media/silhouette.webp',
  alt: 'Silhouette di un unicorno, immagine segnaposto',
} as const

export const contacts = {
  phone: '+39 338 297 4641',
  telephone: '+393382974641',
  instagram: 'https://www.instagram.com/gliunicornididiana/',
  facebook: 'https://www.facebook.com/GliUnicorniDiDIANA/',
}

export function whatsapp(message: string) {
  return `https://wa.me/${contacts.telephone.slice(1)}?text=${encodeURIComponent(message)}`
}

export const schoolContact = whatsapp('Ciao Rossella, vorrei proporre un incontro sulla donazione di sangue e midollo osseo nella mia scuola.')

export const chapters = [
  { id: 'inizio', label: 'Inizio' },
  { id: 'storia', label: 'Storia' },
  { id: 'obiettivi', label: 'Obiettivi' },
  { id: 'progetti', label: 'Progetti' },
  { id: 'nuovi-eventi', label: 'Nuovi Eventi' },
  { id: 'eventi', label: 'Eventi' },
  { id: 'gadget', label: 'Gadget' },
  { id: 'contatti', label: 'Contatti' },
] as const

export const donation = {
  blood: 'https://www.donailsangue.salute.gov.it/it/sangue-pagina/come-donare/',
  marrow: 'https://ibmdr.galliera.it/come-diventare-donatore/informazioni-per-i-donatori/iscrizione',
}

export interface FeaturedProject {
  id: string
  title: string
  badge: string
  place: string
  summary: string
  detail: string
  imageSrc: string
  ctaLabel: string
  ctaUrl: string
  sortOrder?: number
  isVisible?: boolean
}

export const featuredProjects: readonly FeaturedProject[] = [
  {
    id: 'scuole',
    title: 'Progetto Scuole — Donare è amare',
    badge: 'Scuole e sensibilizzazione',
    place: 'Istituti e Licei · Napoli e Campania',
    summary: 'Incontriamo studentesse e studenti nelle scuole per raccontare la storia di Diana e avvicinare i giovani dai 18 anni alla cultura del dono di sangue e midollo osseo.',
    detail: 'Durante gli incontri portiamo testimonianze dirette di donatori, volontari e medici, rispondendo alle domande dei ragazzi su come iscriversi al Registro Italiano Donatori di Midollo Osseo (IBMDR) e come iniziare a donare il sangue.',
    imageSrc: '/media/archivio/donare-insieme.webp',
    ctaLabel: 'Portaci nella tua scuola',
    ctaUrl: schoolContact,
  },
  {
    id: 'disneyland-paris',
    title: 'Viaggio a Disneyland Paris',
    badge: 'Dona un ricordo felice',
    place: 'Ospedale Santobono Pausilipon · Parigi',
    summary: 'Un progetto speciale per regalare ai bambini in cura nei reparti di oncologia pediatrica dell’Ospedale Santobono Pausilipon e alle loro famiglie un viaggio indimenticabile a Disneyland Paris.',
    detail: 'Con il progetto «Dona un ricordo felice», le raccolte solidali e il sostegno della comunità si trasformano in giorni di meraviglia, spensieratezza e sorrisi per i piccoli pazienti e i loro genitori.',
    imageSrc: '/media/archivio/pasqua-solidale.webp',
    ctaLabel: 'Sostieni il viaggio con Rossella',
    ctaUrl: whatsapp('Ciao Rossella, vorrei informazioni per sostenere il progetto Viaggio a Disneyland Paris.'),
  },
  {
    id: 'cucina-delle-mamme',
    title: 'La cucina delle mamme',
    badge: 'Solidarietà in reparto',
    place: 'Ospedale Pausilipon · Napoli',
    summary: 'Una cucina attrezzata e accogliente donata all’Ospedale Pausilipon per le mamme e le famiglie dei bambini ricoverati.',
    detail: 'Uno spazio pensato per far sentire a casa chi affronta lunghi periodi in ospedale accanto ai propri figli, realizzato grazie alla generosità di tutte le persone che sostengono Gli Unicorni di Diana.',
    imageSrc: '/media/archivio/donazione-sangue.webp',
    ctaLabel: 'Guarda il racconto su Facebook',
    ctaUrl: 'https://www.facebook.com/GliUnicorniDiDIANA/posts/pfbid035hag3b5p1xhYSq4jVJ3TccZUY8Rn28PeWWj5fyRgAMMCxwmjuyViAAAr99TaeMj7l',
  },
]

export interface UpcomingEvent {
  id: string
  title: string
  category: string
  place: string
  dateLabel: string
  dateIso?: string
  summary: string
  detail: string
  imageSrc: string
  ctaLabel: string
  ctaUrl: string
  sortOrder?: number
  isVisible?: boolean
}

export const upcomingEvents: readonly UpcomingEvent[] = [
  {
    id: 'prossimo-incontro-scuole',
    title: 'Nuovi incontri nelle scuole «Donare è amare»',
    category: 'Scuole',
    place: 'Napoli e provincia',
    dateLabel: 'Prossimi appuntamenti 2026/2027',
    dateIso: '2026-11-30',
    summary: 'Continua il calendario di incontri con gli studenti delle scuole superiori per parlare insieme di donazione di sangue e midollo osseo.',
    detail: 'Vuoi invitare Gli Unicorni di Diana nel tuo istituto o conoscere la data del prossimo incontro aperto al pubblico? Scrivi direttamente a Rossella su WhatsApp.',
    imageSrc: '/media/archivio/donare-insieme.webp',
    ctaLabel: 'Chiedi le date a Rossella',
    ctaUrl: whatsapp('Ciao Rossella, vorrei conoscere le date dei prossimi eventi degli Unicorni di Diana.'),
  },
  {
    id: 'campagna-natale-solidale',
    title: 'Campagna Solidale per il Viaggio a Disneyland Paris',
    category: 'Raccolta solidale',
    place: 'Napoli · Ospedale Santobono Pausilipon',
    dateLabel: 'Campagna attiva',
    dateIso: '2026-12-15',
    summary: 'Iniziative e incontri solidali a sostegno del progetto «Dona un ricordo felice — Un viaggio a Disneyland Paris» per i bambini dell’oncologia pediatrica.',
    detail: 'Contatta Rossella per partecipare ai banchetti solidali o prenotare i prodotti delle campagne stagionali a sostegno dei progetti in reparto.',
    imageSrc: '/media/archivio/natale-solidale.webp',
    ctaLabel: 'Partecipa con Rossella',
    ctaUrl: whatsapp('Ciao Rossella, vorrei partecipare alle nuove iniziative solidali degli Unicorni di Diana.'),
  },
]

export const events = [
  {
    id: 'donare-e-amare',
    title: 'Donare è amare',
    type: 'Scuole',
    place: 'Auditorium Porta del Parco, Napoli',
    date: '21 aprile 2026',
    dateTime: '2026-04-21',
    summary: 'Una mattinata con le scuole della X Municipalità, tra domande degli studenti e testimonianze di chi ha donato.',
    detail: 'L’incontro ha riunito studenti, volontari e professionisti della salute a Bagnoli. Tra le testimonianze, quella di Francesco Sazio, donatore di midollo osseo.',
    source: 'Leggi la scheda dell’incontro',
    url: 'https://commissari.gov.it/bagnoli/comunicazione/eventi/donare/',
  },
  {
    id: 'liceo-labriola',
    title: 'Incontro al liceo Labriola',
    type: 'Scuole',
    place: 'Liceo Arturo Labriola, Napoli',
    summary: 'Un incontro con ragazze e ragazzi per parlare della cultura del dono.',
    detail: 'Nel reel dell’incontro, Gli Unicorni di Diana raccontano l’accoglienza del liceo e perché vogliono portare il tema della donazione in altre scuole.',
    source: 'Guarda il reel su Instagram',
    url: 'https://www.instagram.com/gliunicornididiana/reel/DRRpru9gvrf/',
  },
  {
    id: 'cucina-delle-mamme',
    title: 'La cucina delle mamme',
    type: 'Solidarietà',
    place: 'Ospedale Pausilipon, Napoli',
    summary: 'Una cucina donata all’ospedale per le mamme dei bambini in cura.',
    detail: 'La donazione è stata possibile grazie alle persone che hanno sostenuto l’iniziativa. Le foto della cucina sono raccolte nel post degli Unicorni di Diana.',
    source: 'Guarda il racconto su Facebook',
    url: 'https://www.facebook.com/GliUnicorniDiDIANA/posts/pfbid035hag3b5p1xhYSq4jVJ3TccZUY8Rn28PeWWj5fyRgAMMCxwmjuyViAAAr99TaeMj7l',
  },
]

export const iban = {
  code: 'IT57H0200803446000106388833',
  beneficiary: 'GLI UNICORNI DI DIANA ODV',
  proceedsNote: 'Per richiedere i gadget solidali o gratuiti contatta direttamente Rossella.',
} as const

export interface SolidarityProduct {
  id: string
  label: string
  item: string
  kind: 'solidale' | 'gratuito'
  icon: 'shirt' | 'sweatshirt' | 'hat' | 'book' | 'pin' | 'pen' | 'bracelet'
  category: string
  price: string
  badge?: string
  glb: string
  src: string
  alt: string
  description: string
  availabilityNote: string
}

export const solidarity: readonly SolidarityProduct[] = [
  {
    id: 't-shirt',
    label: 'T-shirt',
    item: 'la T-shirt',
    kind: 'solidale',
    icon: 'shirt',
    category: 'Gadget solidale',
    price: '10 €',
    badge: 'Novità',
    glb: '/media/gadget/t-shirt.glb',
    src: '/media/gadget/t-shirt.webp',
    alt: 'T-shirt bianche ufficiali Gli Unicorni di Diana con logo sul petto e variante «grazie a me oggi un bimbo sorriderà»',
    description: 'T-shirt bianca in due grafiche ufficiali (ruota il modello 3D per vedere entrambi i lati): stampa «grazie a me oggi un bimbo sorriderà · FALLO ANCHE TU!» e logo classico degli Unicorni di Diana.',
    availabilityNote: 'Contatta direttamente Rossella per taglie disponibili, variante preferita e modalità di consegna.',
  },
  {
    id: 'felpe',
    label: 'Felpa',
    item: 'la felpa',
    kind: 'solidale',
    icon: 'sweatshirt',
    category: 'Gadget solidale',
    price: '20 €',
    glb: '/media/gadget/felpa.glb',
    src: '/media/gadget/felpa.webp',
    alt: 'Felpa bianca girocollo ufficiale Associazione Gli Unicorni di Diana con il marchio sul petto',
    description: 'Felpa bianca girocollo con il simbolo ufficiale Associazione Gli Unicorni di Diana, pensata per accompagnare incontri, iniziative e giornate dedicate alla cultura del dono.',
    availabilityNote: 'Contatta direttamente Rossella per taglie disponibili e modalità di consegna.',
  },
  {
    id: 'cappello',
    label: 'Cappello',
    item: 'il cappello',
    kind: 'solidale',
    icon: 'hat',
    category: 'Gadget solidale',
    price: '5 €',
    glb: '/media/gadget/cappello.glb',
    src: '/media/gadget/cappello.webp',
    alt: 'Cappello bianco ufficiale Associazione Gli Unicorni di Diana con il marchio sul davanti',
    description: 'Cappello bianco con il logo ufficiale dell’Associazione Gli Unicorni di Diana: un gesto semplice per portare con te il ricordo di Diana e sostenere i progetti solidali.',
    availabilityNote: 'Contatta direttamente Rossella per disponibilità e modalità di ritiro.',
  },
  {
    id: 'libro',
    label: 'Libro',
    item: 'il libro «Sulle mie spalle, dentro il mio cuore»',
    kind: 'solidale',
    icon: 'book',
    category: 'Gadget solidale',
    price: '20 €',
    glb: '/media/gadget/libro.glb',
    src: '/media/gadget/libro.webp',
    alt: 'Copertina del libro «Sulle mie spalle, dentro il mio cuore — Rinascere lungo il Cammino per Santiago» di Michele Bisceglia',
    description: '«Sulle mie spalle, dentro il mio cuore — Rinascere lungo il Cammino per Santiago» di Michele Bisceglia (Franco Di Mauro Editore): il ricavato sostiene direttamente i progetti dell’associazione.',
    availabilityNote: 'Contatta direttamente Rossella per disponibilità delle copie e come riceverlo.',
  },
  {
    id: 'spilla',
    label: 'Spilla',
    item: 'la spilla ufficiale',
    kind: 'gratuito',
    icon: 'pin',
    category: 'Gadget gratuito',
    price: 'Gratuito',
    badge: 'Omaggio gratuito',
    glb: '/media/gadget/spilla.glb',
    src: '/media/gadget/spilla.webp',
    alt: 'Spilla rotonda ufficiale con il logo Gli Unicorni di Diana',
    description: 'La spilletta ufficiale degli Unicorni di Diana: un piccolo simbolo gratuito da appuntare su zaino o giacca per diffondere ogni giorno il messaggio della donazione.',
    availabilityNote: 'Gadget gratuito: contatta direttamente Rossella per riceverla durante gli incontri o concordare il ritiro.',
  },
  {
    id: 'penna',
    label: 'Penna',
    item: 'la penna ufficiale',
    kind: 'gratuito',
    icon: 'pen',
    category: 'Gadget gratuito',
    price: 'Gratuito',
    badge: 'Omaggio gratuito',
    glb: '/media/gadget/penna.glb',
    src: '/media/gadget/penna.webp',
    alt: 'Penna ufficiale Gli Unicorni di Diana bianca e viola con marchio sul fusto',
    description: 'La penna degli Unicorni di Diana distribuita gratuitamente agli studenti e ai partecipanti durante gli incontri nelle scuole e le giornate informative.',
    availabilityNote: 'Gadget gratuito: contatta direttamente Rossella per richiederla.',
  },
  {
    id: 'bracciale',
    label: 'Bracciale',
    item: 'il bracciale ufficiale',
    kind: 'gratuito',
    icon: 'bracelet',
    category: 'Gadget gratuito',
    price: 'Gratuito',
    badge: 'Omaggio gratuito',
    glb: '/media/gadget/bracciale.glb',
    src: '/media/gadget/bracciale.webp',
    alt: 'Bracciale ufficiale Gli Unicorni di Diana nei colori pastello arcobaleno e viola (modello 3D segnaposto)',
    description: 'Il braccialetto gratuito degli Unicorni di Diana da portare sempre al polso come segno di vicinanza e memoria. (Modello 3D segnaposto).',
    availabilityNote: 'Gadget gratuito: contatta direttamente Rossella per richiederlo.',
  },
]

export const archiveMedia = [
  { file: 'donare-insieme', label: 'Donare è amare', caption: 'Una foto di gruppo durante un’iniziativa di sensibilizzazione.' },
  { file: 'settimana-midollo', label: 'Settimana del midollo osseo', caption: 'La locandina della campagna per il Registro donatori, con il ritratto di Diana.' },
  { file: 'donazione-sangue', label: 'Donazione di sangue', caption: 'Una locandina delle iniziative al Pausilipon. Per le informazioni attuali, consulta la sezione Obiettivi.' },
  { file: 'pasqua-solidale', label: 'Pasqua solidale', caption: 'La locandina della raccolta solidale con le uova di Pasqua.' },
  { file: 'natale-solidale', label: 'Natale solidale', caption: 'La locandina della raccolta solidale con i panettoni. Disponibilità e prezzi si riferiscono alla campagna illustrata.' },
] as const

function archivePath(file: string, thumb = false) {
  return `/media/archivio/${file}${thumb ? '-thumb' : ''}.webp`
}

export interface ArchiveEventItem {
  id: string
  title: string
  category?: string
  place?: string
  date?: string
  dateTime?: string
  summary?: string
  description?: string
  sourceLabel?: string
  url?: string
  src: string
  fullSrc: string
  alt: string
  isPlaceholder?: boolean
}

export const baseSphereEvents: ArchiveEventItem[] = [
  {
    id: events[0].id,
    title: events[0].title,
    category: events[0].type,
    place: events[0].place,
    date: events[0].date,
    dateTime: events[0].dateTime,
    summary: events[0].summary,
    description: events[0].detail,
    sourceLabel: events[0].source,
    url: events[0].url,
    src: archivePath(archiveMedia[0].file, true),
    fullSrc: archivePath(archiveMedia[0].file),
    alt: archiveMedia[0].label,
  },
  {
    id: events[1].id,
    title: events[1].title,
    category: events[1].type,
    place: events[1].place,
    summary: events[1].summary,
    description: events[1].detail,
    sourceLabel: events[1].source,
    url: events[1].url,
    src: placeholderMedia.src,
    fullSrc: placeholderMedia.src,
    alt: placeholderMedia.alt,
    isPlaceholder: true,
  },
  {
    id: events[2].id,
    title: events[2].title,
    category: events[2].type,
    place: events[2].place,
    summary: events[2].summary,
    description: events[2].detail,
    sourceLabel: events[2].source,
    url: events[2].url,
    src: placeholderMedia.src,
    fullSrc: placeholderMedia.src,
    alt: placeholderMedia.alt,
    isPlaceholder: true,
  },
  ...archiveMedia.slice(1).map(({ file, label, caption }) => ({
    id: file,
    title: label,
    category: file === 'settimana-midollo' || file === 'donazione-sangue' ? 'Campagna' : 'Solidarietà',
    summary: caption,
    src: archivePath(file, true),
    fullSrc: archivePath(file),
    alt: label,
  })),
]

export function expandToSphereItems(items: readonly ArchiveEventItem[], targetCount = 28) {
  const source = items.length ? items : baseSphereEvents
  return Array.from({ length: targetCount }, (_, index) => {
    const item = source[index % source.length]
    return {
      ...item,
      id: `${item.id}-${index + 1}`,
    }
  })
}

export const sphereEvents = expandToSphereItems(baseSphereEvents)
