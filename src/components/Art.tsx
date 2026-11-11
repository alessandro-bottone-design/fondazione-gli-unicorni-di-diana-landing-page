export const heartPaths = ['M284 0c0 83 0 95-44 110-29 10-58 1-87-7-49-14-90-43-135-44 23 31 43 46 90 63-33-7-62-21-89-30 20 33 61 55 100 62-29-1-52-8-78-17 26 36 58 51 99 52-25 2-43 1-65-3 25 30 55 38 88 35-16 5-29 9-43 9 24 20 48 21 71 13',
  'M329 110c29 10 58 1 87-7 49-14 90-43 135-44-23 31-43 46-90 63 33-7 62-21 89-30-20 33-61 55-100 62 29-1 52-8 78-17-26 36-58 51-99 52 25 2 43 1 65-3-25 30-55 38-88 35 16 5 29 9 43 9-24 20-48 21-71 13',
  'M284 318c-12-16-29-29-51-46-32-25-54-53-48-86 5-26 26-43 50-43 24 0 39 13 49 31 10-18 25-31 49-31 24 0 45 17 50 43 6 33-16 61-48 86-22 17-39 30-51 46Z'] as const

export function Fork() {
  return (
    <svg className="fork" viewBox="0 0 800 96" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <path data-thread d="M400 0v20c0 47-200 9-200 56v20" />
      <path data-thread d="M400 20c0 47 200 9 200 56v20" />
      <circle cx="400" cy="20" r="4" />
    </svg>
  )
}

export function WingedHeart() {
  return (
    <svg className="winged-heart" viewBox="0 0 568 400" fill="none" aria-hidden="true">
      <circle cx="284" cy="200" r="151" className="heart-guide" strokeDasharray="1 7" />
      <path d="M284 0v91m0 218v91M30 200h30m448 0h30" className="heart-guide" />
      {heartPaths.map((path) => <path key={path} d={path} />)}
      <path d="M284 352v22m-11-11h22m-140-74v18m-9-9h18m249-9v18m-9-9h18" className="heart-guide" />
    </svg>
  )
}
