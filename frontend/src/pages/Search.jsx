import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AppLayout from '../components/AppLayout'

// ── useDebounce ───────────────────────────────────────────────────────────────
// Retrasa la actualización de `value` por `delay` ms.
// SEC-JC-04: el query NUNCA se escribe en la URL; vive solo en estado local React.
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}

// ── Estilos inline ────────────────────────────────────────────────────────────
const s = {
  page: {
    padding: '16px',
    maxWidth: '480px',
    margin: '0 auto',
    paddingBottom: '80px',
  },
  inputWrapper: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '24px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
    background: '#f9f9f9',
    color: '#111',
  },
  filtersRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  chip: (active) => ({
    padding: '6px 16px',
    borderRadius: '16px',
    background: active ? '#ff571a' : '#f0f0f0',
    color: active ? 'white' : '#333',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background 200ms, color 200ms',
  }),
  message: (color = '#888') => ({
    textAlign: 'center',
    color,
    marginTop: '32px',
    fontSize: '15px',
    lineHeight: '1.5',
  }),
  resultsList: {
    display: 'grid',
    gap: '12px',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#fff',
    borderRadius: '12px',
    padding: '10px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'box-shadow 150ms',
  },
  cover: {
    width: '64px',
    height: '96px',
    objectFit: 'cover',
    borderRadius: '8px',
    flexShrink: 0,
  },
  coverPlaceholder: {
    width: '64px',
    height: '96px',
    borderRadius: '8px',
    background: '#e8e8e8',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: '#aaa',
    textAlign: 'center',
    padding: '4px',
  },
  info: {
    flex: 1,
    overflow: 'hidden',
  },
  title: {
    margin: '0 0 2px',
    fontSize: '15px',
    fontWeight: 600,
    color: '#111',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  badge: {
    fontSize: '12px',
    color: '#ff571a',
    margin: '0 0 4px',
  },
  genres: {
    fontSize: '12px',
    color: '#888',
    margin: '0 0 4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  rating: {
    fontSize: '12px',
    color: '#555',
    margin: 0,
  },
}

// ── Tarjeta compacta ──────────────────────────────────────────────────────────
// SEC-JC-01: No se usa dangerouslySetInnerHTML en ningún punto.
// Todos los valores se renderizan como texto plano dentro de JSX.
// React escapa automáticamente cualquier contenido especial.
function CompactCard({ item, onClick }) {
  const badge  = item.type === 'movie' ? '🎬 Película' : '📚 Libro'
  const genres = (item.genres || []).slice(0, 3).join(', ')

  return (
    <div style={s.card} onClick={onClick} role="listitem">
      {item.cover ? (
        <img src={item.cover} alt={item.title} style={s.cover} />
      ) : (
        <div style={s.coverPlaceholder}>{item.title}</div>
      )}
      <div style={s.info}>
        {/* SEC-JC-01: texto plano — React escapa por defecto */}
        <p style={s.title}>{item.title}</p>
        <p style={s.badge}>{badge}</p>
        {genres        ? <p style={s.genres}>{genres}</p>                          : null}
        {item.rating != null ? <p style={s.rating}>⭐ {Number(item.rating).toFixed(1)}</p> : null}
      </div>
    </div>
  )
}

// ── Pantalla principal ────────────────────────────────────────────────────────
export default function Search() {
  const { currentUser } = useAuth()

  const [query,   setQuery]   = useState('')
  const [type,    setType]    = useState('all')   // 'all' | 'movie' | 'book'
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  // SEC-JC-04: El valor de búsqueda NUNCA se escribe en la URL.
  // La URL permanece en /search sin query params. El estado vive solo en React.
  const debouncedQuery = useDebounce(query, 300)

  // Cancelar peticiones obsoletas cuando el usuario sigue escribiendo
  const abortRef = useRef(null)

  const runSearch = useCallback(async (q, t) => {
    const trimmed = q.trim()
    if (trimmed.length < 2) {
      setResults([])
      setError(null)
      return
    }

    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    setError(null)

    try {
      // SEC-JC-03: El token se obtiene fresco en cada request.
      // NUNCA se almacena en localStorage ni sessionStorage.
      const token = await currentUser.getIdToken()

      const params = new URLSearchParams({ q: trimmed })
      if (t && t !== 'all') params.set('type', t)

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/search?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortRef.current.signal,
        }
      )

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setResults(await res.json())
    } catch (err) {
      if (err.name === 'AbortError') return  // petición cancelada — no es error
      setError('No se pudo realizar la búsqueda. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  // Ejecutar búsqueda cuando cambia el query con debounce o el tipo
  useEffect(() => {
    runSearch(debouncedQuery, type)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, type])

  const hasQuery      = query.trim().length >= 2
  const showEmpty     = !hasQuery
  const showNoResults = hasQuery && !loading && !error && results.length === 0

  return (
    <AppLayout>
      <div style={s.page}>

        {/* ── Input de búsqueda ───────────────────────────────────────────── */}
        <div style={s.inputWrapper}>
          <input
            type="search"
            placeholder="Buscar película, libro, autor..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={s.input}
            autoComplete="off"
            aria-label="Buscar contenido"
          />
        </div>

        {/* ── Chips de filtro por tipo ────────────────────────────────────── */}
        <div style={s.filtersRow} role="group" aria-label="Filtrar por tipo">
          {[
            { key: 'all',   label: 'Todos'       },
            { key: 'movie', label: '🎬 Películas' },
            { key: 'book',  label: '📚 Libros'    },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setType(key)}
              style={s.chip(type === key)}
              aria-pressed={type === key}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Mensajes de estado ──────────────────────────────────────────── */}
        {showEmpty     && <p style={s.message()}>Busca una película, libro, autor o director</p>}
        {loading       && <p style={s.message()}>Buscando...</p>}
        {error         && <p style={s.message('#e53e3e')}>{error}</p>}
        {showNoResults && <p style={s.message()}>Sin resultados para &ldquo;{query}&rdquo;</p>}

        {/* ── Lista de resultados ─────────────────────────────────────────── */}
        {!loading && results.length > 0 && (
          <div style={s.resultsList} role="list">
            {results.map(item => (
              <CompactCard
                key={item.contentId}
                item={item}
                onClick={() => { /* integrar DetailSheet cuando esté disponible */ }}
              />
            ))}
          </div>
        )}

      </div>
    </AppLayout>
  )
}
