export const foundation = 'Fondazione Gli Unicorni di Diana'

export const dianaPortrait = { src: '/media/ritratto-diana.webp', width: 916, height: 1020 } as const

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
  { id: 'eventi', label: 'Eventi' },
  { id: 'gadget', label: 'Gadget' },
  { id: 'contatti', label: 'Contatti' },
] as const

export const donation = {
  blood: 'https://www.donailsangue.salute.gov.it/it/sangue-pagina/come-donare/',
  marrow: 'https://ibmdr.galliera.it/come-diventare-donatore/informazioni-per-i-donatori/iscrizione',
}

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

export const solidarity = [
  {
    id: 't-shirt',
    label: 'T-shirt',
    item: 'la T-shirt',
    icon: 'shirt',
    category: 'Acquisto solidale',
    src: '/media/gadget/t-shirt.webp',
    alt: 'T-shirt in cotone chiaro della Fondazione Gli Unicorni di Diana con il marchio sul petto',
    description: 'T-shirt con il simbolo degli Unicorni di Diana: indossarla aiuta a far conoscere la donazione di sangue e midollo osseo e sostiene i progetti della Fondazione.',
    availabilityNote: 'Chiedi a Rossella taglie disponibili, colori e modalità di consegna su WhatsApp.',
  },
  {
    id: 'felpe',
    label: 'Felpe',
    item: 'le felpe',
    icon: 'sweatshirt',
    category: 'Acquisto solidale',
    src: '/media/gadget/felpa.webp',
    alt: 'Felpa lilla della Fondazione Gli Unicorni di Diana con il marchio ricamato',
    description: 'Felpa morbida con il segno degli Unicorni di Diana, pensata per accompagnare incontri, iniziative e giornate dedicate alla cultura del dono.',
    availabilityNote: 'Chiedi a Rossella taglie disponibili, modelli e modalità di consegna su WhatsApp.',
  },
  {
    id: 'cappello',
    label: 'Cappello',
    item: 'il cappello',
    icon: 'hat',
    category: 'Acquisto solidale',
    src: '/media/gadget/cappello.webp',
    alt: 'Cappello della Fondazione Gli Unicorni di Diana con il marchio dell’unicorno ricamato sul davanti',
    description: 'Cappello con il marchio ricamato della Fondazione: un gesto semplice per portare con te il ricordo di Diana e sostenere le attività nelle scuole e in ospedale.',
    availabilityNote: 'Chiedi a Rossella disponibilità e modalità di ritiro o spedizione su WhatsApp.',
  },
  {
    id: 'libro',
    label: 'Libro',
    item: 'il libro',
    icon: 'book',
    category: 'Acquisto solidale',
    src: '/media/gadget/libro.webp',
    alt: 'Libro della Fondazione Gli Unicorni di Diana con il simbolo dell’unicorno in copertina',
    description: 'Il libro dedicato alla storia di Diana e al percorso nato nel suo ricordo, per sostenere gli incontri di sensibilizzazione con ragazze e ragazzi.',
    availabilityNote: 'Chiedi a Rossella disponibilità delle copie e come riceverlo su WhatsApp.',
  },
] as const

export type SolidarityProduct = (typeof solidarity)[number]

export const credits = {
  author: 'Soufiane Oujihi',
  model: 'https://sketchfab.com/3d-models/unicorn-3d-c89d06fe31694234bee10e42c2919299',
  license: 'https://creativecommons.org/licenses/by/4.0/',
}

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

const baseSphereEvents = [
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

export const sphereEvents = Array.from({ length: 28 }, (_, index) => {
  const item = baseSphereEvents[index % baseSphereEvents.length]
  return {
    ...item,
    id: `${item.id}-${index + 1}`,
  }
})
