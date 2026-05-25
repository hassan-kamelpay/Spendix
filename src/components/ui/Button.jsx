import { useApp, T } from '../../context/AppContext'

const VARIANTS = {
  primary:   { background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff',    border: 'none' },
  secondary: { background: 'transparent', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.25)' },
  danger:    { background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.22)' },
  ghost:     { background: 'transparent', color: '#94a3b8', border: 'none' },
  info:      { background: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.22)' },
}

const SIZES = {
  xs: { padding: '4px 10px',  fontSize: 11 },
  sm: { padding: '6px 14px',  fontSize: 12 },
  md: { padding: '10px 20px', fontSize: 14 },
  lg: { padding: '13px 28px', fontSize: 15 },
}

export default function Button({
  children, onClick, variant = 'primary', size = 'md',
  style = {}, disabled = false, type = 'button', title,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        ...VARIANTS[variant],
        ...SIZES[size],
        borderRadius: 10,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        transition: 'opacity 0.2s, transform 0.15s',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'inherit',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </button>
  )
}
