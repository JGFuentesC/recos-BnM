import { useState } from 'react'

export default function NewListModal({ onClose, onCreate }) {
  const [name, setName] = useState('')

  function handleCreate() {
    const trimmed = name.trim()
    if (!trimmed) return
    onCreate(trimmed)
    onClose()
  }

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={s.title}>Nueva lista</h3>
        <input
          style={s.input}
          placeholder="Nombre de la lista"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          autoFocus
        />
        <div style={s.actions}>
          <button style={s.cancelBtn} onClick={onClose}>
            Cancelar
          </button>
          <button
            style={{ ...s.createBtn, opacity: name.trim() ? 1 : 0.5 }}
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  )
}

const s = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.72)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: 24,
  },
  modal: {
    background: '#1a1c20',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 18,
    padding: 24,
    width: 'min(100%, 360px)',
    boxShadow: '0 24px 60px rgba(0,0,0,0.65)',
  },
  title: { margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: '#f2efed' },
  input: {
    display: 'block',
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'rgba(255,255,255,0.05)',
    color: '#f2efed',
    fontSize: 15,
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    marginBottom: 16,
    outline: 'none',
  },
  actions: { display: 'flex', gap: 8, justifyContent: 'flex-end' },
  cancelBtn: {
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'transparent',
    color: 'rgba(242,239,237,0.8)',
    padding: '9px 18px',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: 'inherit',
  },
  createBtn: {
    border: 'none',
    background: '#ff571a',
    color: '#310a00',
    fontWeight: 700,
    padding: '9px 18px',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: 'inherit',
  },
}
