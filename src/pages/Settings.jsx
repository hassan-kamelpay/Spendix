import { Download, Link, Unlink } from 'lucide-react'
import { useApp, T } from '../context/AppContext'
import { CURRENCIES } from '../constants'
import { exportCSV } from '../utils'
import Toggle from '../components/ui/Toggle'
import Button from '../components/ui/Button'

export default function SettingsPage() {
  const { expenses, prefs, setPrefs, currSym, googleConnected, connectGoogle, disconnectGoogle } = useApp()
  const t = T(prefs.darkMode)

  const set = (key, val) => setPrefs(p => ({ ...p, [key]: val }))

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 22 }}>
      <p style={{ color: t.textSub, fontSize: 11, fontWeight: 700, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</p>
      <div style={{ background: t.card, borderRadius: 18, border: `1px solid ${t.border}`, overflow: 'hidden' }}>{children}</div>
    </div>
  )

  const Row = ({ label, sub, children, last = false }) => (
    <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: last ? 'none' : `1px solid ${t.border}` }}>
      <div>
        <p style={{ color: t.text, fontSize: 14, fontWeight: 600, margin: 0 }}>{label}</p>
        {sub && <p style={{ color: t.textSub, fontSize: 12, margin: '2px 0 0' }}>{sub}</p>}
      </div>
      {children}
    </div>
  )

  const selStyle = {
    background: t.inputBg, border: `1px solid ${t.border}`,
    borderRadius: 9, color: t.text, padding: '7px 12px',
    fontSize: 13, outline: 'none', fontFamily: 'inherit',
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ color: t.text, fontSize: 28, fontWeight: 800, margin: '0 0 28px' }}>Settings</h1>

      <Section title="Appearance">
        <Row label="Dark Mode" sub="Use the dark fintech theme" last>
          <Toggle value={prefs.darkMode} onChange={v => set('darkMode', v)} />
        </Row>
      </Section>

      <Section title="Currency & Budget">
        <Row label="Display Currency">
          <select value={prefs.currency} onChange={e => set('currency', e.target.value)} style={selStyle}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name} ({c.sym})</option>)}
          </select>
        </Row>
        <Row label="Monthly Budget" sub="Your total spending target" last>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ color: t.textSub, fontSize: 14 }}>{currSym}</span>
            <input
              type="number" value={prefs.monthlyBudget}
              onChange={e => { const v = parseFloat(e.target.value); set('monthlyBudget', isNaN(v) ? 0 : v) }}
              style={{ ...selStyle, width: 100 }}
            />
          </div>
        </Row>
      </Section>

      <Section title="Data Management">
        <Row label="Export to CSV" sub="Download all expenses as a spreadsheet">
          <Button size="sm" onClick={() => exportCSV(expenses, currSym)}><Download size={13} />Export</Button>
        </Row>
        <Row label="Total Records" sub="Stored locally" last>
          <span style={{ color: t.textSub, fontSize: 14, fontWeight: 600 }}>{expenses.length} expenses</span>
        </Row>
      </Section>

      <Section title="Google Sheets Sync">
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Step 1 — Connect */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: googleConnected ? t.accent : t.textMuted, color: '#fff', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>1</span>
              <p style={{ color: t.text, fontSize: 14, fontWeight: 600, margin: 0 }}>Connect your Google Account</p>
            </div>
            <button
              onClick={googleConnected ? disconnectGoogle : connectGoogle}
              style={{
                padding: '12px 0', borderRadius: 12, border: `1px solid ${googleConnected ? t.red + '50' : t.accent + '50'}`,
                cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'inherit',
                background: googleConnected ? t.redDim : t.accentDim,
                color:      googleConnected ? t.red    : t.accentText,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {googleConnected
                ? <><Unlink size={15} /> Disconnect</>
                : <><Link size={15} /> Connect Google Account</>}
            </button>
            {googleConnected && (
              <p style={{ color: t.accentText, fontSize: 12, margin: 0, textAlign: 'center' }}>✓ Google account connected</p>
            )}
          </div>

          <div style={{ height: 1, background: t.border }} />

          {/* Step 2 — Spreadsheet ID */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: prefs.spreadsheetId ? t.accent : t.textMuted, color: '#fff', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>2</span>
              <p style={{ color: t.text, fontSize: 14, fontWeight: 600, margin: 0 }}>Paste your Spreadsheet ID</p>
            </div>
            <input
              type="text"
              value={prefs.spreadsheetId ?? ''}
              onChange={e => set('spreadsheetId', e.target.value)}
              placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
              style={{ ...selStyle, width: '100%', boxSizing: 'border-box' }}
            />
            <p style={{ color: t.textMuted, fontSize: 11, margin: 0 }}>
              From your Sheet URL: docs.google.com/spreadsheets/d/<strong style={{ color: t.accentText }}>THIS-PART</strong>/edit
            </p>
          </div>

          <div style={{ height: 1, background: t.border }} />

          {/* Step 3 — Enable sync */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: prefs.useSheets ? t.accent : t.textMuted, color: '#fff', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>3</span>
              <div>
                <p style={{ color: t.text, fontSize: 14, fontWeight: 600, margin: 0 }}>Enable Sync</p>
                <p style={{ color: t.textMuted, fontSize: 11, margin: 0 }}>Turn on after steps 1 & 2</p>
              </div>
            </div>
            <Toggle
              value={prefs.useSheets ?? false}
              onChange={v => set('useSheets', v)}
            />
          </div>

        </div>
      </Section>

      <Section title="PWA Installation">
        <div style={{ padding: '18px 20px' }}>
          <p style={{ color: t.textSub, fontSize: 13, margin: '0 0 14px', lineHeight: 1.7 }}>
            Spendix is fully PWA-ready. After deploying to Vercel, users can install it from their browser.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              'Offline access via Service Worker',
              'Installable on mobile & desktop',
              'Background sync for expenses',
              'App manifest & splash screen',
              'Fast asset caching (Workbox)',
              'Add-to-home-screen support',
            ].map(f => (
              <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: t.accent, fontSize: 14, marginTop: 1 }}>✓</span>
                <p style={{ color: t.textSub, fontSize: 12, margin: 0 }}>{f}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="About">
        <Row label="Version" last>
          <span style={{ color: t.textSub, fontSize: 13 }}>1.0.0</span>
        </Row>
      </Section>
    </div>
  )
}
