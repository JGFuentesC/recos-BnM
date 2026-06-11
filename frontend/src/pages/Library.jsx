import { useState } from 'react'
import CollectionItem from '../components/CollectionItem'
import BottomNav from '../components/BottomNav'
import NewListModal from '../components/NewListModal'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

const MOCK_ITEMS = [
  {
    collectionId: '1',
    contentId: 'tt1375666',
    contentType: 'movie',
    listName: 'Guardados',
    personalNote: '',
    savedAt: '2026-06-03T10:00:00Z',
    title: 'Inception',
    cover: 'https://via.placeholder.com/100x150',
    genres: ['Acción'],
  },
  {
    collectionId: '2',
    contentId: 'tt0468569',
    contentType: 'movie',
    listName: 'Para el finde',
    personalNote: 'La quiero ver el sábado',
    savedAt: '2026-06-02T15:00:00Z',
    title: 'The Dark Knight',
    cover: 'https://via.placeholder.com/100x150',
    genres: ['Drama'],
  },
  {
    collectionId: '3',
    contentId: 'book123',
    contentType: 'book',
    listName: 'Guardados',
    personalNote: '',
    savedAt: '2026-06-01T09:00:00Z',
    title: 'Sapiens',
    cover: 'https://via.placeholder.com/100x150',
    genres: ['Historia'],
  },
  {
    collectionId: '4',
    contentId: 'book456',
    contentType: 'book',
    listName: 'Guardados',
    personalNote: 'Muy recomendado por Andrés',
    savedAt: '2026-05-30T20:00:00Z',
    title: 'El Hobbit',
    cover: 'https://via.placeholder.com/100x150',
    genres: ['Fantasía'],
  },
]

const TYPE_TABS = [
  { k: 'all', l: 'Todos' },
  { k: 'movie', l: 'Películas' },
  { k: 'book', l: 'Libros' },
]

