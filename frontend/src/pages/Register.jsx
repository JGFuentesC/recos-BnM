import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { loginWithGoogle, register } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  async function handleGoogle() {
    setError('')
    setStatus('Registrando con Google...')
    try {
      await loginWithGoogle()
      navigate('/onboarding')
    } catch {
      setStatus('')
      setError('No se pudo registrar con Google. Revisa dominios autorizados.')
    }
  }

  async function handleRegister(event) {
    event.preventDefault()
    setError('')

    if (!displayName.trim()) {
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

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden.')
      return
    }

    setStatus('Creando cuenta...')

    try {
      await register(email.trim(), password, displayName.trim())
      navigate('/onboarding')
    } catch {
      setStatus('')
      setError('No se pudo registrar. Verifica Auth y Firestore.')
    }
  }

  return (
    <div className="screen">
      <div className="card">
        <h1>Crear cuenta</h1>
        <p className="muted">HU1.1 - Registro</p>

        <button className="btn primary" onClick={handleGoogle}>
          Registrarse con Google
        </button>

        <form onSubmit={handleRegister} className="form">
          <input
            placeholder="Nombre"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
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
          <input
            placeholder="Confirmar contrasena"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="btn" type="submit">
            Registrarse con email
          </button>
        </form>

        <p className="muted" style={{ marginTop: 10 }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
        </p>

        {status && <p className="status">{status}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  )
}
