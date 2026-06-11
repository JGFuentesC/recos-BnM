import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export default function CollectionItem({ item, onDelete, onMoveList }) {
  const [note, setNote] = useState(item.personalNote ?? '')
  const [menuOpen, setMenuOpen] = useState(false)

  const typeLabel = item.contentType === 'movie' ? '🎬 Película' : '📚 Libro'
  const savedDate = new Date(item.savedAt).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  function handleNoteBlur() {
    if (note === item.personalNote) return
    fetch(`${API_BASE}/api/collections/${item.collectionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personalNote: note, listName: item.listName }),
    }).catch(() => {})
  }

  function handleDelete() {
    setMenuOpen(false)
    if (window.confirm(`¿Eliminar "${item.title}" de tu biblioteca?`)) {
      onDelete(item.collectionId)
    }
  }

  function handleMove() {
    setMenuOpen(false)
    onMoveList(item)
  }

  return (
    <div style={s.card}>
      <img src={item.cover} alt={item.title} style={s.cover} loading="lazy" />

      <div style={s.body}>
        <div style={s.meta}>
          <span style={s.badge}>{typeLabel}</span>
          <span style={s.date}>{savedDate}</span>
        </div>

        <p style={s.title}>{item.title}</p>

        <div style={s.chips}>
          {item.genres.map((g) => (
            <span key={g} style={s.chip}>{g}</span>
          ))}
          <span style={s.listChip}>{item.listName}</span>
        </div>

        <textarea
          style={s.note}
          value={note}
          placeholder="Añade una nota personal…"
          onChange={(e) => setNote(e.target.value)}
          onBlur={handleNoteBlur}
          rows={2}
        />
      </div>

      <div style={s.menuWrap}>
        {menuOpen && (
          <div style={s.menuOverlay} onClick={() => setMenuOpen(false)} />
        )}
        <button
          style={s.dotsBtn}
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen((o) => !o)
          }}
          aria-label="Opciones"
        >
          ⋯
        </button>
        {menuOpen && (
          <div style={s.dropdown}>
            <button style={s.dropItem} onClick={handleMove}>
              Mover a lista
            </button>
            <button style={{ ...s.dropItem, ...s.dropDelete }} onClick={handleDelete}>
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  card: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '14px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    position: 'relative',
  },
  cover: {
    width: 60,
    height: 90,
    objectFit: 'cover',
    borderRadius: 8,
    flexShrink: 0,
    background: 'rgba(255,255,255,0.06)',
  },
  body: { flex: 1, minWidth: 0 },
  meta: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 },
  badge: {
    fontSize: 11,
    fontWeight: 600,
    color: '#ff571a',
    background: 'rgba(255,87,26,0.14)',
    borderRadius: 999,
    padding: '2px 8px',
    flexShrink: 0,
  },
  date: {
    fontSize: 11,
    color: 'rgba(242,239,237,0.45)',
    marginLeft: 'auto',
    flexShrink: 0,
  },
  title: {
    margin: '0 0 6px',
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 1.25,
    color: '#f2efed',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  chips: { display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 },
  chip: {
    fontSize: 11,
    padding: '2px 8px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.16)',
    color: 'rgba(242,239,237,0.7)',
  },
  listChip: {
    fontSize: 11,
    padding: '2px 8px',
    borderRadius: 999,
    border: '1px solid rgba(119,1,208,0.5)',
    color: '#c39fff',
    background: 'rgba(119,1,208,0.1)',
  },
  note: {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: 'rgba(242,239,237,0.9)',
    fontSize: 12,
    padding: '6px 8px',
    resize: 'none',
    fontFamily: 'inherit',
    lineHeight: 1.4,
    boxSizing: 'border-box',
    outline: 'none',
  },
  menuWrap: { position: 'relative', flexShrink: 0 },
  menuOverlay: { position: 'fixed', inset: 0, zIndex: 19 },
  dotsBtn: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(242,239,237,0.55)',
    fontSize: 22,
    cursor: 'pointer',
    padding: '2px 4px',
    lineHeight: 1,
    letterSpacing: 2,
    WebkitTapHighlightColor: 'transparent',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '100%',
    background: '#1c1e22',
    border: '1px solid rgba(255,255,255,0.13)',
    borderRadius: 12,
    minWidth: 164,
    zIndex: 20,
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.55)',
  },
  dropItem: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '12px 16px',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    color: '#f2efed',
    fontSize: 14,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  dropDelete: {
    color: '#ff6b6b',
    borderBottom: 'none',
  },
}
