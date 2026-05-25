import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

const CONFIG = {
  success: { bg: '#14532d', Icon: CheckCircle  },
  error:   { bg: '#7f1d1d', Icon: AlertCircle  },
  warning: { bg: '#78350f', Icon: AlertTriangle },
  info:    { bg: '#1e3a5f', Icon: Info          },
}

export default function Toast({ toasts }) {
  if (!toasts.length) return null

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 8,
      pointerEvents: 'none',
    }}>
      {toasts.map(t => {
        const { bg, Icon } = CONFIG[t.type] ?? CONFIG.success
        return (
          <div key={t.id} style={{
            background: bg,
            color: '#fff',
            borderRadius: 12,
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 14,
            fontWeight: 500,
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            animation: 'fadeSlide 0.3s ease',
            minWidth: 220,
            maxWidth: 360,
          }}>
            <Icon size={16} style={{ flexShrink: 0 }} />
            {t.msg}
          </div>
        )
      })}
    </div>
  )
}
