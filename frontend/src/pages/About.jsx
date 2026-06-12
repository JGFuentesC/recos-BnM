import { useNavigate } from 'react-router-dom'
import styles from './About.module.css'

const TEAM = [
  { name: 'Andrés González', role: 'Frontend — Auth & PWA' },
  { name: 'Juan Carlos Macías', role: 'Frontend — Search & Onboarding' },
  { name: 'Luis Téllez', role: 'Backend — API & Rutas' },
  { name: 'Héctor Morales', role: 'QA — Testing & Backend' },
  { name: 'Monserrat Miranda', role: 'Frontend — SwipeDeck & Onboarding' },
  { name: 'Marina García', role: 'Frontend — DetailSheet' },
  { name: 'Diana Álvarez', role: 'Frontend — Library & BottomNav' },
  { name: 'Germán Pacheco', role: 'CI/CD — Cloud Run & Firebase Hosting' },
  { name: 'Israel Pérez', role: 'Firestore — Reglas & Índices' },
  { name: 'Manuel', role: 'Ingest — TMDB & Google Books Pipeline' },
  { name: 'Christian Ruiz', role: 'Backend — Endpoints de compartir' },
  { name: 'Ulises', role: 'QA — Coordinación & Pruebas físicas' },
  { name: 'Edgar Coronel Navarrete', role: 'PM — Coordinación & About' },
]

export default function About() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => navigate(-1)}
          aria-label="Regresar"
        >
          ←
        </button>
        <h1 className={styles.title}>Acerca de Recos BnM</h1>
      </header>

      <main className={styles.content}>
        <p className={styles.description}>
          Plataforma de recomendación personalizada de películas y libros.
          Desarrollada como proyecto final — ITAM 2026.
        </p>

        {/* Atribución TMDB — requerida por licencia */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Datos de películas</h2>
          <img
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_1-8ba2ac31f354005783fab473602c34c3f4fd207ac81b7ee3f432b435d95160de.svg"
            alt="The Movie Database (TMDB)"
            className={styles.tmdbLogo}
          />
          <p className={styles.attributionText}>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
          <p className={styles.attributionText}>
            Los datos de películas, calificaciones y disponibilidad de streaming son
            proporcionados por{' '}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              The Movie Database (TMDB)
            </a>
            .
          </p>
        </section>

        {/* Google Books */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Datos de libros</h2>
          <p className={styles.attributionText}>
            Los datos de libros, portadas y sinopsis son proporcionados por la{' '}
            <a
              href="https://books.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Google Books API
            </a>
            .
          </p>
        </section>

        {/* Equipo */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Equipo</h2>
          <ul className={styles.teamList}>
            {TEAM.map(({ name, role }) => (
              <li key={name} className={styles.teamItem}>
                <span className={styles.teamName}>{name}</span>
                <span className={styles.teamRole}>{role}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className={styles.version}>Recos BnM · Sprint 1 · ITAM 2026</p>
      </main>
    </div>
  )
}
