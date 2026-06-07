import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'
import './Onboarding.css'

const GENRES = [
  "Acción", "Drama", "Comedia", "Terror", "Romance",
  "Ciencia Ficción", "Misterio", "Documentales", "Fantasía",
  "Thriller", "Biografías", "Historia",
]

const CARDS = [
  {
    id: 'genre_scifi',
    title: 'Ciencia Ficcion',
    genres: ['Ciencia Ficcion'],
    chips: ['Futurismo', 'IA'],
    description: 'Desde distopias neon hasta viajes estelares que desafian el tiempo.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'genre_fantasy',
    title: 'Fantasia Epica',
    genres: ['Fantasia'],
    chips: ['Aventura', 'Magia'],
    description: 'Mundos perdidos, magia antigua y batallas que cambian reinos.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'genre_thriller',
    title: 'Novela Negra',
    genres: ['Thriller'],
    chips: ['Misterio', 'Crimen'],
    description: 'Suspenso urbano, detectives y crimen con atmosfera intensa.',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'genre_drama',
    title: 'Drama Intimo',
    genres: ['Drama'],
    chips: ['Autor', 'Humano'],
    description: 'Historias profundas que se quedan contigo despues de los creditos.',
    image: 'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'genre_history',
    title: 'Historico',
    genres: ['Historico'],
    chips: ['Biografico', 'Clasico'],
    description: 'Narrativas de epocas clave con personajes que marcaron su tiempo.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'genre_horror',
    title: 'Terror',
    genres: ['Terror'],
    chips: ['Oscuro', 'Psicologico'],
    description: 'Tension progresiva y escenas que no se olvidan facilmente.',
    image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'genre_romance',
    title: 'Romance',
    genres: ['Romance'],
    chips: ['Conexion', 'Feel Good'],
    description: 'Quimica, decisiones y emociones en historias memorables.',
    image: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'genre_documentary',
    title: 'Documental',
    genres: ['Documental'],
    chips: ['Real', 'Investigacion'],
    description: 'Ideas y sociedad contadas con mirada contemporanea.',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
  },
]

