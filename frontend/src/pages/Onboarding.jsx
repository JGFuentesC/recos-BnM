import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'

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
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [likedGenres, setLikedGenres] = useState(new Set())

  const current = CARDS[index]
  const progress = useMemo(() => Math.round((index / CARDS.length) * 100), [index])

  async function saveSwipe(card, action) {
    await addDoc(collection(db, 'swipes'), {
      userId: user.uid,
      contentId: card.id,
      contentType: 'onboarding',
      type: 'onboarding',
      action,
      timestamp: serverTimestamp(),
    })
  }

  async function completeOnboarding(skipped = false) {
    await updateDoc(doc(db, 'users', user.uid), {
      'prefs.genres': Array.from(likedGenres),
      'prefs.authors': [],
      'prefs.directors': [],
      'prefs.cold_start_done': true,
      onboardingCompletedAt: serverTimestamp(),
      onboardingSkipped: skipped,
    })

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
        await completeOnboarding(false)
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

  return (
    <div className="ob-shell">
      <header className="ob-topbar">
        <div className="ob-brand">Match&Read</div>
        <button className="ob-skip" onClick={handleSkip}>Saltar</button>
      </header>

      <div className="ob-progress-track">
        <div className="ob-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <main className="ob-content">
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
      </main>
    </div>
  )
}
