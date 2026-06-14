import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { currentUser, loading, loginWithEmail, loginWithGoogle, refreshUserProfile, userProfile } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  function resolvePostAuthRoute(profile) {
    return profile?.prefs?.cold_start_done ? '/feed' : '/onboarding'
  }

  useEffect(() => {
    let cancelled = false

    async function redirectIfAlreadyAuthenticated() {
      if (loading || !currentUser) return

      try {
        const freshProfile = await refreshUserProfile(currentUser.uid)

        if (!cancelled) {
          navigate(resolvePostAuthRoute(freshProfile ?? userProfile), { replace: true })
        }
      } catch {
        if (!cancelled) {
          navigate('/feed', { replace: true })
        }
      }
    }

    redirectIfAlreadyAuthenticated()

    return () => {
      cancelled = true
    }
  }, [currentUser, loading, navigate, refreshUserProfile, userProfile])

  function mapErrorMessage(code) {
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
      return 'Correo o contraseña incorrectos.'
    }

    if (code === 'auth/invalid-email') {
      return 'El correo no tiene formato valido.'
    }

    if (code === 'auth/popup-closed-by-user') {
      return 'Cerraste la ventana de Google antes de completar el acceso.'
    }

    return 'No se pudo iniciar sesion. Intenta de nuevo.'
  }

  async function handleGoogle() {
    setError('')
    setStatus('Iniciando Google Sign-In...')
    try {
      const firebaseUser = await loginWithGoogle()
      const freshProfile = await refreshUserProfile(firebaseUser.uid)
      navigate(resolvePostAuthRoute(freshProfile ?? userProfile))
    } catch (firebaseError) {
      setStatus('')
      setError(mapErrorMessage(firebaseError?.code))
    }
  }

  async function handleEmail(e) {
    e.preventDefault()
    setError('')

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Correo invalido.')
      return
    }

    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres.')
      return
    }

    setStatus('Iniciando sesion...')

    try {
      const firebaseUser = await loginWithEmail(email.trim(), password)
      const freshProfile = await refreshUserProfile(firebaseUser.uid)
      navigate(resolvePostAuthRoute(freshProfile ?? userProfile))
    } catch (firebaseError) {
      setStatus('')
      setError(mapErrorMessage(firebaseError?.code))
    }
  }

  return (
    <div className="screen">
      <div className="card">
        <h1>Match&Read</h1>
        <p className="muted">HU1.1 - Registro simplificado</p>

        <button className="btn primary" onClick={handleGoogle}>
          Continuar con Google
        </button>

        <form onSubmit={handleEmail} className="form">
          <input
            placeholder="Correo"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Contrasena"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn" type="submit">
            Iniciar sesion con email
          </button>
        </form>

        <p className="muted" style={{ marginTop: 10 }}>
          ¿No tienes cuenta? <Link to="/register">Registrate</Link>
        </p>

        {status && <p className="status">{status}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  )
}