export default function Onboarding() {
  const { currentUser, logout, setUserProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedGenres, setSelectedGenres] = useState([])
  const [author, setAuthor] = useState("")
  const [director, setDirector] = useState("")
  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [likedGenres, setLikedGenres] = useState(new Set())

  const current = CARDS[index]
  const progress = useMemo(() => {
    if (step === 1) return 10
    if (step === 3) return 90
    return Math.round(10 + (index / CARDS.length) * 80)
  }, [step, index])

  async function saveSwipe(card, action) {
    await addDoc(collection(db, 'swipes'), {
      userId: currentUser.uid,
      contentId: card.id,
      contentType: 'onboarding',
      type: 'onboarding',
      action,
      timestamp: serverTimestamp(),
    })
  }

  async function completeOnboarding(skipped = false) {
    const genres = selectedGenres.length > 0 ? selectedGenres : Array.from(likedGenres)
    await updateDoc(doc(db, 'users', currentUser.uid), {
      'prefs.genres': genres,
      'prefs.authors': author.trim() ? [author.trim()] : [],
      'prefs.directors': director.trim() ? [director.trim()] : [],
      'prefs.cold_start_done': true,
      onboardingCompletedAt: serverTimestamp(),
      onboardingSkipped: skipped,
    })

    setUserProfile((previous) => ({
      ...(previous ?? {}),
      prefs: {
        ...(previous?.prefs ?? {}),
        genres,
        authors: author.trim() ? [author.trim()] : [],
        directors: director.trim() ? [director.trim()] : [],
        cold_start_done: true,
      },
      onboardingSkipped: skipped,
    }))

    setStatus('Calibracion completada y guardada en Firestore.')
    navigate('/feed')
  }

  async function handleAction(action) {
    if (!current) {
      return
    }

    setError('')
    try {
      await saveSwipe(current, action)
      if (action === 'like') {
        setLikedGenres((prev) => {
          const next = new Set(prev)
          current.genres.forEach((g) => next.add(g))
          return next
        })
      }

      const nextIndex = index + 1
      if (nextIndex >= CARDS.length) {
        setStep(3)
        return
      }

      setIndex(nextIndex)
    } catch {
      setError('Error al guardar swipe. Revisa Firestore y reglas.')
    }
  }

  async function handleSkip() {
    setError('')
    try {
      await completeOnboarding(true)
    } catch {
      setError('No se pudo completar onboarding con skip.')
    }
  }

  function handleContinueToSwipe() {
    setStep(2)
  }

  function toggleGenre(genre) {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }

  return (
    <div className="ob-shell">
      {step === 2 && (
        <header className="ob-topbar">
          <div className="ob-brand">Match&Read</div>
          <button className="ob-skip" onClick={handleSkip}>Saltar</button>
        </header>
      )}

      <div className="ob-progress-track">
        <div className="ob-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <main className="ob-content">
        {step === 1 && (
          <StepGenres
            genres={GENRES}
            selected={selectedGenres}
            onToggle={toggleGenre}
            onContinue={handleContinueToSwipe}
          />
        )}

        {step === 2 && (
          <>
            <h1 className="ob-title">Personaliza tu feed</h1>
            <p className="ob-subtitle">Desliza para indicarnos que generos y estilos te apasionan.</p>

            {current ? (
              <article className="ob-card">
                <img className="ob-card-image" src={current.image} alt={current.title} />
                <div className="ob-overlay" />
                <div className="ob-card-body">
                  <div className="ob-chips">
                    {current.chips.map((chip) => (
                      <span key={chip} className="ob-chip">{chip}</span>
                    ))}
                  </div>
                  <h2 className="ob-card-title">{current.title}</h2>
                  <p className="ob-card-description">{current.description}</p>
                </div>
              </article>
            ) : (
              <p className="ob-empty">Sin tarjetas disponibles.</p>
            )}

            <section className="ob-actions">
              <button className="ob-btn ob-btn-muted" onClick={() => handleAction('dislike')}>
                ✕
              </button>
              <button className="ob-btn ob-btn-like" onClick={() => handleAction('like')}>
                ♡
              </button>
              <button className="ob-btn ob-btn-muted" onClick={() => handleAction('like')}>
                ⌑
              </button>
            </section>

            <div className="ob-footline">TU PROXIMO MATCH ESTA A UN SWIPE.</div>
            <div className="ob-footnote">Calibrando tus gustos...</div>

            <button className="ob-logout" onClick={logout}>Cerrar sesion</button>

            {status && <p className="status">{status}</p>}
            {error && <p className="error">{error}</p>}
          </>
        )}

        {step === 3 && (
          <StepProfile
            author={author}
            director={director}
            onAuthorChange={setAuthor}
            onDirectorChange={setDirector}
            onFinish={() => completeOnboarding(false)}
          />
        )}
      </main>
    </div>
  )
}

function StepGenres({ genres, selected, onToggle, onContinue }) {
  const canContinue = selected.length > 0
  return (
    <div className="step-wrapper">
      <h1 className="step-title">¿Qué tipo de contenido te gusta?</h1>
      <p className="step-subtitle">
        Selecciona al menos un género para que podamos recomendarte contenido personalizado.
      </p>
      <div className="genre-grid">
        {genres.map((genre) => {
          const active = selected.includes(genre)
          return (
            <button
              key={genre}
              className={`genre-chip${active ? ' genre-chip--active' : ''}`}
              onClick={() => onToggle(genre)}
            >
              {genre}
            </button>
          )
        })}
      </div>
      <button
        className={`step-btn step-btn--primary${!canContinue ? ' step-btn--disabled' : ''}`}
        disabled={!canContinue}
        onClick={onContinue}
      >
        Continuar
      </button>
    </div>
  )
}

function StepProfile({ author, director, onAuthorChange, onDirectorChange, onFinish }) {
  return (
    <div className="step-wrapper">
      <h1 className="step-title">Casi listo</h1>
      <p className="step-subtitle">
        Cuéntanos un poco más sobre tus preferencias (opcional).
      </p>
      <label className="step-label">¿Algún autor favorito?</label>
      <input
        type="text"
        className="step-input"
        value={author}
        onChange={(e) => onAuthorChange(e.target.value)}
        placeholder="ej. Gabriel García Márquez"
      />
      <div className="step-spacer" />
      <label className="step-label">¿Algún director favorito?</label>
      <input
        type="text"
        className="step-input"
        value={director}
        onChange={(e) => onDirectorChange(e.target.value)}
        placeholder="ej. Christopher Nolan"
      />
      <div className="step-spacer-large" />
      <button className="step-btn step-btn--primary" onClick={onFinish}>
        Empezar a descubrir →
      </button>
    </div>
  )
}
