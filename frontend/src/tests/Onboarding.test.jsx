import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import Onboarding from "../pages/Onboarding"

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(() => "mock-doc-ref"),
  updateDoc: vi.fn(() => Promise.resolve()),
  serverTimestamp: vi.fn(() => "mock-timestamp"),
}))

vi.mock("../firebase/config", () => ({
  db: "mock-db",
}))

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return { ...actual, useNavigate: () => vi.fn() }
})

const mockUser = { uid: "test-uid-123", email: "test@test.com" }

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ currentUser: mockUser }),
}))

function renderOnboarding() {
  return render(
    <BrowserRouter>
      <Onboarding />
    </BrowserRouter>
  )
}

describe("Onboarding", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders step 1 (genre selection) by default", () => {
    renderOnboarding()
    expect(screen.getByText("¿Qué tipo de contenido te gusta?")).toBeDefined()
  })

  it("shows all genre chips", () => {
    renderOnboarding()
    const genres = [
      "Acción", "Drama", "Comedia", "Terror", "Romance",
      "Ciencia Ficción", "Misterio", "Documentales", "Fantasía",
      "Thriller", "Biografías", "Historia",
    ]
    genres.forEach((g) => {
      expect(screen.getByText(g)).toBeDefined()
    })
  })

  it("disables 'Continuar' button when no genres selected", () => {
    renderOnboarding()
    const button = screen.getByText("Continuar")
    expect(button.disabled).toBe(true)
  })

  it("enables 'Continuar' button after selecting a genre", () => {
    renderOnboarding()
    fireEvent.click(screen.getByText("Ciencia Ficción"))
    const button = screen.getByText("Continuar")
    expect(button.disabled).toBe(false)
  })

  it("allows toggling genre selection on and off", () => {
    renderOnboarding()
    const chip = screen.getByText("Drama")
    fireEvent.click(chip)
    expect(screen.getByText("Continuar").disabled).toBe(false)
    fireEvent.click(chip)
    expect(screen.getByText("Continuar").disabled).toBe(true)
  })

  it("progresses to step 2 after selecting a genre and clicking continue", () => {
    renderOnboarding()
    fireEvent.click(screen.getByText("Ciencia Ficción"))
    fireEvent.click(screen.getByText("Continuar"))
    expect(screen.getByText(/1 de 5 tarjetas/)).toBeDefined()
  })

  it("shows progress bar", () => {
    renderOnboarding()
    const progressFills = document.querySelectorAll(
      "[style*='background-color: rgb(255, 87, 26)']"
    )
    expect(progressFills.length).toBeGreaterThan(0)
  })

  it("allows skipping cards in step 2", () => {
    renderOnboarding()
    fireEvent.click(screen.getByText("Ciencia Ficción"))
    fireEvent.click(screen.getByText("Continuar"))
    fireEvent.click(screen.getByText("Saltar"))
    expect(screen.getByText(/2 de 5 tarjetas/)).toBeDefined()
  })

  it("shows like and dislike buttons in step 2", () => {
    renderOnboarding()
    fireEvent.click(screen.getByText("Ciencia Ficción"))
    fireEvent.click(screen.getByText("Continuar"))
    expect(screen.getByLabelText("Me gusta")).toBeDefined()
    expect(screen.getByLabelText("No me interesa")).toBeDefined()
  })

  it("liking all cards advances to step 3", async () => {
    renderOnboarding()
    fireEvent.click(screen.getByText("Ciencia Ficción"))
    fireEvent.click(screen.getByText("Continuar"))

    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByLabelText("Me gusta"))
    }

    await waitFor(() => {
      expect(screen.getByText("Casi listo")).toBeDefined()
    })
  })

  it("renders optional author and director inputs in step 3", async () => {
    renderOnboarding()
    fireEvent.click(screen.getByText("Ciencia Ficción"))
    fireEvent.click(screen.getByText("Continuar"))
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByLabelText("Me gusta"))
    }

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("ej. Gabriel García Márquez")
      ).toBeDefined()
      expect(
        screen.getByPlaceholderText("ej. Christopher Nolan")
      ).toBeDefined()
    })
  })

  it("shows 'Empezar a descubrir' button in step 3", async () => {
    renderOnboarding()
    fireEvent.click(screen.getByText("Ciencia Ficción"))
    fireEvent.click(screen.getByText("Continuar"))
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByLabelText("Me gusta"))
    }

    await waitFor(() => {
      expect(screen.getByText("Empezar a descubrir →")).toBeDefined()
    })
  })

  it("renders loading state when no user is provided", () => {
    vi.mocked(vi.fn()).mockReturnValue({ currentUser: null })
    renderOnboarding()
    expect(screen.getByText("Cargando...")).toBeDefined()
  })
})
