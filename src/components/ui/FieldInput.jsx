import { useApp, T } from '../../context/AppContext'

export default function FieldInput({
  label, type = 'text', value, onChange,
  options, placeholder, required, min, max, step,
  style: sty = {}, rows = 3,
}) {
  const { prefs } = useApp()
  const t = T(prefs.darkMode)

  const base = {
    width: '100%',
    padding: '10px 14px',
    background: t.inputBg,
    border: `1px solid ${t.border}`,
    borderRadius: 10,
    color: t.text,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s',
    ...sty,
  }

  const labelEl = label && (
    <label style={{
      display: 'block', marginBottom: 5,
      fontSize: 12, color: t.textSub,
      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
    }}>
      {label}
      {required && <span style={{ color: '#ef4444' }}> *</span>}
    </label>
  )

  const inputEl = type === 'select' ? (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ ...base, appearance: 'none', cursor: 'pointer' }}>
      {options.map(o => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  ) : type === 'textarea' ? (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{ ...base, resize: 'vertical' }}
    />
  ) : (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      required={required}
      style={base}
    />
  )

  return (
    <div style={{ marginBottom: 14 }}>
      {labelEl}
      {inputEl}
    </div>
  )
}
