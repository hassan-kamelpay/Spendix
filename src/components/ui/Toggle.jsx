export default function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      role="switch"
      aria-checked={value}
      style={{
        width: 44, height: 24, borderRadius: 12,
        border: 'none', cursor: 'pointer', padding: 0,
        background: value ? '#22c55e' : 'rgba(100,116,139,0.3)',
        position: 'relative', transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff', position: 'absolute',
        top: 3, left: value ? 23 : 3,
        transition: 'left 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </button>
  )
}
