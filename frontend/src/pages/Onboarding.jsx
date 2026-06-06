import { useState, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { doc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/config"
import { useAuth } from "../contexts/AuthContext"
import { MOCK_FEED_ITEMS } from "../__mocks__/feed.mock"

const GENRES = [
  "Acción", "Drama", "Comedia", "Terror", "Romance",
  "Ciencia Ficción", "Misterio", "Documentales", "Fantasía",
  "Thriller", "Biografías", "Historia",
]

const styles = {
  container: {
    minHeight: "100dvh",
    backgroundColor: "#131313",
    color: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
    fontFamily: "Geist, Inter, sans-serif",
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 4,
    marginBottom: 32,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#ff571a",
    borderRadius: 4,
    transition: "width 300ms ease-out",
  },
  stepContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    transition: "transform 300ms ease-out, opacity 300ms ease-out",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    fontFamily: "Playfair Display, serif",
    marginBottom: 8,
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(229,226,225,0.6)",
    marginBottom: 24,
    lineHeight: 1.5,
  },
  genreGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginBottom: 32,
  },
  chip: {
    padding: "10px 18px",
    borderRadius: 9999,
    border: "1px solid rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.04)",
    color: "rgba(229,226,225,0.6)",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 200ms ease-out",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  },
  chipActive: {
    backgroundColor: "#ff571a",
    color: "#FFFFFF",
    borderColor: "#ff571a",
  },
  button: {
    width: "100%",
    padding: "14px 0",
    borderRadius: 12,
    border: "none",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 200ms ease-out",
    fontFamily: "Geist, Inter, sans-serif",
  },
  buttonPrimary: {
    backgroundColor: "#ff571a",
    color: "#FFFFFF",
  },
  buttonDisabled: {
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "rgba(229,226,225,0.3)",
    cursor: "not-allowed",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    marginBottom: 16,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  cardCover: {
    width: "100%",
    height: "55%",
    objectFit: "cover",
    minHeight: 240,
  },
  cardBody: {
    padding: 16,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    fontFamily: "Playfair Display, serif",
    color: "#FFFFFF",
    lineHeight: 1.2,
  },
  cardMeta: {
    fontSize: 13,
    color: "rgba(229,226,225,0.6)",
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  cardGenres: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },
  genreTag: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "4px 10px",
    fontSize: 12,
    color: "rgba(229,226,225,0.6)",
  },
  cardSynopsis: {
    fontSize: 14,
    color: "rgba(229,226,225,0.6)",
    lineHeight: 1.5,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
  },
  actionsRow: {
    display: "flex",
    justifyContent: "center",
    gap: 24,
    padding: "12px 0",
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    transition: "all 200ms ease-out",
    WebkitTapHighlightColor: "transparent",
  },
  actionButtonLike: {
    background: "linear-gradient(135deg, #ff571a, #ff8c42)",
    color: "#FFFFFF",
    boxShadow: "0 4px 20px rgba(255, 87, 26, 0.3)",
  },
  actionButtonDislike: {
    backgroundColor: "#2A2A2A",
    color: "rgba(229,226,225,0.6)",
  },
  skipButton: {
    position: "absolute",
    top: 0,
    right: 0,
    background: "none",
    border: "none",
    color: "rgba(229,226,225,0.6)",
    fontSize: 14,
    cursor: "pointer",
    padding: "4px 8px",
    fontFamily: "Geist, Inter, sans-serif",
    textDecoration: "underline",
    zIndex: 2,
  },
  progressText: {
    fontSize: 13,
    color: "rgba(229,226,225,0.6)",
    textAlign: "center",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.04)",
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Geist, Inter, sans-serif",
    outline: "none",
    transition: "border-color 200ms ease-out",
    boxSizing: "border-box",
  },
  inputFocus: {
    borderColor: "#ff571a",
  },
  label: {
    fontSize: 14,
    color: "rgba(229,226,225,0.6)",
    marginBottom: 6,
    display: "block",
  },
  spacer: {
    height: 16,
  },
}

