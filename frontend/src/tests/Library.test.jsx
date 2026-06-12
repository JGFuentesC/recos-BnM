import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Library from '../pages/Library'

// BottomNav usa useNavigate/useLocation — necesita contexto de router
function renderLibrary() {
  return render(
    <MemoryRouter initialEntries={['/library']}>
      <Library />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
  vi.spyOn(window, 'confirm').mockReturnValue(true)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('Library', () => {
  it('renderiza los 4 ítems mock por defecto', () => {
    renderLibrary()
    expect(screen.getByText('Inception')).toBeDefined()
    expect(screen.getByText('The Dark Knight')).toBeDefined()
    expect(screen.getByText('Sapiens')).toBeDefined()
    expect(screen.getByText('El Hobbit')).toBeDefined()
  })

  it('filtro tipo "Películas" solo muestra movies', () => {
    renderLibrary()
    fireEvent.click(screen.getByRole('button', { name: 'Películas' }))
    expect(screen.getByText('Inception')).toBeDefined()
    expect(screen.getByText('The Dark Knight')).toBeDefined()
    expect(screen.queryByText('Sapiens')).toBeNull()
    expect(screen.queryByText('El Hobbit')).toBeNull()
  })

  it('filtro listName "Para el finde" solo muestra ese ítem', () => {
    renderLibrary()
    fireEvent.click(screen.getByRole('button', { name: 'Para el finde' }))
    expect(screen.getByText('The Dark Knight')).toBeDefined()
    expect(screen.queryByText('Inception')).toBeNull()
    expect(screen.queryByText('Sapiens')).toBeNull()
    expect(screen.queryByText('El Hobbit')).toBeNull()
  })

  it('filtros combinados sin resultados muestran estado vacío', () => {
    renderLibrary()
    // "Para el finde" solo tiene una movie → activar "Libros" deja 0 resultados
    fireEvent.click(screen.getByRole('button', { name: 'Para el finde' }))
    fireEvent.click(screen.getByRole('button', { name: 'Libros' }))
    expect(screen.getByText('Nada por aquí')).toBeDefined()
    expect(screen.queryByText('The Dark Knight')).toBeNull()
  })

  it('eliminar un ítem lo quita de la lista', () => {
    renderLibrary()
    // Abrir el menú del primer ítem (Inception, índice 0 en el orden de los mocks)
    const menuButtons = screen.getAllByRole('button', { name: 'Opciones' })
    fireEvent.click(menuButtons[0])
    fireEvent.click(screen.getByText('Eliminar'))
    // window.confirm retorna true (ver beforeEach) → onDelete se ejecuta
    expect(screen.queryByText('Inception')).toBeNull()
    // El resto de ítems permanece
    expect(screen.getByText('The Dark Knight')).toBeDefined()
    expect(screen.getByText('Sapiens')).toBeDefined()
    expect(screen.getByText('El Hobbit')).toBeDefined()
  })
})
