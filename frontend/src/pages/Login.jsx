import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { signInWithGoogle, signUpWithEmail } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  async function handleGoogle() {
    setError('')
    setStatus('Iniciando Google Sign-In...')
    try {
      await signInWithGoogle()
      navigate('/onboarding')
    } catch {
      setStatus('')
      setError('No se pudo iniciar con Google. Revisa dominios autorizados.')
    }
  }

  async function handleEmail(e) {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Escribe tu nombre.')
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Correo invalido.')
      return
    }

    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres.')
      return
    }

    setStatus('Creando cuenta...')

    try {
      await signUpWithEmail(name.trim(), email.trim(), password)
      navigate('/onboarding')
    } catch {
      setStatus('')
      setError('No se pudo registrar. Verifica Auth y Firestore.')
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
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            Registrarse con email
          </button>
        </form>

        {status && <p className="status">{status}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  )
}
