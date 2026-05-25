/**
 * Google Sheets API v4 Service
 * ─────────────────────────────────────────────────────────────────────────────
 * Requires the following .env variables (see .env.example):
 *   VITE_GOOGLE_SHEETS_API_KEY  — API key (read-only for public sheets)
 *   VITE_SPREADSHEET_ID         — The spreadsheet ID from the URL
 *   VITE_SHEET_NAME             — Sheet tab name (default: "Expenses")
 *
 * Sheet column layout (row 1 = headers):
 *   A: ID | B: Amount | C: Description | D: Category | E: Date
 *   F: PaymentMethod | G: Notes | H: CreatedAt
 *
 * ⚠  NOTE ON AUTHENTICATION:
 *   Read-only access to PUBLIC sheets works with just an API key.
 *   Write operations (append, update, delete) require OAuth2 or a Service
 *   Account token.  For a production setup, proxy the write calls through
 *   a Vercel Edge Function / API Route that holds your service-account
 *   credentials securely on the server side.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets'

// ── Helpers ────────────────────────────────────────────────────────────────────
const readHeaders  = ()      => ({ 'Content-Type': 'application/json' })
const writeHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

const cfg = (config) => ({
  API_KEY:        config?.apiKey        || import.meta.env.VITE_GOOGLE_SHEETS_API_KEY  || '',
  SPREADSHEET_ID: config?.spreadsheetId || import.meta.env.VITE_SPREADSHEET_ID         || '',
  SHEET_NAME:     config?.sheetName     || import.meta.env.VITE_SHEET_NAME             || 'Expenses',
  TOKEN:          config?.token         || null,
})

const rowToExpense = (row) => ({
  id:            row[0] ?? '',
  amount:        parseFloat(row[1]) || 0,
  description:   row[2] ?? '',
  category:      row[3] ?? 'other',
  date:          row[4] ?? '',
  paymentMethod: row[5] ?? '',
  notes:         row[6] ?? '',
  createdAt:     row[7] ?? '',
})

const expenseToRow = (e) => [
  e.id, e.amount, e.description, e.category,
  e.date, e.paymentMethod, e.notes ?? '', e.createdAt,
]

// ── READ ───────────────────────────────────────────────────────────────────────
/**
 * Fetch all expenses from Google Sheets.
 * Returns an array of expense objects (skips the header row).
 */
export async function fetchExpenses(config) {
  const { API_KEY, SPREADSHEET_ID, SHEET_NAME, TOKEN } = cfg(config)
  if (!SPREADSHEET_ID || (!TOKEN && !API_KEY)) {
    console.warn('[sheetsApi] Missing credentials — skipping fetch')
    return []
  }

  const range = `${SHEET_NAME}!A2:H`
  const url   = TOKEN
    ? `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}`
    : `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`

  const res = await fetch(url, { headers: TOKEN ? writeHeaders(TOKEN) : readHeaders() })
  if (!res.ok) throw new Error(`Sheets GET failed: ${res.status} ${res.statusText}`)

  const json = await res.json()
  return (json.values ?? []).map(rowToExpense)
}

// ── CREATE ─────────────────────────────────────────────────────────────────────
/**
 * Append a new expense row to the sheet.
 * Requires a valid OAuth2 / service-account Bearer token for write access.
 */
export async function appendExpense(expense, config) {
  const { TOKEN, SPREADSHEET_ID, SHEET_NAME } = cfg(config)
  if (!TOKEN) throw new Error('Google account not connected. Please connect in Settings.')

  const range = `${SHEET_NAME}!A:H`
  const url   = `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}:append`
                + `?valueInputOption=RAW&insertDataOption=INSERT_ROWS`

  const res = await fetch(url, {
    method:  'POST',
    headers: writeHeaders(TOKEN),
    body:    JSON.stringify({ values: [expenseToRow(expense)] }),
  })
  if (!res.ok) throw new Error(`Sheets APPEND failed: ${res.status}`)
  return res.json()
}

// ── UPDATE ─────────────────────────────────────────────────────────────────────
/**
 * Find the row with the matching ID, then update it in-place.
 * This is a two-step operation: read all rows to find the row index, then PUT.
 */
export async function updateExpense(id, data, config) {
  const { TOKEN, SPREADSHEET_ID, SHEET_NAME } = cfg(config)
  if (!TOKEN) throw new Error('Google account not connected. Please connect in Settings.')

  const all = await fetchExpenses(config)
  const idx = all.findIndex(e => e.id === id)
  if (idx === -1) throw new Error(`Expense ${id} not found in sheet`)

  const rowNum = idx + 2
  const range  = `${SHEET_NAME}!A${rowNum}:H${rowNum}`
  const url    = `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=RAW`

  const updated = { ...all[idx], ...data }
  const res = await fetch(url, {
    method:  'PUT',
    headers: writeHeaders(TOKEN),
    body:    JSON.stringify({ values: [expenseToRow(updated)] }),
  })
  if (!res.ok) throw new Error(`Sheets PUT failed: ${res.status}`)
  return res.json()
}

// ── DELETE ─────────────────────────────────────────────────────────────────────
/**
 * Delete a row by ID using the batchUpdate + DeleteDimensionRequest API.
 * Requires OAuth2 / service-account write access.
 */
export async function deleteExpense(id, config) {
  const { TOKEN, API_KEY, SPREADSHEET_ID } = cfg(config)
  if (!TOKEN) throw new Error('Google account not connected. Please connect in Settings.')

  const metaUrl = `${BASE_URL}/${SPREADSHEET_ID}?key=${API_KEY}`
  const [all, sheetMeta] = await Promise.all([
    fetchExpenses(config),
    fetch(metaUrl).then(r => r.json()),
  ])

  const idx = all.findIndex(e => e.id === id)
  if (idx === -1) throw new Error(`Expense ${id} not found in sheet`)

  const sheetId  = sheetMeta.sheets?.[0]?.properties?.sheetId ?? 0
  const rowIndex = idx + 1

  const url = `${BASE_URL}/${SPREADSHEET_ID}:batchUpdate`
  const res = await fetch(url, {
    method:  'POST',
    headers: writeHeaders(TOKEN),
    body: JSON.stringify({
      requests: [{
        deleteDimension: {
          range: { sheetId, dimension: 'ROWS', startIndex: rowIndex, endIndex: rowIndex + 1 },
        },
      }],
    }),
  })
  if (!res.ok) throw new Error(`Sheets DELETE failed: ${res.status}`)
  return res.json()
}

// ── INIT SHEET ─────────────────────────────────────────────────────────────────
/**
 * Write the header row if the sheet is empty.
 * Run this once to initialise a blank spreadsheet.
 */
export async function initSheet(config) {
  const { TOKEN, SPREADSHEET_ID, SHEET_NAME } = cfg(config)
  if (!TOKEN) throw new Error('Google account not connected. Please connect in Settings.')

  const range = `${SHEET_NAME}!A1:H1`
  const url   = `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=RAW`

  const res = await fetch(url, {
    method:  'PUT',
    headers: writeHeaders(TOKEN),
    body:    JSON.stringify({ values: [['ID', 'Amount', 'Description', 'Category', 'Date', 'PaymentMethod', 'Notes', 'CreatedAt']] }),
  })
  if (!res.ok) throw new Error(`Sheets INIT failed: ${res.status}`)
  return res.json()
}
