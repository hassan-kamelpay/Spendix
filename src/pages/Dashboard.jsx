import { useMemo } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DollarSign, Calendar, Receipt, Tag, ArrowUpRight, Plus } from 'lucide-react'
import { useApp, T } from '../context/AppContext'
import { fmt, fmtShort, monthKey, sumAmounts, getCat } from '../utils'
import StatCard from '../components/StatCard'
import Button from '../components/ui/Button'

function ChartTooltip({ active, payload, t, sym }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: t.card2, border: `1px solid ${t.border}`, borderRadius: 9, padding: '8px 12px' }}>
      <p style={{ color: t.textSub, fontSize: 11, margin: '0 0 3px' }}>{payload[0].payload.day ?? payload[0].payload.month}</p>
      <p style={{ color: t.accent, fontSize: 15, fontWeight: 700, margin: 0 }}>{fmt(payload[0].value, sym)}</p>
    </div>
  )
}

export default function Dashboard({ setPage, setShowAdd }) {
  const { expenses, prefs, currSym } = useApp()
  const t = T(prefs.darkMode)

  const now     = new Date()
  const thisMo  = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const prevMo  = (() => { const d = new Date(now); d.setMonth(d.getMonth() - 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` })()
  const weekAgo = new Date(now - 7 * 864e5).toISOString().slice(0, 10)

  const moExps  = useMemo(() => expenses.filter(e => monthKey(e.date) === thisMo), [expenses, thisMo])
  const prExps  = useMemo(() => expenses.filter(e => monthKey(e.date) === prevMo),  [expenses, prevMo])
  const wkExps  = useMemo(() => expenses.filter(e => e.date >= weekAgo),            [expenses, weekAgo])

  const moTotal = sumAmounts(moExps)
  const prTotal = sumAmounts(prExps)
  const wkTotal = sumAmounts(wkExps)
  const trend   = prTotal > 0 ? ((moTotal - prTotal) / prTotal) * 100 : 0

  const catMap  = useMemo(() => moExps.reduce((a, e) => ({ ...a, [e.category]: (a[e.category] ?? 0) + e.amount }), {}), [moExps])
  const topCat  = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0]
  const topC    = topCat ? getCat(topCat[0]) : null

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weekData = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d  = new Date(now); d.setDate(d.getDate() - (6 - i))
    const ds = d.toISOString().slice(0, 10)
    return { day: DAYS[d.getDay()], amount: parseFloat(expenses.filter(e => e.date === ds).reduce((s, e) => s + e.amount, 0).toFixed(2)) }
  }), [expenses])

  const mo6 = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const d   = new Date(now); d.setMonth(d.getMonth() - 5 + i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    return { month: d.toLocaleDateString('en-US', { month: 'short' }), amount: parseFloat(expenses.filter(e => monthKey(e.date) === key).reduce((s, e) => s + e.amount, 0).toFixed(2)) }
  }), [expenses])

  const recent = useMemo(() => [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6), [expenses])
  const bgt    = prefs.monthlyBudget ?? 0
  const bgtPct = bgt > 0 ? Math.min(100, (moTotal / bgt) * 100) : 0
  const bgtColor = bgtPct >= 100 ? '#ef4444' : bgtPct >= 80 ? '#f97316' : '#22c55e'

  const TT = (props) => <ChartTooltip {...props} t={t} sym={currSym} />

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ color: t.text, fontSize: 28, fontWeight: 800, margin: 0 }}>Dashboard</h1>
          <p style={{ color: t.textSub, margin: '6px 0 0', fontSize: 14 }}>
            {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)}><Plus size={15} />Add Expense</Button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 14, marginBottom: 22 }}>
        <StatCard label="Monthly Spend"   value={fmt(moTotal, currSym)} sub={bgt > 0 ? `Budget: ${fmt(bgt, currSym)}` : `${moExps.length} transactions`} icon={DollarSign} color="#22c55e" trend={trend} />
        <StatCard label="This Week"       value={fmt(wkTotal, currSym)} sub={`${wkExps.length} transactions`} icon={Calendar} color="#3b82f6" />
        <StatCard label="All Expenses"    value={expenses.length} sub="Total records"    icon={Receipt}   color="#8b5cf6" />
        <StatCard label="Top Category"    value={topC ? topC.label.split(' ')[0] : '—'} sub={topCat ? `${fmt(topCat[1], currSym)} this month` : 'No data yet'} icon={Tag} color={topC?.color ?? '#94a3b8'} />
      </div>

      {/* Budget bar */}
      {bgt > 0 && (
        <div style={{ background: t.card, borderRadius: 18, padding: '20px 24px', border: `1px solid ${t.border}`, marginBottom: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
            <div>
              <p style={{ color: t.textSub, fontSize: 11, fontWeight: 700, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Monthly Budget</p>
              <p style={{ color: t.text, fontSize: 17, fontWeight: 700, margin: 0 }}>
                {fmt(moTotal, currSym)}{' '}
                <span style={{ color: t.textSub, fontWeight: 400, fontSize: 14 }}>of {fmt(bgt, currSym)}</span>
              </p>
            </div>
            <p style={{ color: bgtColor, fontSize: 16, fontWeight: 700, margin: 0 }}>{fmt(Math.max(0, bgt - moTotal), currSym)} left</p>
          </div>
          <div style={{ background: t.card2, borderRadius: 99, height: 9, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, width: `${bgtPct.toFixed(1)}%`, background: bgtColor, transition: 'width 0.7s ease' }} />
          </div>
          <p style={{ color: t.textMuted, fontSize: 12, margin: '7px 0 0' }}>{bgtPct.toFixed(0)}% of budget used</p>
        </div>
      )}

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
        <div style={{ background: t.card, borderRadius: 18, padding: '20px 22px', border: `1px solid ${t.border}` }}>
          <p style={{ color: t.text, fontWeight: 700, fontSize: 14, margin: '0 0 18px' }}>This Week</p>
          <ResponsiveContainer width="100%" height={155}>
            <BarChart data={weekData} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
              <XAxis dataKey="day" tick={{ fill: t.textSub, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<TT />} />
              <Bar dataKey="amount" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: t.card, borderRadius: 18, padding: '20px 22px', border: `1px solid ${t.border}` }}>
          <p style={{ color: t.text, fontWeight: 700, fontSize: 14, margin: '0 0 18px' }}>6-Month Trend</p>
          <ResponsiveContainer width="100%" height={155}>
            <AreaChart data={mo6}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#22c55e" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: t.textSub, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<TT />} />
              <Area type="monotone" dataKey="amount" stroke="#22c55e" strokeWidth={2.5} fill="url(#areaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={{ background: t.card, borderRadius: 18, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: t.text, fontWeight: 700, fontSize: 15, margin: 0 }}>Recent Transactions</p>
          <button onClick={() => setPage('expenses')} style={{ background: 'none', border: 'none', color: t.accent, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}>
            View all <ArrowUpRight size={14} />
          </button>
        </div>

        {recent.length === 0 ? (
          <div style={{ padding: '44px 24px', textAlign: 'center', color: t.textMuted }}>
            <Receipt size={34} style={{ marginBottom: 10 }} />
            <p style={{ fontWeight: 600 }}>No expenses yet</p>
            <p style={{ fontSize: 13 }}>Tap the + button to add your first</p>
          </div>
        ) : recent.map(e => {
          const c = getCat(e.category)
          return (
            <div key={e.id}
              onMouseEnter={ev => ev.currentTarget.style.background = t.card2}
              onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
              style={{ padding: '13px 24px', display: 'flex', alignItems: 'center', gap: 14, borderTop: `1px solid ${t.border}`, transition: 'background 0.15s' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{c.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: t.text, fontWeight: 600, fontSize: 14, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.description}</p>
                <p style={{ color: t.textSub, fontSize: 12, margin: 0 }}>{c.label} · {fmtShort(e.date)}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ color: t.text, fontWeight: 700, fontSize: 15, margin: '0 0 2px' }}>{fmt(e.amount, currSym)}</p>
                <p style={{ color: t.textMuted, fontSize: 11, margin: 0 }}>{e.paymentMethod}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
