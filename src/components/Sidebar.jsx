import { Home, BarChart2, List, Target, Settings, Menu } from 'lucide-react'
import { useApp, T } from '../context/AppContext'

const ICONS = { dashboard: Home, expenses: List, analytics: BarChart2, budget: Target, settings: Settings }
const NAV   = ['dashboard', 'expenses', 'analytics', 'budget', 'settings']
const LABELS = { dashboard: 'Dashboard', expenses: 'Expenses', analytics: 'Analytics', budget: 'Budget', settings: 'Settings' }

export default function Sidebar({ page, setPage, collapsed, setCollapsed }) {
  const { prefs } = useApp()
  const t = T(prefs.darkMode)

  return (
    <aside style={{
      width: collapsed ? 66 : 218,
      minHeight: '100vh',
      background: t.sidebar,
      borderRight: '1px solid rgba(255,255,255,0.055)',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.25s ease',
      flexShrink: 0,
      position: 'sticky', top: 0, height: '100vh',
      zIndex: 100, overflowX: 'hidden',
    }}>
      {/* Logo row */}
      <div style={{
        padding: collapsed ? '18px 0' : '18px 16px',
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        marginBottom: 10, gap: 10,
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 33, height: 33, borderRadius: 11,
              background: 'linear-gradient(135deg,#22c55e,#16a34a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>💰</div>
            <div>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: 15, margin: 0, lineHeight: 1.1 }}>Spendix</p>
              <p style={{ color: '#334155', fontSize: 10, margin: 0, fontWeight: 600 }}>Expense Tracker</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{
            width: 33, height: 33, borderRadius: 11,
            background: 'linear-gradient(135deg,#22c55e,#16a34a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>💰</div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#475569', padding: 4, display: 'flex', borderRadius: 6,
            marginLeft: collapsed ? 0 : 'auto',
          }}
        >
          <Menu size={17} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 8px' }}>
        {NAV.map(id => {
          const active = page === id
          const Icon   = ICONS[id]
          return (
            <button
              key={id}
              onClick={() => setPage(id)}
              title={collapsed ? LABELS[id] : undefined}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: 11, padding: collapsed ? '11px 0' : '11px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 12, border: 'none', cursor: 'pointer',
                marginBottom: 3,
                background: active ? 'rgba(34,197,94,0.11)' : 'transparent',
                color: active ? '#22c55e' : '#64748b',
                fontWeight: active ? 700 : 500, fontSize: 14,
                transition: 'all 0.15s', fontFamily: 'inherit',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon size={18} />
              {!collapsed && <span style={{ flex: 1, textAlign: 'left' }}>{LABELS[id]}</span>}
              {!collapsed && active && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />}
            </button>
          )
        })}
      </nav>

      {/* PWA hint */}
      {!collapsed && (
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ background: 'rgba(34,197,94,0.07)', borderRadius: 11, padding: '11px 13px' }}>
            <p style={{ color: '#22c55e', fontSize: 10, fontWeight: 800, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              PWA Ready
            </p>
            <p style={{ color: '#334155', fontSize: 11, margin: 0, lineHeight: 1.4 }}>
              Install for offline access on any device
            </p>
          </div>
        </div>
      )}
    </aside>
  )
}
