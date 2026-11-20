import { Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import '@fontsource/fraunces/latin-400.css'
import '@fontsource/fraunces/latin-400-italic.css'
import '@fontsource/manrope/latin-400.css'
import '@fontsource/manrope/latin-600.css'
import App from './App'
import './styles.css'

const AdminPage = lazy(() => import('./admin/AdminPage'))

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route
        path="/admin"
        element={
          <Suspense
            fallback={
              <main className="shell not-found">
                <p>Caricamento pannello di Rossella...</p>
              </main>
            }
          >
            <AdminPage />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={
          <main className="shell not-found">
            <h1>Pagina non trovata</h1>
            <a href="/">Torna alla pagina iniziale</a>
          </main>
        }
      />
    </Routes>
  </BrowserRouter>,
)
