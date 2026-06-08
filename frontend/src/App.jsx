import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import FeedPlaceholder from './pages/FeedPlaceholder'
import Login from './pages/Login'
import LibraryPlaceholder from './pages/LibraryPlaceholder'
import MockFeed from './pages/MockFeed'
import Onboarding from './pages/Onboarding'
import Register from './pages/Register'
import './App.css'

function App() {
  return (
    // TODO: envolver con <FeedProvider> cuando Juan Carlos entregue FeedContext.jsx
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <FeedPlaceholder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <LibraryPlaceholder />
          </ProtectedRoute>
        }
      />
      <Route path="/mock-feed" element={<MockFeed />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
