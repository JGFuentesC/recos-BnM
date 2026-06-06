import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { currentUser, loading, userProfile } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="center">Cargando sesion...</div>
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  const coldStartDone = userProfile?.prefs?.cold_start_done
  if (coldStartDone === false && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  if (coldStartDone === true && location.pathname === '/onboarding') {
    return <Navigate to="/feed" replace />
  }

  return children
}
