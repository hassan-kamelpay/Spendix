import { Home, BarChart2, List, Target, Settings } from 'lucide-react'
import { useApp, T } from '../context/AppContext'

const NAV = [
  { id: 'dashboard', label: 'Home',      Icon: Home     },
  { id: 'expenses',  label: 'Expenses',  Icon: List     },
  { id: 'analytics', label: 'Charts',    Icon: BarChart2 },
  { id: 'budget',    label: 'Budget',    Icon: Target   },
  { id: 'settings',  label: 'Settings',  Icon: Settings },
]

export default function BottomNav({ page, setPage }) {
  const { prefs } = useApp()
  const t = T(prefs.darkMode)

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
      background: t.card,
      borderTop: `1px solid ${t.border}`,
      display: 'flex', justifyContent: 'space-around',
      padding: '8px 0 max(14px, env(safe-area-inset-bottom, 14px))',
    }}>
      {NAV.map(({ id, label, Icon }) => {
        const active = page === id
        return (
          <button
            key={id}
            onClick={() => setPage(id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer',
              color: active ? '#22c55e' : t.textMuted,
              fontSize: 9, fontWeight: active ? 700 : 500,
              padding: '4px 10px', transition: 'color 0.15s',
              fontFamily: 'inherit',
            }}
          >
            <Icon size={20} />
            {label}
          </button>
        )
      })}
    </div>
  )
}
