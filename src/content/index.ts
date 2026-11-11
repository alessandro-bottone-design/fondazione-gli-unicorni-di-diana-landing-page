export const foundation = 'Fondazione Gli Unicorni di Diana'

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

export const gifts = [
  { label: 'Penne', icon: 'pen' },
  { label: 'Spillette', icon: 'pin' },
  { label: 'Braccialetti', icon: 'bracelet' },
] as const

export const solidarity = [
  { label: 'T-shirt', item: 'la T-shirt', icon: 'shirt' },
  { label: 'Felpe', item: 'le felpe', icon: 'sweatshirt' },
  { label: 'Cappello', item: 'il cappello', icon: 'hat' },
  { label: 'Libro', item: 'il libro', icon: 'book' },
] as const

export const credits = {
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
