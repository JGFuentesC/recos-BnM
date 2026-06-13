import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import CollectionItem from '../components/CollectionItem'
import BottomNav from '../components/BottomNav'
import NewListModal from '../components/NewListModal'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
const USE_API = !!import.meta.env.VITE_API_URL

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
  const { currentUser } = useAuth()
  const [items, setItems] = useState(USE_API ? [] : MOCK_ITEMS)
  const [loading, setLoading] = useState(USE_API)
  const [error, setError] = useState(false)
  const [enriching, setEnriching] = useState(new Set())
  const [toast, setToast] = useState(null)
  const [customLists, setCustomLists] = useState([])
  const [typeFilter, setTypeFilter] = useState('all')
  const [listFilter, setListFilter] = useState('all')
  const [newListOpen, setNewListOpen] = useState(false)
  const [moveTarget, setMoveTarget] = useState(null)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = '@keyframes spin { to { transform: rotate(360deg) } } @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } } @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }'
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  useEffect(() => {
    if (!USE_API || !currentUser) return
    let cancelled = false

    async function fetchCollections() {
      try {
        setLoading(true)
        setError(false)
        const token = await currentUser.getIdToken()
        const res = await fetch(
          `${API_BASE}/api/collections?userId=${currentUser.uid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (!res.ok) throw new Error(`${res.status}`)
        const data = await res.json()
        const normalized = data.map((item) => ({
          ...item,
          title: item.title ?? '',
          cover: item.cover ?? '',
          genres: Array.isArray(item.genres) ? item.genres : [],
        }))
        if (!cancelled) {
          setItems(normalized)
          const toEnrich = normalized.filter((item) => !item.title)
          if (toEnrich.length > 0) {
            setEnriching(new Set(toEnrich.map((i) => i.collectionId)))
            toEnrich.forEach(async (item) => {
              try {
                const contentRes = await fetch(
                  `${API_BASE}/api/content/${item.contentId}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                )
                if (!cancelled && contentRes.ok) {
                  const content = await contentRes.json()
                  setItems((prev) =>
                    prev.map((i) =>
                      i.collectionId === item.collectionId
                        ? {
                            ...i,
                            title: content.title ?? '',
                            cover: content.cover ?? '',
                            genres: Array.isArray(content.genres) ? content.genres : [],
                          }
                        : i
                    )
                  )
                }
              } finally {
                if (!cancelled) {
                  setEnriching((prev) => {
                    const next = new Set(prev)
                    next.delete(item.collectionId)
                    return next
                  })
                }
              }
            })
          }
        }
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchCollections()
    return () => { cancelled = true }
  }, [currentUser])

  // CollectionItem owns its fetch calls and can't be modified (see CLAUDE.md),
  // so we inject the Bearer token here for any PATCH/DELETE to /api/collections/.
  useEffect(() => {
    if (!USE_API || !currentUser) return
    const original = window.fetch.bind(window)
    let hideTimer = null

    window.fetch = async (input, init) => {
      const url = input instanceof Request ? input.url : String(input)
      const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase()
      if (url.startsWith(`${API_BASE}/api/collections/`) && (method === 'PATCH' || method === 'DELETE')) {
        const token = await currentUser.getIdToken()
        const response = await original(input, {
          ...init,
          headers: { ...(init?.headers ?? {}), Authorization: `Bearer ${token}` },
        })
        if (response.ok && method === 'PATCH') {
          // Sync personalNote back into items so CollectionItem's blur guard
          // (note === item.personalNote) prevents a duplicate PATCH on next blur.
          try {
            const body = JSON.parse(init?.body ?? '{}')
            const collectionId = url.replace(`${API_BASE}/api/collections/`, '').split('/')[0]
            if (body.personalNote !== undefined) {
              setItems((prev) =>
                prev.map((i) =>
                  i.collectionId === collectionId ? { ...i, personalNote: body.personalNote } : i
                )
              )
            }
          } catch {}
          setToast({ msg: '✓ Nota guardada' })
          clearTimeout(hideTimer)
          hideTimer = setTimeout(() => setToast(null), 3000)
        }
        return response
      }
      return original(input, init)
    }

    return () => {
      window.fetch = original
      clearTimeout(hideTimer)
    }
  }, [currentUser])

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

  async function handleShareList(listName) {
    const item = items.find((i) => i.listName === listName)
    if (!item) return
    try {
      const token = await currentUser.getIdToken()
      const res = await fetch(
        `${API_BASE}/api/collections/${item.collectionId}/share`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) throw new Error(`${res.status}`)
      const { shareUrl } = await res.json()
      if (navigator.share) {
        await navigator.share({ title: listName, url: shareUrl })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        setToast({ msg: '¡Link copiado!' })
        setTimeout(() => setToast(null), 3000)
      }
    } catch {
      setToast({ msg: 'Error al compartir', err: true })
      setTimeout(() => setToast(null), 3000)
    }
  }

  if (loading) {
    return (
      <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={s.spinner} />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={s.empty}>
          <span style={s.emptyIcon}>⚠️</span>
          <p style={s.emptyTitle}>Error al cargar tu biblioteca</p>
          <p style={s.emptyText}>Intenta de nuevo más tarde</p>
        </div>
      </div>
    )
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
          <div key={list} style={s.listChipWrap}>
            <button
              style={{ ...s.pill, ...(listFilter === list ? s.pillActive : {}) }}
              onClick={() => setListFilter(list)}
            >
              {list}
            </button>
            <button
              style={s.shareBtn}
              onClick={(e) => { e.stopPropagation(); handleShareList(list) }}
              aria-label={`Compartir lista ${list}`}
            >
              ↗
            </button>
          </div>
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
          filtered.map((item) =>
            enriching.has(item.collectionId) ? (
              <div key={item.collectionId} style={s.skeletonCard}>
                <div style={s.skeletonCover} />
                <div style={s.skeletonBody}>
                  <div style={{ ...s.skeletonLine, width: '40%', marginBottom: 10 }} />
                  <div style={{ ...s.skeletonLine, width: '70%', marginBottom: 8 }} />
                  <div style={{ ...s.skeletonLine, width: '55%' }} />
                </div>
              </div>
            ) : (
              <CollectionItem
                key={item.collectionId}
                item={item}
                onDelete={handleDelete}
                onMoveList={handleMoveList}
              />
            )
          )
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

      {toast && (
        <div style={{ ...s.toast, ...(toast.err ? s.toastErr : {}) }}>
          {toast.msg}
        </div>
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
  listChipWrap: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  shareBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    color: 'rgba(242,239,237,0.45)',
    padding: '0 2px 0 4px',
    lineHeight: 1,
    WebkitTapHighlightColor: 'transparent',
  },
  skeletonCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '14px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  skeletonCover: {
    width: 60,
    height: 90,
    borderRadius: 8,
    flexShrink: 0,
    background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s infinite',
  },
  skeletonBody: { flex: 1, paddingTop: 6 },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
    background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s infinite',
  },
  toast: {
    position: 'fixed',
    bottom: 96,
    right: 16,
    background: '#14532d',
    border: '1px solid rgba(74,222,128,0.25)',
    color: '#4ade80',
    padding: '10px 16px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    zIndex: 300,
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    animation: 'fadeInUp 0.25s ease',
    fontFamily: 'inherit',
  },
  toastErr: {
    background: '#3a1414',
    border: '1px solid rgba(248,113,113,0.25)',
    color: '#f87171',
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '3px solid rgba(255,87,26,0.2)',
    borderTopColor: '#ff571a',
    animation: 'spin 0.8s linear infinite',
  },
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
