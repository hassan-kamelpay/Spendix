import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { AppProvider } from './context/AppContext'
import App from './App'
import './index.css'

// ── PWA: auto-update service worker ──────────────────────────────────────────
const updateSW = registerSW({
  onNeedRefresh() {
    // Show a refresh prompt — swap this with a custom toast/banner if desired
    if (confirm('New version available! Reload to update?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('[PWA] App is ready for offline use')
  },
})

// ── Render ────────────────────────────────────────────────────────────────────
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
)
