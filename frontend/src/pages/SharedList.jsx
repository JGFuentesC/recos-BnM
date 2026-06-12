import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

const TYPE_LABEL = {
  movie: '🎬 Película',
  book: '📚 Libro',
}

export default function SharedList() {
  const { shareToken } = useParams()
  const [listName, setListName] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = '@keyframes spin { to { transform: rotate(360deg) } }'
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/collections/share/${shareToken}`)
        if (!res.ok) throw new Error(`${res.status}`)
        const data = await res.json()
        setListName(data.listName ?? '')
        setItems(Array.isArray(data.items) ? data.items : [data].filter(Boolean))
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [shareToken])

  if (loading) {
    return (
      <div style={s.page}>
        <div style={s.center}>
          <div style={s.spinner} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={s.page}>
        <div style={s.center}>
          <span style={s.bigIcon}>⚠️</span>
          <p style={s.heading}>Lista no disponible</p>
          <p style={s.sub}>El link puede haber expirado o ser incorrecto.</p>
          <Link to="/" style={s.cta}>Descarga la app →</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <header style={s.header}>
        <p style={s.eyebrow}>Lista compartida</p>
        <h1 style={s.heading}>{listName}</h1>
        <p style={s.count}>
          {items.length} {items.length === 1 ? 'título' : 'títulos'}
        </p>
      </header>

      <div style={s.list}>
        {items.map((item, idx) => (
          <div key={item.collectionId ?? idx} style={s.card}>
            <span style={s.badge}>
              {TYPE_LABEL[item.contentType] ?? item.contentType}
            </span>
            <p style={s.itemTitle}>{item.title || item.contentId}</p>
            {item.personalNote ? (
              <p style={s.note}>"{item.personalNote}"</p>
            ) : null}
            {item.savedAt ? (
              <p style={s.date}>
                {new Date(item.savedAt).toLocaleDateString('es-MX', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <footer style={s.footer}>
        <p style={s.footerText}>¿Te gustó esta lista?</p>
        <Link to="/" style={s.cta}>
          Crea tu propia biblioteca en Recos BnM →
        </Link>
      </footer>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100dvh',
    background: '#0e0f10',
    color: '#f2efed',
    paddingBottom: 48,
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100dvh',
    gap: 12,
    padding: '0 24px',
  },
  header: {
    padding: '32px 20px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  eyebrow: {
    margin: '0 0 6px',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#ff571a',
  },
  heading: {
    margin: '0 0 6px',
    fontSize: 26,
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: '#f2efed',
  },
  count: {
    margin: 0,
    fontSize: 13,
    color: 'rgba(242,239,237,0.45)',
  },
  list: { padding: '8px 0' },
  card: {
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  badge: {
    display: 'inline-block',
    fontSize: 11,
    fontWeight: 600,
    color: '#ff571a',
    background: 'rgba(255,87,26,0.14)',
    borderRadius: 999,
    padding: '2px 8px',
    marginBottom: 8,
  },
  itemTitle: {
    margin: '0 0 4px',
    fontSize: 16,
    fontWeight: 700,
    color: '#f2efed',
    lineHeight: 1.3,
  },
  note: {
    margin: '4px 0',
    fontSize: 13,
    color: 'rgba(242,239,237,0.6)',
    fontStyle: 'italic',
    lineHeight: 1.4,
  },
  date: {
    margin: '6px 0 0',
    fontSize: 11,
    color: 'rgba(242,239,237,0.35)',
  },
  footer: {
    padding: '32px 20px',
    textAlign: 'center',
  },
  footerText: {
    margin: '0 0 10px',
    fontSize: 14,
    color: 'rgba(242,239,237,0.55)',
  },
  bigIcon: { fontSize: 48 },
  sub: {
    margin: '4px 0 16px',
    fontSize: 14,
    color: 'rgba(242,239,237,0.55)',
    textAlign: 'center',
  },
  cta: {
    display: 'inline-block',
    padding: '12px 20px',
    background: '#ff571a',
    color: '#310a00',
    fontWeight: 700,
    fontSize: 14,
    borderRadius: 12,
    textDecoration: 'none',
  },
  spinner: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '3px solid rgba(255,87,26,0.2)',
    borderTopColor: '#ff571a',
    animation: 'spin 0.8s linear infinite',
  },
}
