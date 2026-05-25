import { useState, useMemo } from 'react'
import { Edit2, CheckCircle, AlertCircle } from 'lucide-react'
import { useApp, T } from '../context/AppContext'
import { CATS } from '../constants'
import { fmt, monthKey, sumAmounts } from '../utils'
import StatCard from '../components/StatCard'
import Button from '../components/ui/Button'
import { DollarSign, Wallet, TrendingDown } from 'lucide-react'

export default function BudgetPage() {
  const { expenses, budgets, setBudgets, prefs, currSym } = useApp()
  const t = T(prefs.darkMode)

  const now     = new Date()
  const thisMo  = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const moExps  = useMemo(() => expenses.filter(e => monthKey(e.date) === thisMo), [expenses, thisMo])
  const catMap  = useMemo(() => moExps.reduce((a, e) => ({ ...a, [e.category]: (a[e.category] ?? 0) + e.amount }), {}), [moExps])

  const [editing, setEditing] = useState(false)
  const [tmp, setTmp]         = useState({ ...budgets })

  const totalBgt  = Object.values(budgets).reduce((s, v) => s + (v ?? 0), 0)
  const totalSpnt = sumAmounts(moExps)
  const overCats  = CATS.filter(c => (catMap[c.id] ?? 0) > (budgets[c.id] ?? 0) && (budgets[c.id] ?? 0) > 0).length

  const handleSave = () => { setBudgets(tmp); setEditing(false) }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ color: t.text, fontSize: 28, fontWeight: 800, margin: '0 0 6px' }}>Budget Tracking</h1>
          <p style={{ color: t.textSub, margin: 0, fontSize: 14 }}>
            {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        {editing ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}><CheckCircle size={14} />Save</Button>
          </div>
        ) : (
          <Button size="sm" onClick={() => { setTmp({ ...budgets }); setEditing(true) }}>
            <Edit2 size={14} />Edit Budgets
          </Button>
        )}
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 14, marginBottom: 26 }}>
        <StatCard label="Total Budget"  value={fmt(totalBgt, currSym)} icon={Wallet} color="#22c55e" />
        <StatCard label="Total Spent"   value={fmt(totalSpnt, currSym)} sub={`${totalBgt > 0 ? ((totalSpnt / totalBgt) * 100).toFixed(0) : 0}% of budget`} icon={DollarSign} color="#3b82f6" />
        <StatCard label="Remaining"     value={fmt(Math.max(0, totalBgt - totalSpnt), currSym)} icon={TrendingDown} color={totalSpnt > totalBgt ? '#ef4444' : '#22c55e'} />
        <StatCard label="Over Budget"   value={overCats} sub="categories" icon={AlertCircle} color={overCats > 0 ? '#ef4444' : '#22c55e'} />
      </div>

      {/* Category cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: 13 }}>
        {CATS.map(c => {
          const spent  = catMap[c.id] ?? 0
          const budget = editing ? (tmp[c.id] ?? 0) : (budgets[c.id] ?? 0)
          const pct    = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0
          const over   = spent > budget && budget > 0
          const barC   = over ? '#ef4444' : pct > 80 ? '#f97316' : c.color

          return (
            <div key={c.id} style={{
              background: t.card, borderRadius: 18, padding: '18px 20px',
              border: `1px solid ${over ? 'rgba(239,68,68,0.3)' : t.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: budget > 0 || editing ? 13 : 0 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{c.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: t.text, fontWeight: 600, fontSize: 14, margin: 0 }}>{c.label}</p>
                  <p style={{ color: t.textSub, fontSize: 12, margin: 0 }}>
                    {fmt(spent, currSym)}{budget > 0 ? ` / ${fmt(budget, currSym)}` : ' · no limit set'}
                  </p>
                </div>
                {over && <span style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase' }}>Over</span>}
              </div>

              {budget > 0 && !editing && (
                <div>
                  <div style={{ background: t.card2, borderRadius: 99, height: 6, marginBottom: 6 }}>
                    <div style={{ height: '100%', borderRadius: 99, width: `${pct.toFixed(1)}%`, background: barC, transition: 'width 0.5s ease' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: t.textMuted, fontSize: 11 }}>{pct.toFixed(0)}% used</span>
                    <span style={{ color: over ? '#ef4444' : t.textMuted, fontSize: 11, fontWeight: over ? 700 : 400 }}>
                      {over ? `${fmt(spent - budget, currSym)} over` : `${fmt(budget - spent, currSym)} left`}
                    </span>
                  </div>
                </div>
              )}

              {editing && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 10 }}>
                  <span style={{ color: t.textSub, fontSize: 13 }}>{currSym}</span>
                  <input
                    type="number" min="0" step="10"
                    value={tmp[c.id] ?? ''}
                    onChange={e => setTmp(p => ({ ...p, [c.id]: parseFloat(e.target.value) || 0 }))}
                    placeholder="Set budget…"
                    style={{ flex: 1, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 8, padding: '7px 10px', color: t.text, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
