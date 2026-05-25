import { useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useApp, T } from '../context/AppContext'

export default function StatCard({ label, value, sub, icon: Icon, color, trend, onClick }) {
  const { prefs } = useApp()
  const t = T(prefs.darkMode)
  const [hov, setHov] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: t.card, borderRadius: 18,
        padding: '20px 22px',
        border: `1px solid ${t.border}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: hov && onClick ? 'translateY(-3px)' : 'none',
        boxShadow: hov && onClick ? t.shadow : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 13,
          background: `${color}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} color={color} />
        </div>
        {trend !== undefined && (
          <span style={{
            fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 3,
            color: trend >= 0 ? '#22c55e' : '#ef4444',
            background: trend >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            padding: '3px 9px', borderRadius: 7,
          }}>
            {trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>

      <p style={{
        color: t.textSub, fontSize: 11, fontWeight: 700,
        margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        {label}
      </p>
      <p style={{ color: t.text, fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>{value}</p>
      {sub && <p style={{ color: t.textMuted, fontSize: 12, margin: 0 }}>{sub}</p>}
    </div>
  )
}
