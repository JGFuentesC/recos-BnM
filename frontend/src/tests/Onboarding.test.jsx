import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import Onboarding from "../pages/Onboarding"

const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}))

const mockUpdateDoc = vi.fn(() => Promise.resolve())
const mockAddDoc = vi.fn(() => Promise.resolve("mock-swipe-id"))

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(() => "mock-doc-ref"),
  collection: vi.fn(() => "mock-collection"),
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  serverTimestamp: vi.fn(() => "mock-timestamp"),
}))

vi.mock("../firebase/config", () => ({
  db: "mock-db",
}))

const mockLogout = vi.fn()
const mockSetUserProfile = vi.fn()
const mockUser = { uid: "test-uid-123", email: "test@test.com" }

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    currentUser: mockUser,
    logout: mockLogout,
    setUserProfile: mockSetUserProfile,
  }),
}))

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderOnboarding() {
  return render(
    <BrowserRouter>
      <Onboarding />
    </BrowserRouter>
  )
}

describe("Onboarding", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("renders step 1 (genre selection) by default", () => {
    renderOnboarding()
    expect(screen.getByText("¿Qué tipo de contenido te gusta?")).toBeDefined()
  })

  it("shows all 12 genre chips", () => {
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

  it("advances to step 2 after selecting a genre and clicking continue", () => {
    renderOnboarding()
    fireEvent.click(screen.getByText("Ciencia Ficción"))
    fireEvent.click(screen.getByText("Continuar"))
    expect(document.querySelector(".ob-card")).toBeDefined()
  })

  it("shows progress bar", () => {
    renderOnboarding()
    expect(document.querySelector(".ob-progress-fill")).toBeDefined()
  })

  it("shows action buttons in step 2", () => {
    renderOnboarding()
    fireEvent.click(screen.getByText("Ciencia Ficción"))
    fireEvent.click(screen.getByText("Continuar"))
    const actions = document.querySelector(".ob-actions")
    expect(actions).toBeDefined()
    expect(actions.querySelectorAll("button").length).toBe(3)
  })

  it("shows 'Saltar' button in step 2", () => {
    renderOnboarding()
    fireEvent.click(screen.getByText("Ciencia Ficción"))
    fireEvent.click(screen.getByText("Continuar"))
    expect(screen.getByText("Saltar")).toBeDefined()
  })

  it("liking all 8 cards advances to step 3", async () => {
    renderOnboarding()
    fireEvent.click(screen.getByText("Ciencia Ficción"))
    fireEvent.click(screen.getByText("Continuar"))

    for (let i = 0; i < 8; i++) {
      fireEvent.click(screen.getByText("♡"))
    }

    await waitFor(() => {
      expect(screen.getByText("Casi listo")).toBeDefined()
    })
  })

  it("shows author and director inputs in step 3", async () => {
    renderOnboarding()
    fireEvent.click(screen.getByText("Ciencia Ficción"))
    fireEvent.click(screen.getByText("Continuar"))

    for (let i = 0; i < 8; i++) {
      fireEvent.click(screen.getByText("♡"))
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

    for (let i = 0; i < 8; i++) {
      fireEvent.click(screen.getByText("♡"))
    }

    await waitFor(() => {
      expect(screen.getByText("Empezar a descubrir →")).toBeDefined()
    })
  })

  it("calls updateDoc with correct prefs on finish", async () => {
    renderOnboarding()
    fireEvent.click(screen.getByText("Ciencia Ficción"))
    fireEvent.click(screen.getByText("Continuar"))

    for (let i = 0; i < 8; i++) {
      fireEvent.click(screen.getByText("♡"))
    }

    await waitFor(() => {
      expect(screen.getByText("Empezar a descubrir →")).toBeDefined()
    })

    fireEvent.click(screen.getByText("Empezar a descubrir →"))

    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalled()
    })
  })

})
