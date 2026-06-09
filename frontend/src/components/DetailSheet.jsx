/**
 * DetailSheet — Instrucciones de integración para Monserrat Miranda (SwipeDeck.jsx):
 *
 * 1. En SwipeDeck.jsx, agregar estado:
 *      const [selectedContentId, setSelectedContentId] = useState(null)
 *
 * 2. En el onTap de SwipeCard (ya implementado en SwipeDeck.jsx línea 185):
 *      onTap={() => setSelectedContentId(card.contentId)}
 *
 * 3. Descomentar el bloque "DetailSheet — integrar cuando Marina entregue" en SwipeDeck.jsx
 *    (líneas 205-220) y agregar el import al inicio del archivo:
 *      import DetailSheet from './DetailSheet'
 *
 *    El bloque a descomentar queda así:
 *      {selectedContentId && (
 *        <DetailSheet
 *          isOpen={!!selectedContentId}
 *          contentId={selectedContentId}
 *          onClose={() => setSelectedContentId(null)}
 *          onSaved={() => setSelectedContentId(null)}
 *          onDislike={() => setSelectedContentId(null)}
 *        />
 *      )}
 *
 * Props: { contentId: string, isOpen: bool, onClose: fn, onSaved: fn, onDislike: fn }
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export default function DetailSheet({ contentId, onClose, onSaved, onDislike }) {
  const { currentUser } = useAuth()
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const [animState, setAnimState] = useState('entering') // 'entering' | 'open' | 'closing'
  const [toast, setToast] = useState(null)
  const closingRef = useRef(false)

  // Trigger slide-up entry animation on mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimState('open'))
    return () => cancelAnimationFrame(id)
  }, [])

  // Fetch content detail when component mounts
  useEffect(() => {
    if (!contentId || !currentUser) return
    let cancelled = false
    setLoading(true)
    setFetchError(false)
    setContent(null)

    async function load() {
      try {
        const token = await currentUser.getIdToken()
        const res = await fetch(`${API_BASE}/api/content/${contentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('fetch failed')
        const data = await res.json()
        if (!cancelled) setContent(data)
      } catch {
        if (!cancelled) setFetchError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [contentId, currentUser])

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2500)
  }, [])

  // Play slide-down animation then call callback. Guards against double-trigger.
  const triggerClose = useCallback((callback) => {
    if (closingRef.current) return
    closingRef.current = true
    setAnimState('closing')
    setTimeout(callback, 200)
  }, [])

  const handleSave = useCallback(async () => {
    if (!content || !currentUser) return
    try {
      const token = await currentUser.getIdToken()
      const res = await fetch(`${API_BASE}/api/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          contentId: content.contentId,
          contentType: content.type,
          listName: 'Guardados',
        }),
      })
      // 409 means already saved — treat as success
      if (!res.ok && res.status !== 409) throw new Error('save failed')
      showToast('¡Guardado!')
      triggerClose(onSaved)
    } catch {
      showToast('No se pudo guardar. Intenta de nuevo.', 'error')
    }
  }, [content, currentUser, showToast, triggerClose, onSaved])

  const handleDislike = useCallback(() => {
    if (!content || !currentUser) return
    // Fire-and-forget — doesn't block the close animation
    currentUser.getIdToken().then(token =>
      fetch(`${API_BASE}/api/swipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          contentId: content.contentId,
          contentType: content.type,
          action: 'dislike',
        }),
      }).catch(() => {})
    )
    triggerClose(onDislike)
  }, [content, currentUser, triggerClose, onDislike])

  const handleShare = useCallback(async () => {
    if (!content) return
    const url = `${window.location.origin}/content/${content.contentId}`
    try {
      await navigator.share({ title: content.title, url })
    } catch {
      try {
        await navigator.clipboard.writeText(url)
        showToast('Link copiado')
      } catch {
        // Silent failure
      }
    }
  }, [content, showToast])

  const isOpen = animState === 'open'
  const isClosing = animState === 'closing'
  const sheetTransform = isOpen ? 'translateY(0)' : 'translateY(100%)'
  const sheetTransition = isClosing ? 'transform 200ms ease-in' : 'transform 300ms ease-out'
  const overlayOpacity = isOpen ? 0.5 : 0
  const overlayTransition = isClosing ? 'opacity 200ms ease-in' : 'opacity 300ms ease-out'

  return (
    <>
      <style>{`@keyframes ds-spin { to { transform: rotate(360deg); } }`}</style>
      <div style={s.root}>
        <div
          style={{ ...s.overlay, opacity: overlayOpacity, transition: overlayTransition }}
          onClick={() => triggerClose(onClose)}
        />

        <div style={{ ...s.sheet, transform: sheetTransform, transition: sheetTransition }}>
          <div style={s.dragIndicator} />

          <div style={s.scrollArea}>
            {loading && (
              <div style={s.center}>
                <div style={s.spinner} />
              </div>
            )}

            {fetchError && !loading && (
              <div style={s.center}>
                <p style={s.errorText}>No se pudo cargar el detalle. Intenta de nuevo.</p>
              </div>
            )}

            {content && !loading && (
              <>
                <img
                  src={content.cover}
                  alt={content.title}
                  style={content.type === 'movie' ? s.coverWide : s.coverTall}
                />

                <div style={s.badgeRow}>
                  <span style={s.typeBadge}>
                    {content.type === 'movie' ? '🎬 Película' : '📚 Libro'}
                  </span>
                </div>

                <div style={s.infoSection}>
                  <h2 style={s.title}>{content.title}</h2>

                  <div style={s.metaRow}>
                    <span style={s.rating}>⭐ {content.rating}</span>
                    <span style={s.year}>{content.year}</span>
                    {content.genres?.map(g => (
                      <span key={g} style={s.genreChip}>{g}</span>
                    ))}
                  </div>

                  <p style={s.synopsis}>{content.synopsis}</p>

                  {content.creator?.length > 0 && (
                    <p style={s.creatorLine}>
                      <span style={s.creatorLabel}>
                        {content.type === 'movie' ? 'Director:' : 'Autor:'}
                      </span>{' '}
                      {content.creator.join(', ')}
                    </p>
                  )}

                  {content.type === 'movie' && (
                    <div style={s.providersSection}>
                      <p style={s.providersTitle}>Disponible en:</p>
                      {content.watchProviders?.length > 0 ? (
                        <div style={s.providersList}>
                          {content.watchProviders.map(p => (
                            <span key={p} style={s.providerChip}>{p}</span>
                          ))}
                        </div>
                      ) : (
                        <p style={s.noProviders}>
                          No hay información de streaming disponible
                        </p>
                      )}
                      {content.attribution && (
                        <p style={s.attribution}>{content.attribution}</p>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div style={s.buttons}>
            <button
              style={{ ...s.btn, ...s.btnDislike }}
              onClick={handleDislike}
              disabled={loading || !content}
            >
              ✕ No me interesa
            </button>
            <button
              style={{ ...s.btn, ...s.btnSave }}
              onClick={handleSave}
              disabled={loading || !content}
            >
              💾 Guardar
            </button>
            <button
              style={{ ...s.btn, ...s.btnShare }}
              onClick={handleShare}
              disabled={loading || !content}
            >
              ↗ Compartir
            </button>
          </div>
        </div>

        {toast && (
          <div
            style={{
              ...s.toast,
              background: toast.type === 'error' ? '#ef4444' : '#22c55e',
            }}
          >
            {toast.message}
          </div>
        )}
      </div>
    </>
  )
}

const s = {
  root: {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: '#000',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '85vh',
    background: '#fff',
    borderRadius: '20px 20px 0 0',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    background: '#e5e7eb',
    borderRadius: 2,
    margin: '12px auto 4px',
    flexShrink: 0,
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: 100,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  spinner: {
    width: 32,
    height: 32,
    border: '3px solid #e5e7eb',
    borderTopColor: '#ff571a',
    borderRadius: '50%',
    animation: 'ds-spin 0.8s linear infinite',
  },
  errorText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    padding: '0 24px',
    fontFamily: 'Geist, Inter, sans-serif',
  },
  coverWide: {
    width: '100%',
    aspectRatio: '16 / 9',
    objectFit: 'cover',
    display: 'block',
  },
  coverTall: {
    width: '100%',
    aspectRatio: '3 / 4',
    objectFit: 'cover',
    display: 'block',
  },
  badgeRow: {
    padding: '12px 16px 0',
  },
  typeBadge: {
    display: 'inline-block',
    background: '#f3f4f6',
    color: '#374151',
    borderRadius: 20,
    padding: '4px 12px',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'Geist, Inter, sans-serif',
  },
  infoSection: {
    padding: '12px 16px',
  },
  title: {
    margin: '0 0 8px',
    fontSize: 22,
    fontWeight: 700,
    color: '#1a1a2e',
    fontFamily: 'Geist, Inter, sans-serif',
    lineHeight: 1.2,
  },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    fontFamily: 'Geist, Inter, sans-serif',
  },
  year: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Geist, Inter, sans-serif',
  },
  genreChip: {
    background: '#f3f4f6',
    color: '#374151',
    borderRadius: 20,
    padding: '2px 10px',
    fontSize: 12,
    fontFamily: 'Geist, Inter, sans-serif',
  },
  synopsis: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 1.6,
    margin: '0 0 12px',
    fontFamily: 'Geist, Inter, sans-serif',
  },
  creatorLine: {
    fontSize: 14,
    color: '#374151',
    margin: '0 0 12px',
    fontFamily: 'Geist, Inter, sans-serif',
  },
  creatorLabel: {
    fontWeight: 600,
    color: '#1a1a2e',
  },
  providersSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTop: '1px solid #f3f4f6',
  },
  providersTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1a1a2e',
    margin: '0 0 8px',
    fontFamily: 'Geist, Inter, sans-serif',
  },
  providersList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  providerChip: {
    background: '#1a1a2e',
    color: '#fff',
    borderRadius: 20,
    padding: '4px 12px',
    fontSize: 13,
    fontFamily: 'Geist, Inter, sans-serif',
  },
  noProviders: {
    fontSize: 13,
    color: '#9ca3af',
    margin: 0,
    fontFamily: 'Geist, Inter, sans-serif',
    fontStyle: 'italic',
  },
  attribution: {
    fontSize: 11,
    color: '#9ca3af',
    margin: '8px 0 0',
    fontFamily: 'Geist, Inter, sans-serif',
  },
  buttons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#fff',
    borderTop: '1px solid #f3f4f6',
    padding: '12px 16px',
    paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
    display: 'flex',
    gap: 8,
    flexShrink: 0,
  },
  btn: {
    flex: 1,
    border: 'none',
    borderRadius: 9999,
    padding: '12px 8px',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'Geist, Inter, sans-serif',
    cursor: 'pointer',
    color: '#fff',
    minWidth: 0,
  },
  btnDislike: {
    background: '#9ca3af',
  },
  btnSave: {
    background: '#22c55e',
  },
  btnShare: {
    background: '#3b82f6',
  },
  toast: {
    position: 'absolute',
    top: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: 9999,
    fontSize: 14,
    fontWeight: 600,
    fontFamily: 'Geist, Inter, sans-serif',
    zIndex: 200,
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    pointerEvents: 'none',
  },
}
