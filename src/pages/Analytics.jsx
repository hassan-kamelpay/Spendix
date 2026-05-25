import { useMemo, useState } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp, T } from '../context/AppContext'
import { fmt, monthKey, monthShort, sumAmounts, getCat, cutoffFromRange } from '../utils'
import { CATS } from '../constants'

const PAYMENT_COLORS = ['#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#eab308']

export default function AnalyticsPage() {
  const { expenses, prefs, currSym } = useApp()
  const t = T(prefs.darkMode)
  const [range, setRange] = useState('3m')

  const cutoff  = useMemo(() => cutoffFromRange(range), [range])
  const data    = useMemo(() => expenses.filter(e => e.date >= cutoff), [expenses, cutoff])
  const total   = sumAmounts(data)

  const catData = useMemo(() => {
    const m = data.reduce((a, e) => ({ ...a, [e.category]: (a[e.category] ?? 0) + e.amount }), {})
    return Object.entries(m)
      .map(([id, value]) => ({ id, name: getCat(id).label, value: parseFloat(value.toFixed(2)), color: getCat(id).color }))
      .sort((a, b) => b.value - a.value)
  }, [data])

  const monthData = useMemo(() => {
    const now = new Date()
    const n   = range === '1m' ? 1 : range === '3m' ? 3 : range === '6m' ? 6 : 12
    return Array.from({ length: n }, (_, i) => {
      const d   = new Date(now); d.setMonth(d.getMonth() - n + 1 + i)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      return { month: monthShort(key), amount: parseFloat(expenses.filter(e => monthKey(e.date) === key).reduce((s, e) => s + e.amount, 0).toFixed(2)) }
    })
  }, [expenses, range])

  const methodMap = useMemo(() => data.reduce((a, e) => ({ ...a, [e.paymentMethod]: (a[e.paymentMethod] ?? 0) + e.amount }), {}), [data])

  const TT = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background: t.card2, border: `1px solid ${t.border}`, borderRadius: 9, padding: '9px 13px' }}>
        <p style={{ color: t.textSub, fontSize: 11, margin: '0 0 3px' }}>{label}</p>
        <p style={{ color: t.accent, fontSize: 15, fontWeight: 700, margin: 0 }}>{fmt(payload[0].value, currSym)}</p>
      </div>
    )
  }

  const PTT = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background: t.card2, border: `1px solid ${t.border}`, borderRadius: 9, padding: '9px 13px' }}>
        <p style={{ color: t.text, fontSize: 13, fontWeight: 700, margin: '0 0 3px' }}>{payload[0].name}</p>
        <p style={{ color: t.accent, fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>{fmt(payload[0].value, currSym)}</p>
        <p style={{ color: t.textSub, fontSize: 11, margin: 0 }}>{total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0}% of total</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ color: t.text, fontSize: 28, fontWeight: 800, margin: '0 0 6px' }}>Analytics</h1>
          <p style={{ color: t.textSub, margin: 0, fontSize: 14 }}>
            Total: <strong style={{ color: t.text }}>{fmt(total, currSym)}</strong> · {data.length} transactions
          </p>
        </div>
        <div style={{ display: 'flex', gap: 4, background: t.card, borderRadius: 13, padding: 4, border: `1px solid ${t.border}` }}>
          {['1m', '3m', '6m', '1y'].map(r => (
            <button key={r} onClick={() => setRange(r)} style={{
              padding: '6px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
              background: range === r ? '#22c55e' : 'transparent',
              color: range === r ? '#fff' : t.textSub,
              transition: 'all 0.2s',
            }}>{r}</button>
          ))}
        </div>
      </div>

      {/* Pie + Category bars */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 4fr', gap: 14, marginBottom: 16 }}>
        <div style={{ background: t.card, borderRadius: 18, padding: '20px 24px', border: `1px solid ${t.border}` }}>
          <p style={{ color: t.text, fontWeight: 700, fontSize: 14, margin: '0 0 16px' }}>Spending by Category</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={catData} cx="50%" cy="50%" innerRadius={58} outerRadius={95} paddingAngle={2} dataKey="value">
                {catData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<PTT />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: t.card, borderRadius: 18, padding: '20px 24px', border: `1px solid ${t.border}` }}>
          <p style={{ color: t.text, fontWeight: 700, fontSize: 14, margin: '0 0 16px' }}>Category Breakdown</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {catData.slice(0, 6).map(c => {
              const pct = total > 0 ? (c.value / total) * 100 : 0
              return (
                <div key={c.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ color: t.textSub, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, display: 'inline-block', flexShrink: 0 }} />
                      {getCat(c.id).icon} {c.name}
                    </span>
                    <span style={{ color: t.text, fontSize: 12, fontWeight: 700 }}>{fmt(c.value, currSym)}</span>
                  </div>
                  <div style={{ background: t.card2, borderRadius: 99, height: 5 }}>
                    <div style={{ height: '100%', borderRadius: 99, width: `${pct.toFixed(1)}%`, background: c.color, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Monthly bar */}
      <div style={{ background: t.card, borderRadius: 18, padding: '20px 24px', border: `1px solid ${t.border}`, marginBottom: 16 }}>
        <p style={{ color: t.text, fontWeight: 700, fontSize: 14, margin: '0 0 18px' }}>Monthly Spending</p>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={monthData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: t.textSub, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: t.textSub, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${currSym}${v}`} />
            <Tooltip content={<TT />} />
            <Bar dataKey="amount" fill="#22c55e" radius={[7, 7, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payment methods */}
      <div style={{ background: t.card, borderRadius: 18, padding: '20px 24px', border: `1px solid ${t.border}` }}>
        <p style={{ color: t.text, fontWeight: 700, fontSize: 14, margin: '0 0 16px' }}>Payment Methods</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10 }}>
          {Object.entries(methodMap).sort((a, b) => b[1] - a[1]).map(([m, v], i) => (
            <div key={m} style={{ background: t.card2, borderRadius: 13, padding: '14px 16px' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: PAYMENT_COLORS[i % PAYMENT_COLORS.length], marginBottom: 8 }} />
              <p style={{ color: t.textSub, fontSize: 10, fontWeight: 700, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m}</p>
              <p style={{ color: t.text, fontSize: 16, fontWeight: 800, margin: 0 }}>{fmt(v, currSym)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
