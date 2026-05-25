import { useState } from 'react'
import { X, Plus, Edit2 } from 'lucide-react'
import { useApp, T } from '../context/AppContext'
import { CATS, PAYMENT_METHODS } from '../constants'
import Button from './ui/Button'
import FieldInput from './ui/FieldInput'

export default function ExpenseModal({ expense, onClose }) {
  const { addExpense, updateExpense, prefs } = useApp()
  const t = T(prefs.darkMode)
  const editing = !!expense

  const [form, setForm] = useState({
    amount:        expense?.amount        ?? '',
    description:   expense?.description   ?? '',
    category:      expense?.category      ?? 'food',
    date:          expense?.date          ?? new Date().toISOString().slice(0, 10),
    paymentMethod: expense?.paymentMethod ?? 'Credit Card',
    notes:         expense?.notes         ?? '',
  })

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = () => {
    if (!form.amount || !form.description || !form.date) return
    const data = { ...form, amount: parseFloat(form.amount) }
    editing ? updateExpense(expense.id, data) : addExpense(data)
    onClose()
  }

  const catOptions = CATS.map(c => ({ value: c.id, label: `${c.icon}  ${c.label}` }))

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: t.card, borderRadius: 22, width: '100%', maxWidth: 520,
        border: `1px solid ${t.border}`, boxShadow: t.shadow,
        maxHeight: '92vh', overflow: 'auto',
        animation: 'fadeIn 0.2s ease',
      }}>
        {/* Header */}
        <div style={{ padding: '26px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ color: t.text, margin: 0, fontSize: 21, fontWeight: 800 }}>
              {editing ? 'Edit Expense' : 'New Expense'}
            </h2>
            <p style={{ color: t.textSub, margin: '5px 0 0', fontSize: 13 }}>
              {editing ? 'Update the details below' : 'Track a new spending entry'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textSub, padding: 4, display: 'flex', borderRadius: 8 }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '22px 28px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <FieldInput
                label="Description" value={form.description}
                onChange={v => set('description', v)}
                placeholder="What did you spend on?"
                required
              />
            </div>
            <FieldInput
              label="Amount" type="number" value={form.amount}
              onChange={v => set('amount', v)}
              placeholder="0.00" min="0" step="0.01" required
            />
            <FieldInput
              label="Date" type="date" value={form.date}
              onChange={v => set('date', v)} required
            />
            <FieldInput
              label="Category" type="select" value={form.category}
              onChange={v => set('category', v)} options={catOptions}
            />
            <FieldInput
              label="Payment Method" type="select" value={form.paymentMethod}
              onChange={v => set('paymentMethod', v)} options={PAYMENT_METHODS}
            />
            <div style={{ gridColumn: '1 / -1' }}>
              <FieldInput
                label="Notes (optional)" type="textarea" value={form.notes}
                onChange={v => set('notes', v)} placeholder="Any additional details…"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!form.amount || !form.description}>
              {editing ? <><Edit2 size={14} />Update</> : <><Plus size={14} />Add Expense</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
