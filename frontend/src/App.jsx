import { Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Onboarding from "./pages/Onboarding"

export default function App() {
  return (
    <Routes>
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
            <div
              style={{
                minHeight: "100dvh",
                backgroundColor: "#0F0E17",
                color: "#FFFFFE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Inter, sans-serif",
              }}
            >
              <p>Feed (Monserrat)</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <div
            style={{
              minHeight: "100dvh",
              backgroundColor: "#0F0E17",
              color: "#A7A9BE",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Inter, sans-serif",
              gap: 16,
              padding: 24,
            }}
          >
            <h2 style={{ color: "#FFFFFE", fontFamily: "Playfair Display, serif" }}>
              Iniciar sesión
            </h2>
            <p>Andrés: implementar Login.jsx aquí</p>
          </div>
        }
      />
      <Route path="*" element={<Navigate to="/onboarding" replace />} />
    </Routes>
  )
}
