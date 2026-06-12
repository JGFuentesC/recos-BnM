import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { FeedProvider } from './contexts/FeedContext'
import Login from './pages/Login'
import LibraryPlaceholder from './pages/LibraryPlaceholder'
import Feed from './pages/Feed'
import MockFeed from './pages/MockFeed'
import Onboarding from './pages/Onboarding'
import Register from './pages/Register'
import About from './pages/About'
import './App.css'

function App() {
  return (
    <FeedProvider>
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
              <Feed />
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
        <Route path="/about" element={<About />} />
        <Route path="/mock-feed" element={<MockFeed />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </FeedProvider>
  )
}

export default App
