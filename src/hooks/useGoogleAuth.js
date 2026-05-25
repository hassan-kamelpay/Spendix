import { useState, useCallback, useRef } from 'react'

export function useGoogleAuth(clientId) {
  const [token, setToken]       = useState(null)
  const [connected, setConnected] = useState(false)
  const clientRef               = useRef(null)
  const expiryTimer             = useRef(null)

  const clearToken = useCallback(() => {
    setToken(null)
    setConnected(false)
    if (expiryTimer.current) clearTimeout(expiryTimer.current)
  }, [])

  const connect = useCallback(() => {
    if (!clientId) {
      alert('Google Client ID missing. Add VITE_GOOGLE_CLIENT_ID to .env or enter it in Settings.')
      return
    }
    if (!window.google?.accounts?.oauth2) {
      alert('Google Identity Services not loaded yet. Please wait a moment and try again.')
      return
    }

    if (!clientRef.current) {
      clientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        callback: (response) => {
          if (response.error) { console.error('OAuth error:', response.error); return }
          setToken(response.access_token)
          setConnected(true)
          // auto-disconnect when token expires
          expiryTimer.current = setTimeout(clearToken, (response.expires_in - 60) * 1000)
        },
      })
    }

    clientRef.current.requestAccessToken()
  }, [clientId, clearToken])

  const disconnect = useCallback(() => {
    if (token) window.google?.accounts?.oauth2?.revoke(token, () => {})
    clearToken()
  }, [token, clearToken])

  return { token, connected, connect, disconnect }
}