export default function Library() {
  const [items, setItems] = useState(MOCK_ITEMS)
  const [customLists, setCustomLists] = useState([])
  const [typeFilter, setTypeFilter] = useState('all')
  const [listFilter, setListFilter] = useState('all')
  const [newListOpen, setNewListOpen] = useState(false)
  const [moveTarget, setMoveTarget] = useState(null)

  const uniqueLists = [...new Set([...items.map((i) => i.listName), ...customLists])]

  const filtered = items.filter((i) => {
    if (typeFilter !== 'all' && i.contentType !== typeFilter) return false
    if (listFilter !== 'all' && i.listName !== listFilter) return false
    return true
  })

  function handleDelete(collectionId) {
    setItems((prev) => prev.filter((i) => i.collectionId !== collectionId))
    fetch(`${API_BASE}/api/collections/${collectionId}`, { method: 'DELETE' }).catch(() => {})
  }

  function handleMoveList(item) {
    setMoveTarget(item)
  }

  function handleMoveTo(listName) {
    setItems((prev) =>
      prev.map((i) =>
        i.collectionId === moveTarget.collectionId ? { ...i, listName } : i
      )
    )
    fetch(`${API_BASE}/api/collections/${moveTarget.collectionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listName, personalNote: moveTarget.personalNote }),
    }).catch(() => {})
    setMoveTarget(null)
  }

  function handleCreateList(name) {
    setCustomLists((prev) => (prev.includes(name) ? prev : [...prev, name]))
  }

  return (
    <div style={s.page}>
      <header style={s.header}>
        <h1 style={s.heading}>Mi Biblioteca</h1>
        <button style={s.newListBtn} onClick={() => setNewListOpen(true)}>
          + Nueva lista
        </button>
      </header>

      <div style={s.filterRow}>
        {TYPE_TABS.map(({ k, l }) => (
          <button
            key={k}
            style={{ ...s.pill, ...(typeFilter === k ? s.pillActive : {}) }}
            onClick={() => setTypeFilter(k)}
          >
            {l}
          </button>
        ))}
      </div>

      <div style={{ ...s.filterRow, paddingTop: 0 }}>
        <button
          style={{ ...s.pill, ...(listFilter === 'all' ? s.pillActive : {}) }}
          onClick={() => setListFilter('all')}
        >
          Todas
        </button>
        {uniqueLists.map((list) => (
          <button
            key={list}
            style={{ ...s.pill, ...(listFilter === list ? s.pillActive : {}) }}
            onClick={() => setListFilter(list)}
          >
            {list}
          </button>
        ))}
      </div>

      <div style={s.list}>
        {filtered.length === 0 ? (
          <div style={s.empty}>
            <span style={s.emptyIcon}>📭</span>
            <p style={s.emptyTitle}>Nada por aquí</p>
            <p style={s.emptyText}>Guarda películas y libros desde Descubrir</p>
          </div>
        ) : (
          filtered.map((item) => (
            <CollectionItem
              key={item.collectionId}
              item={item}
              onDelete={handleDelete}
              onMoveList={handleMoveList}
            />
          ))
        )}
      </div>

      <BottomNav />

      {newListOpen && (
        <NewListModal
          onClose={() => setNewListOpen(false)}
          onCreate={handleCreateList}
        />
      )}

      {moveTarget && (
        <MoveToListModal
          currentList={moveTarget.listName}
          lists={uniqueLists}
          onSelect={handleMoveTo}
          onClose={() => setMoveTarget(null)}
        />
      )}
    </div>
  )
}

function MoveToListModal({ currentList, lists, onSelect, onClose }) {
  const [newName, setNewName] = useState('')
  const available = lists.filter((l) => l !== currentList)

  return (
    <div style={m.overlay} onClick={onClose}>
      <div style={m.sheet} onClick={(e) => e.stopPropagation()}>
        <p style={m.title}>Mover a lista</p>

        {available.length === 0 && (
          <p style={m.hint}>No hay otras listas. Crea una abajo.</p>
        )}

        {available.map((l) => (
          <button key={l} style={m.listItem} onClick={() => onSelect(l)}>
            {l}
          </button>
        ))}

        <div style={m.divider} />
        <p style={m.subLabel}>Nueva lista</p>
        <div style={m.inputRow}>
          <input
            style={m.input}
            placeholder="Nombre…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && newName.trim() && onSelect(newName.trim())
            }
          />
          <button
            style={{ ...m.createBtn, opacity: newName.trim() ? 1 : 0.45 }}
            onClick={() => newName.trim() && onSelect(newName.trim())}
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100dvh',
    background: '#0e0f10',
    paddingBottom: 80,
    color: '#f2efed',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 16px 12px',
    position: 'sticky',
    top: 0,
    background: 'rgba(14,15,16,0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    zIndex: 10,
  },
  heading: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: '#f2efed',
  },
  newListBtn: {
    border: '1px solid rgba(255,87,26,0.5)',
    background: 'rgba(255,87,26,0.1)',
    color: '#ff571a',
    fontWeight: 700,
    fontSize: 13,
    padding: '7px 14px',
    borderRadius: 999,
    cursor: 'pointer',
    fontFamily: 'inherit',
    WebkitTapHighlightColor: 'transparent',
  },
  filterRow: {
    display: 'flex',
    gap: 8,
    padding: '12px 16px',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    WebkitOverflowScrolling: 'touch',
  },
  pill: {
    flexShrink: 0,
    padding: '6px 14px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(242,239,237,0.7)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 150ms ease',
    WebkitTapHighlightColor: 'transparent',
  },
  pillActive: {
    background: '#ff571a',
    border: '1px solid #ff571a',
    color: '#310a00',
  },
  list: { paddingTop: 4 },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 64,
    gap: 8,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { margin: 0, fontSize: 18, fontWeight: 700, color: '#f2efed' },
  emptyText: {
    margin: 0,
    fontSize: 14,
    color: 'rgba(242,239,237,0.55)',
    textAlign: 'center',
  },
}

const m = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 200,
  },
  sheet: {
    background: '#1a1c20',
    border: '1px solid rgba(255,255,255,0.13)',
    borderRadius: '18px 18px 0 0',
    padding: 24,
    width: '100%',
    maxWidth: 480,
    boxShadow: '0 -12px 40px rgba(0,0,0,0.6)',
    paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
  },
  title: { margin: '0 0 12px', fontSize: 17, fontWeight: 700, color: '#f2efed' },
  hint: { fontSize: 13, color: 'rgba(242,239,237,0.55)', margin: '0 0 12px' },
  listItem: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '13px 14px',
    marginBottom: 6,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    color: '#f2efed',
    fontSize: 15,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  divider: {
    height: 1,
    background: 'rgba(255,255,255,0.1)',
    margin: '14px 0',
  },
  subLabel: {
    margin: '0 0 8px',
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(242,239,237,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  inputRow: { display: 'flex', gap: 8 },
  input: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'rgba(255,255,255,0.05)',
    color: '#f2efed',
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
  },
  createBtn: {
    border: 'none',
    background: '#ff571a',
    color: '#310a00',
    fontWeight: 700,
    padding: '10px 16px',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: 'inherit',
    flexShrink: 0,
  },
}
