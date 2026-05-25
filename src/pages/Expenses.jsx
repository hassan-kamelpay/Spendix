import { useState, useMemo } from 'react'
import { Search, X, Edit2, Trash2 } from 'lucide-react'
import { useApp, T } from '../context/AppContext'
import { CATS, PAYMENT_METHODS } from '../constants'
import { fmt, fmtDate, monthKey, monthName, groupByMonth, sumAmounts, getCat } from '../utils'
import Button from '../components/ui/Button'

export default function ExpensesPage({ onEdit }) {
  const { expenses, deleteExpense, prefs, currSym } = useApp()
  const t = T(prefs.darkMode)

  const [search,    setSearch]    = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [method,    setMethod]    = useState('all')
  const [sort,      setSort]      = useState('date-desc')
  const [confirmId, setConfirmId] = useState(null)

  const selStyle = {
    background: t.inputBg, border: `1px solid ${t.border}`,
    borderRadius: 10, color: t.text, fontSize: 13,
    padding: '8px 12px', outline: 'none', fontFamily: 'inherit',
  }

  const filtered = useMemo(() => {
    let arr = [...expenses]
    if (search)         arr = arr.filter(e => e.description.toLowerCase().includes(search.toLowerCase()) || e.notes?.toLowerCase().includes(search.toLowerCase()))
    if (catFilter !== 'all') arr = arr.filter(e => e.category === catFilter)
    if (method    !== 'all') arr = arr.filter(e => e.paymentMethod === method)
    const [k, d] = sort.split('-')
    arr.sort((a, b) => d === 'asc'
      ? (k === 'amount' ? a.amount - b.amount : a.date.localeCompare(b.date))
      : (k === 'amount' ? b.amount - a.amount : b.date.localeCompare(a.date))
    )
    return arr
  }, [expenses, search, catFilter, method, sort])

  const grouped = useMemo(() => groupByMonth(filtered), [filtered])
  const total   = useMemo(() => sumAmounts(filtered), [filtered])

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ color: t.text, fontSize: 28, fontWeight: 800, margin: '0 0 6px' }}>Expenses</h1>
        <p style={{ color: t.textSub, margin: 0, fontSize: 14 }}>
          {filtered.length} transactions · <strong style={{ color: t.text }}>{fmt(total, currSym)}</strong> total
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: '8px 14px', flex: 1, minWidth: 180 }}>
          <Search size={14} color={t.textMuted} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search expenses…"
            style={{ background: 'none', border: 'none', color: t.text, fontSize: 13, outline: 'none', width: '100%', fontFamily: 'inherit' }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, display: 'flex', padding: 0 }}><X size={13} /></button>}
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={selStyle}>
          <option value="all">All Categories</option>
          {CATS.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
        </select>
        <select value={method} onChange={e => setMethod(e.target.value)} style={selStyle}>
          <option value="all">All Methods</option>
          {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} style={selStyle}>
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>

      {/* List */}
      {grouped.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: t.textMuted }}>
          <Search size={42} style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 16, fontWeight: 600 }}>No expenses found</p>
          <p style={{ fontSize: 13 }}>Try adjusting your filters</p>
        </div>
      ) : grouped.map(([key, items]) => {
        const gTotal = sumAmounts(items)
        return (
          <div key={key} style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ color: t.textSub, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {monthName(key)}
              </span>
              <span style={{ color: t.textSub, fontSize: 13, fontWeight: 600 }}>{fmt(gTotal, currSym)}</span>
            </div>
            <div style={{ background: t.card, borderRadius: 18, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
              {items.map((e, i) => {
                const c = getCat(e.category)
                return (
                  <div key={e.id}
                    onMouseEnter={ev => ev.currentTarget.style.background = t.card2}
                    onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
                    style={{ padding: '13px 20px', display: 'flex', alignItems: 'center', gap: 14, borderTop: i > 0 ? `1px solid ${t.border}` : 'none', transition: 'background 0.15s' }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{c.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: t.text, fontWeight: 600, fontSize: 14, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.description}</p>
                      <p style={{ color: t.textSub, fontSize: 12, margin: 0 }}>{c.label} · {fmtDate(e.date)} · {e.paymentMethod}</p>
                      {e.notes && <p style={{ color: t.textMuted, fontSize: 12, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📝 {e.notes}</p>}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ color: t.text, fontWeight: 700, fontSize: 15, margin: '0 0 5px' }}>{fmt(e.amount, currSym)}</p>
                      <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                        <button onClick={() => onEdit(e)} style={{ background: 'rgba(59,130,246,0.12)', border: 'none', borderRadius: 7, padding: '5px 7px', cursor: 'pointer', color: '#3b82f6', display: 'flex' }}><Edit2 size={12} /></button>
                        <button onClick={() => setConfirmId(e.id)} style={{ background: 'rgba(239,68,68,0.12)', border: 'none', borderRadius: 7, padding: '5px 7px', cursor: 'pointer', color: '#ef4444', display: 'flex' }}><Trash2 size={12} /></button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Delete confirmation */}
      {confirmId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: t.card, borderRadius: 20, padding: 30, maxWidth: 340, width: '100%', border: `1px solid ${t.border}`, textAlign: 'center', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={24} color="#ef4444" />
            </div>
            <h3 style={{ color: t.text, margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>Delete Expense?</h3>
            <p style={{ color: t.textSub, margin: '0 0 24px', fontSize: 14 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <Button variant="secondary" onClick={() => setConfirmId(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => { deleteExpense(confirmId); setConfirmId(null) }}>
                <Trash2 size={13} /> Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
