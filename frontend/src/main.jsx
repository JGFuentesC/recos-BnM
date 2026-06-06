import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { FeedProvider } from "./contexts/FeedContext"
import App from "./App"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FeedProvider>
          <App />
        </FeedProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
