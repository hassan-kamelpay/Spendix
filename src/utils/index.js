import { CATS } from '../constants'

// ── ID & Date ──────────────────────────────────────────────────────────────────
export const uid = () => Math.random().toString(36).slice(2, 10)

// ── Category lookup ────────────────────────────────────────────────────────────
export const getCat = (id) => CATS.find(c => c.id === id) ?? CATS[CATS.length - 1]

// ── Date helpers ───────────────────────────────────────────────────────────────
/** Returns "YYYY-MM" month key from a date string */
export const monthKey = (dateStr) => dateStr.slice(0, 7)

/** "YYYY-MM" → "Jan '24" */
export const monthName = (key) => {
  const [y, m] = key.split('-')
  return new Date(+y, +m - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

/** "YYYY-MM" → "Jan" */
export const monthShort = (key) => {
  const [y, m] = key.split('-')
  return new Date(+y, +m - 1).toLocaleDateString('en-US', { month: 'short' })
}

/** Current month key "YYYY-MM" */
export const currentMonthKey = () => {
  const n = new Date()
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`
}

/** Previous month key */
export const prevMonthKey = () => {
  const d = new Date()
  d.setMonth(d.getMonth() - 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

// ── Formatting ─────────────────────────────────────────────────────────────────
export const fmt = (amount, sym = '$') =>
  `${sym}${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const fmtDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const fmtShort = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

// ── CSV Export ─────────────────────────────────────────────────────────────────
export const exportCSV = (expenses, sym = '$') => {
  const headers = ['ID', 'Amount', 'Description', 'Category', 'Date', 'Payment Method', 'Notes', 'Created At']
  const rows = expenses.map(e => [
    e.id,
    e.amount,
    `"${e.description}"`,
    getCat(e.category).label,
    e.date,
    e.paymentMethod,
    `"${e.notes ?? ''}"`,
    e.createdAt,
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
  const a   = Object.assign(document.createElement('a'), { href: url, download: 'expenses.csv' })
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ── Aggregations ───────────────────────────────────────────────────────────────
export const sumAmounts = (expenses) => expenses.reduce((s, e) => s + e.amount, 0)

export const groupByMonth = (expenses) => {
  const groups = {}
  expenses.forEach(e => {
    const k = monthKey(e.date)
    if (!groups[k]) groups[k] = []
    groups[k].push(e)
  })
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
}

export const sumByCategory = (expenses) =>
  expenses.reduce((acc, e) => ({ ...acc, [e.category]: (acc[e.category] ?? 0) + e.amount }), {})

// ── Date cutoff from range string ─────────────────────────────────────────────
export const cutoffFromRange = (range) => {
  const d = new Date()
  if (range === '1m') d.setMonth(d.getMonth() - 1)
  else if (range === '3m') d.setMonth(d.getMonth() - 3)
  else if (range === '6m') d.setMonth(d.getMonth() - 6)
  else d.setFullYear(d.getFullYear() - 1)
  return d.toISOString().slice(0, 10)
}
