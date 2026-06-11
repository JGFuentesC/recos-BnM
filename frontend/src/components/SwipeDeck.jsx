import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import ContentCard from './ContentCard'
import { useAuth } from '../contexts/AuthContext'
import { useFeed } from '../contexts/FeedContext'
import DetailSheet from './DetailSheet'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
const SWIPE_THRESHOLD = 80
const SWIPE_VELOCITY_THRESHOLD = 300

function SwipeCard({ card, onSwipe, onTap }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const likeOpacity = useTransform(x, [30, 100], [0, 1])
  const skipOpacity = useTransform(x, [-100, -30], [1, 0])

  function handleDragEnd(_, info) {
    const isSwipeRight =
      info.offset.x > SWIPE_THRESHOLD ||
      (info.velocity.x > SWIPE_VELOCITY_THRESHOLD && info.offset.x > 0)
    const isSwipeLeft =
      info.offset.x < -SWIPE_THRESHOLD ||
      (info.velocity.x < -SWIPE_VELOCITY_THRESHOLD && info.offset.x < 0)

    if (isSwipeRight) {
      animate(x, 600, { duration: 0.3 })
      onSwipe(card, 'like')
    } else if (isSwipeLeft) {
      animate(x, -600, { duration: 0.3 })
      onSwipe(card, 'dislike')
    }
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      style={{ x, rotate, cursor: 'grab', position: 'relative', touchAction: 'none' }}
      onDragEnd={handleDragEnd}
      onTap={onTap}
    >
      <motion.div style={{ ...s.indicator, ...s.likeIndicator, opacity: likeOpacity }}>
        ❤️ LIKE
      </motion.div>
      <motion.div style={{ ...s.indicator, ...s.skipIndicator, opacity: skipOpacity }}>
        ✕ SKIP
      </motion.div>
      <ContentCard {...card} />
    </motion.div>
  )
}

export default function SwipeDeck() {
  const { currentUser } = useAuth()
  const { activeType } = useFeed()
  const [cards, setCards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedContentId, setSelectedContentId] = useState(null)
  const cursorRef = useRef(null)
  const isFetchingRef = useRef(false)

  const fetchFeed = useCallback(
    async (cur) => {
      if (isFetchingRef.current) return
      isFetchingRef.current = true
      if (cur == null) setLoading(true)

      try {
        const token = await currentUser.getIdToken()
        const params = new URLSearchParams({ userId: currentUser.uid, type: activeType })
        if (cur != null) params.set('cursor', String(cur))

        const res = await fetch(`${API_BASE}/api/feed?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('feed fetch failed')

        const data = await res.json()
        const items = Array.isArray(data) ? data : (data.items ?? [])
        cursorRef.current = Array.isArray(data) ? null : (data.cursor ?? null)

        setCards(prev => (cur == null ? items : [...prev, ...items]))
        setError(false)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
        isFetchingRef.current = false
      }
    },
    [currentUser, activeType]
  )

  // Initial fetch when component mounts (or currentUser becomes available)
  useEffect(() => {
    if (currentUser) fetchFeed(null)
    // fetchFeed excluded: activeType changes remount this component via key={activeType} in Feed.jsx
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  // Pre-fetch silencioso cuando quedan ≤5 tarjetas sin ver
  useEffect(() => {
    const remaining = cards.length - currentIndex
    if (remaining <= 5 && !isFetchingRef.current && cursorRef.current != null && cards.length > 0) {
      fetchFeed(cursorRef.current)
    }
  }, [currentIndex, cards.length, fetchFeed])

  const handleSwipe = useCallback(
    (card, action) => {
      setCurrentIndex(prev => prev + 1)
      // Fire-and-forget — no await, no bloquea la animación
      currentUser.getIdToken().then(token =>
        fetch(`${API_BASE}/api/swipe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            userId: currentUser.uid,
            contentId: card.contentId,
            contentType: activeType,
            action,
          }),
        }).catch(() => {})
      )
    },
    [currentUser, activeType]
  )

  const handleLoadMore = useCallback(() => {
    setCurrentIndex(0)
    setCards([])
    cursorRef.current = null
    isFetchingRef.current = false
    fetchFeed(null)
  }, [fetchFeed])

  if (loading) {
    return (
      <div style={s.center}>
        <p style={s.msg}>Cargando...</p>
      </div>
    )
  }

  if (error && cards.length === 0) {
    return (
      <div style={s.center}>
        <p style={s.msg}>Error al cargar contenido. Intenta de nuevo.</p>
        <button style={s.btn} onClick={handleLoadMore}>
          Reintentar
        </button>
      </div>
    )
  }

  if (currentIndex >= cards.length) {
    return (
      <div style={s.center}>
        <p style={s.msg}>¡Has visto todo!</p>
        <button style={s.btn} onClick={handleLoadMore}>
          Ver más
        </button>
      </div>
    )
  }

  const visible = cards.slice(currentIndex, currentIndex + 3)

  return (
    <div style={s.deck}>
      {visible.map((card, i) => {
        const scale = i === 0 ? 1 : i === 1 ? 0.97 : 0.94
        const zIndex = visible.length - i
        const translateY = i * 10

        if (i === 0) {
          return (
            <div key={card.contentId} style={{ ...s.cardPos, zIndex }}>
              <SwipeCard
                card={card}
                onSwipe={handleSwipe}
                onTap={() => setSelectedContentId(card.contentId)}
              />
            </div>
          )
        }

        return (
          <div
            key={card.contentId}
            style={{
              ...s.cardPos,
              zIndex,
              transform: `scale(${scale}) translateY(${translateY}px)`,
            }}
          >
            <ContentCard {...card} />
          </div>
        )
      })}

      {selectedContentId && (
        <DetailSheet
        isOpen={!!selectedContentId}
        contentId={selectedContentId}
        onClose={() => setSelectedContentId(null)}
        onSaved={() => {
          // 1. Cerramos el modal flotante
          setSelectedContentId(null);
          // 2. 🚀 Avanzamos el mazo a la siguiente película usando el índice nativo
          setCurrentIndex(prev => prev + 1);
        }}
        onDislike={() => {
          // 1. Cerramos el modal flotante
          setSelectedContentId(null);
          // 2. 🚀 Avanzamos el mazo a la siguiente película usando el índice nativo
          setCurrentIndex(prev => prev + 1);
        }}
      />
      )}
    </div>
  )
}

const s = {
  deck: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cardPos: {
    position: 'absolute',
    width: '90%',
    maxWidth: 380,
    transition: 'transform 200ms ease',
  },
  center: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  msg: {
    fontSize: 18,
    fontFamily: 'Geist, Inter, sans-serif',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  btn: {
    background: '#ff571a',
    color: '#fff',
    border: 'none',
    borderRadius: 9999,
    padding: '12px 32px',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: 'Geist, Inter, sans-serif',
    cursor: 'pointer',
  },
  indicator: {
    position: 'absolute',
    top: 20,
    zIndex: 10,
    color: 'white',
    fontWeight: 700,
    fontSize: 18,
    padding: '8px 16px',
    borderRadius: 8,
    pointerEvents: 'none',
  },
  likeIndicator: {
    left: 20,
    background: '#22c55e',
  },
  skipIndicator: {
    right: 20,
    background: '#ef4444',
  },
}
