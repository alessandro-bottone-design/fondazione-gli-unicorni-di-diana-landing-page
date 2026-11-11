import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/newsreader/latin-400-italic.css'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="*" element={<main className="shell not-found"><h1>Pagina non trovata</h1><a href="/">Torna alla pagina iniziale</a></main>} />
    </Routes>
  </BrowserRouter>,
)
