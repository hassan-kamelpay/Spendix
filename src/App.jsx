import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useApp, T } from './context/AppContext'
import { useIsMobile } from './hooks/useWindowSize'
import Sidebar    from './components/Sidebar'
import BottomNav  from './components/BottomNav'
import Toast      from './components/Toast'
import ExpenseModal from './components/ExpenseModal'
import Dashboard  from './pages/Dashboard'
import ExpensesPage from './pages/Expenses'
import AnalyticsPage from './pages/Analytics'
import BudgetPage from './pages/Budget'
import SettingsPage from './pages/Settings'

function AppShell() {
  const { prefs, toasts } = useApp()
  const t        = T(prefs.darkMode)
  const isMobile = useIsMobile()

  const [page,      setPage]      = useState('dashboard')
  const [showAdd,   setShowAdd]   = useState(false)
  const [editExp,   setEditExp]   = useState(null)
  const [collapsed, setCollapsed] = useState(false)

  // Handle ?action=add shortcut (PWA shortcut)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('action') === 'add') {
      setShowAdd(true)
      window.history.replaceState({}, '', '/')
    }
  }, [])

  const pages = {
    dashboard: <Dashboard  setPage={setPage} setShowAdd={setShowAdd} />,
    expenses:  <ExpensesPage onEdit={e => setEditExp(e)} />,
    analytics: <AnalyticsPage />,
    budget:    <BudgetPage />,
    settings:  <SettingsPage />,
  }

  const fabStyle = {
    position: 'fixed',
    bottom:    isMobile ? 76 : 28,
    right:     isMobile ? 20 : 28,
    zIndex:    300,
    width:     isMobile ? 52 : 56,
    height:    isMobile ? 52 : 56,
    borderRadius: 18,
    background: 'linear-gradient(135deg,#22c55e,#16a34a)',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 8px 28px rgba(34,197,94,0.42)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: t.bg,
      fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif',
    }}>
      {/* Sidebar (desktop only) */}
      {!isMobile && (
        <Sidebar
          page={page} setPage={setPage}
          collapsed={collapsed} setCollapsed={setCollapsed}
        />
      )}

      {/* Main content */}
      <main style={{
        flex: 1,
        padding: isMobile ? '20px 16px 100px' : collapsed ? '28px 32px' : '28px 36px',
        minWidth: 0,
        overflow: 'auto',
        maxHeight: '100vh',
      }}>
        {pages[page] ?? pages.dashboard}
      </main>

      {/* Bottom nav (mobile only) */}
      {isMobile && <BottomNav page={page} setPage={setPage} />}

      {/* Floating action button */}
      <button
        onClick={() => setShowAdd(true)}
        style={fabStyle}
        aria-label="Add expense"
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.09)'
          e.currentTarget.style.boxShadow = '0 12px 36px rgba(34,197,94,0.55)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 8px 28px rgba(34,197,94,0.42)'
        }}
      >
        <Plus size={isMobile ? 24 : 26} color="#fff" />
      </button>

      {/* Modals */}
      {showAdd && <ExpenseModal onClose={() => setShowAdd(false)} />}
      {editExp  && <ExpenseModal expense={editExp} onClose={() => setEditExp(null)} />}

      {/* Toast notifications */}
      <Toast toasts={toasts} />
    </div>
  )
}

// AppProvider is applied in main.jsx so AppShell can use useApp()
export default AppShell