export default function Onboarding() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [step, setStep] = useState(1)
  const [selectedGenres, setSelectedGenres] = useState([])
  const [cardIndex, setCardIndex] = useState(0)
  const [swipeActions, setSwipeActions] = useState([])
  const [author, setAuthor] = useState("")
  const [director, setDirector] = useState("")
  const [saving, setSaving] = useState(false)
  const [direction, setDirection] = useState("next")

  const onboardingCards = useMemo(() => MOCK_FEED_ITEMS.slice(0, 5), [])

  const toggleGenre = useCallback((genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }, [])

  const handleNextStep = useCallback(() => {
    setDirection("next")
    setStep((s) => s + 1)
  }, [])

  const handleSkipCard = useCallback(() => {
    if (cardIndex < onboardingCards.length - 1) {
      setCardIndex((i) => i + 1)
    } else {
      handleNextStep()
    }
  }, [cardIndex, onboardingCards.length, handleNextStep])

  const handleSwipe = useCallback(
    (action) => {
      const card = onboardingCards[cardIndex]
      setSwipeActions((prev) => [...prev, { ...card, action }])
      if (cardIndex < onboardingCards.length - 1) {
        setCardIndex((i) => i + 1)
      } else {
        handleNextStep()
      }
    },
    [cardIndex, onboardingCards, handleNextStep]
  )

  const handleFinish = useCallback(async () => {
    if (!currentUser) return
    setSaving(true)
    try {
      const userRef = doc(db, "users", currentUser.uid)
      await updateDoc(userRef, {
        "prefs.genres": selectedGenres,
        "prefs.authors": author.trim() ? [author.trim()] : [],
        "prefs.directors": director.trim() ? [director.trim()] : [],
        "prefs.cold_start_done": true,
        onboardingCompletedAt: serverTimestamp(),
        onboardingSkipped: false,
        updatedAt: serverTimestamp(),
      })
      navigate("/feed")
    } catch {
      setSaving(false)
    }
  }, [currentUser, selectedGenres, author, director, navigate])

  const progress = step === 1 ? 0.15 : step === 2 ? 0.5 : 0.85

  if (!currentUser) {
    return (
      <div style={styles.container}>
        <p style={{ color: "rgba(229,226,225,0.6)", textAlign: "center", marginTop: 80 }}>
          Cargando...
        </p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${progress * 100}%` }} />
      </div>

      <div
        key={step}
        style={{
          ...styles.stepContainer,
          animation: `slideIn${direction === "next" ? "Right" : "Left"} 300ms ease-out`,
        }}
      >
        {step === 1 && (
          <StepGenres
            selectedGenres={selectedGenres}
            onToggle={toggleGenre}
            onContinue={handleNextStep}
          />
        )}

        {step === 2 && (
          <StepSwipe
            cards={onboardingCards}
            cardIndex={cardIndex}
            onLike={() => handleSwipe("like")}
            onDislike={() => handleSwipe("dislike")}
            onSkip={handleSkipCard}
          />
        )}

        {step === 3 && (
          <StepProfile
            author={author}
            director={director}
            onAuthorChange={setAuthor}
            onDirectorChange={setDirector}
            onFinish={handleFinish}
            saving={saving}
          />
        )}
      </div>
    </div>
  )
}

function StepGenres({ selectedGenres, onToggle, onContinue }) {
  const canContinue = selectedGenres.length > 0
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h1 style={styles.title}>¿Qué tipo de contenido te gusta?</h1>
      <p style={styles.subtitle}>
        Selecciona al menos un género para que podamos recomendarte contenido
        personalizado.
      </p>

      <div style={styles.genreGrid}>
        {GENRES.map((genre) => {
          const active = selectedGenres.includes(genre)
          return (
            <button
              key={genre}
              onClick={() => onToggle(genre)}
              style={{
                ...styles.chip,
                ...(active ? styles.chipActive : {}),
              }}
            >
              {genre}
            </button>
          )
        })}
      </div>

      <button
        onClick={onContinue}
        disabled={!canContinue}
        style={{
          ...styles.button,
          ...styles.buttonPrimary,
          ...(!canContinue ? styles.buttonDisabled : {}),
        }}
      >
        Continuar
      </button>
    </div>
  )
}

function StepSwipe({ cards, cardIndex, onLike, onDislike, onSkip }) {
  const card = cards[cardIndex]
  if (!card) return null

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <button onClick={onSkip} style={styles.skipButton}>
        Saltar
      </button>

      <p style={styles.progressText}>
        {cardIndex + 1} de {cards.length} tarjetas
      </p>

      <div style={styles.card}>
        <img
          src={card.cover}
          alt={card.title}
          style={styles.cardCover}
          onError={(e) => {
            e.target.style.display = "none"
          }}
        />
        <div style={styles.cardBody}>
          <h2 style={styles.cardTitle}>{card.title}</h2>
          <div style={styles.cardMeta}>
            <span>{"⭐"} {card.rating}</span>
            <span>{"·"}</span>
            <span>{card.type === "movie" ? "Película" : "Libro"}</span>
          </div>
          <div style={styles.cardGenres}>
            {card.genres.map((g) => (
              <span key={g} style={styles.genreTag}>
                {g}
              </span>
            ))}
          </div>
          <p style={styles.cardSynopsis}>{card.synopsis}</p>
        </div>
      </div>

      <div style={styles.actionsRow}>
        <button
          onClick={onDislike}
          style={{
            ...styles.actionButton,
            ...styles.actionButtonDislike,
          }}
          aria-label="No me interesa"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <button
          onClick={onLike}
          style={{
            ...styles.actionButton,
            ...styles.actionButtonLike,
          }}
          aria-label="Me gusta"
        >
          <span className="material-symbols-outlined filled">favorite</span>
        </button>
      </div>
    </div>
  )
}

function StepProfile({
  author,
  director,
  onAuthorChange,
  onDirectorChange,
  onFinish,
  saving,
}) {
  const [focusField, setFocusField] = useState(null)

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h1 style={styles.title}>Casi listo</h1>
      <p style={styles.subtitle}>
        Cuéntanos un poco más sobre tus preferencias (opcional).
      </p>

      <label style={styles.label}>¿Algún autor favorito?</label>
      <input
        type="text"
        value={author}
        onChange={(e) => onAuthorChange(e.target.value)}
        placeholder="ej. Gabriel García Márquez"
        style={{
          ...styles.input,
          ...(focusField === "author" ? styles.inputFocus : {}),
        }}
        onFocus={() => setFocusField("author")}
        onBlur={() => setFocusField(null)}
      />

      <div style={styles.spacer} />

      <label style={styles.label}>¿Algún director favorito?</label>
      <input
        type="text"
        value={director}
        onChange={(e) => onDirectorChange(e.target.value)}
        placeholder="ej. Christopher Nolan"
        style={{
          ...styles.input,
          ...(focusField === "director" ? styles.inputFocus : {}),
        }}
        onFocus={() => setFocusField("director")}
        onBlur={() => setFocusField(null)}
      />

      <div style={{ height: 40 }} />

      <button
        onClick={onFinish}
        disabled={saving}
        style={{
          ...styles.button,
          ...styles.buttonPrimary,
          ...(saving ? styles.buttonDisabled : {}),
        }}
      >
        {saving ? "Guardando..." : "Empezar a descubrir →"}
      </button>
    </div>
  )
}
