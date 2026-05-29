import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { CURRENCIES } from '../constants'
import { uid } from '../utils'
import * as sheetsApi from '../services/sheetsApi'
import { useGoogleAuth } from '../hooks/useGoogleAuth'

// ── Theme ──────────────────────────────────────────────────────────────────────
export const T = (dark) => ({
  bg:         dark ? '#080d1a'                : '#f0f4f8',
  card:       dark ? '#0f1829'                : '#ffffff',
  card2:      dark ? '#141f35'                : '#f8fafc',
  border:     dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)',
  text:       dark ? '#f8fafc'                : '#0f172a',
  textSub:    dark ? '#94a3b8'                : '#64748b',
  textMuted:  dark ? '#475569'                : '#94a3b8',
  accent:     '#22c55e',
  accentDim:  dark ? 'rgba(34,197,94,0.1)'    : 'rgba(34,197,94,0.07)',
  accentText: dark ? '#4ade80'                : '#15803d',
  red:        '#ef4444',
  redDim:     dark ? 'rgba(239,68,68,0.1)'    : 'rgba(239,68,68,0.07)',
  blue:       '#3b82f6',
  sidebar:    dark ? '#060c18'                : '#0f172a',
  inputBg:    dark ? '#0f1829'                : '#f8fafc',
  shadow:     dark ? '0 4px 28px rgba(0,0,0,0.45)' : '0 4px 24px rgba(0,0,0,0.09)',
})

// ── Default prefs ──────────────────────────────────────────────────────────────
const DEFAULT_PREFS = {
  darkMode:        true,
  currency:        'USD',
  monthlyBudget:   0,
  useSheets:       import.meta.env.VITE_USE_SHEETS === 'true',
  sheetsApiKey:    '',
  spreadsheetId:   import.meta.env.VITE_SPREADSHEET_ID || '',
  sheetName:       'Expenses',
  googleClientId:  '',
}

const DEFAULT_BUDGETS = {
  food: 0, transport: 0, bills: 0, shopping: 0,
  entertainment: 0, health: 0, travel: 0, education: 0, other: 0,
}

// ── Context ───────────────────────────────────────────────────────────────────
const Ctx = createContext(null)

export function AppProvider({ children }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [expenses, setExpenses] = useState(() => {
    try { const s = localStorage.getItem('sx_exp'); return s ? JSON.parse(s) : [] }
    catch { return [] }
  })

  const [budgets, setBudgets] = useState(() => {
    try { const s = localStorage.getItem('sx_bud'); if (s) return JSON.parse(s) }
    catch {}
    return DEFAULT_BUDGETS
  })

  const [prefs, setPrefs] = useState(() => {
    try {
      const s = localStorage.getItem('sx_prf')
      return s ? { ...DEFAULT_PREFS, ...JSON.parse(s) } : DEFAULT_PREFS
    } catch { return DEFAULT_PREFS }
  })

  const [toasts, setToasts]   = useState([])
  const [loading, setLoading] = useState(false)

  const { token, connected: googleConnected, connect: connectGoogle, disconnect: disconnectGoogle } =
    useGoogleAuth(prefs.googleClientId || import.meta.env.VITE_GOOGLE_CLIENT_ID)

  // ── Persist ────────────────────────────────────────────────────────────────
  useEffect(() => localStorage.setItem('sx_exp', JSON.stringify(expenses)), [expenses])
  useEffect(() => localStorage.setItem('sx_bud', JSON.stringify(budgets)),  [budgets])
  useEffect(() => localStorage.setItem('sx_prf', JSON.stringify(prefs)),    [prefs])

  const sheetsCfg = {
    apiKey:        prefs.sheetsApiKey  || undefined,
    spreadsheetId: prefs.spreadsheetId || undefined,
    sheetName:     prefs.sheetName     || 'Expenses',
    token:         token               || undefined,
  }

  // ── Sync from Google Sheets on mount (if enabled) ─────────────────────────
  useEffect(() => {
    if (!prefs.useSheets) return
    setLoading(true)
    sheetsApi.fetchExpenses(sheetsCfg)
      .then(data => { if (data.length) setExpenses(data) })
      .catch(err => console.error('Sheets sync failed:', err))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs.useSheets, prefs.sheetsApiKey, prefs.spreadsheetId])

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const toast = useCallback((msg, type = 'success') => {
    const id = uid()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const addExpense = useCallback(async (data) => {
    const expense = { ...data, id: uid(), createdAt: new Date().toISOString() }
    setExpenses(prev => [expense, ...prev])
    if (prefs.useSheets) {
      try { await sheetsApi.appendExpense(expense, sheetsCfg) }
      catch { toast('Saved locally — Sheets sync failed', 'warning') }
    }
    toast('Expense added')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs.useSheets, prefs.sheetsApiKey, prefs.spreadsheetId, toast])

  const updateExpense = useCallback(async (id, data) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...data } : e))
    if (prefs.useSheets) {
      try { await sheetsApi.updateExpense(id, data, sheetsCfg) }
      catch { toast('Updated locally — Sheets sync failed', 'warning') }
    }
    toast('Expense updated')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs.useSheets, prefs.sheetsApiKey, prefs.spreadsheetId, toast])

  const deleteExpense = useCallback(async (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
    if (prefs.useSheets) {
      try { await sheetsApi.deleteExpense(id, sheetsCfg) }
      catch { toast('Deleted locally — Sheets sync failed', 'warning') }
    }
    toast('Expense deleted', 'error')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs.useSheets, prefs.sheetsApiKey, prefs.spreadsheetId, toast])

  // ── Derived ────────────────────────────────────────────────────────────────
  const currSym = CURRENCIES.find(c => c.code === prefs.currency)?.sym ?? '$'

  return (
    <Ctx.Provider value={{
      expenses, budgets, setBudgets,
      prefs, setPrefs,
      toasts, toast,
      addExpense, updateExpense, deleteExpense,
      currSym, loading,
      googleConnected, connectGoogle, disconnectGoogle,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
