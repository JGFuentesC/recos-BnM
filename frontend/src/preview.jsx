import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import './index.css'
import './App.css'
import Library from './pages/Library'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MemoryRouter initialEntries={['/library']}>
      <Library />
    </MemoryRouter>
  </StrictMode>
)
