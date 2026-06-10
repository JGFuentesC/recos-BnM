import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import ContentCard from "../components/ContentCard"

const baseProps = {
  contentId: "abc123",
  title: "Inception",
  cover: "https://example.com/inception.jpg",
  genres: ["Ciencia Ficción", "Thriller", "Acción"],
  rating: 8.8,
  synopsis: "Un ladrón que roba secretos corporativos.",
  type: "movie",
  onClick: vi.fn(),
}

describe("ContentCard", () => {
  it("renderiza correctamente con props completas", () => {
    render(<ContentCard {...baseProps} />)
    expect(screen.getByText("Inception")).toBeDefined()
    expect(screen.getByText("⭐ 8.8")).toBeDefined()
    expect(screen.getByText("Un ladrón que roba secretos corporativos.")).toBeDefined()
    expect(screen.getByAltText("Inception")).toBeDefined()
  })

  it("renderiza placeholder si falta cover", () => {
    render(<ContentCard {...baseProps} cover={null} />)
    expect(screen.queryByAltText("Inception")).toBeNull()
    // título aparece en el span del placeholder y en el h2 (ambos son válidos)
    expect(screen.getAllByText("Inception").length).toBeGreaterThanOrEqual(1)
  })

  it("no rompe con géneros vacíos y rating cero", () => {
    render(<ContentCard {...baseProps} genres={[]} rating={0} />)
    expect(screen.getByText("Inception")).toBeDefined()
    expect(screen.getByText("⭐ 0.0")).toBeDefined()
  })

  it("muestra badge 🎬 Película para type movie", () => {
    render(<ContentCard {...baseProps} type="movie" />)
    expect(screen.getByText("🎬 Película")).toBeDefined()
  })

  it("muestra badge 📚 Libro para type book", () => {
    render(<ContentCard {...baseProps} type="book" />)
    expect(screen.getByText("📚 Libro")).toBeDefined()
  })

  it("muestra máximo 3 géneros", () => {
    render(<ContentCard {...baseProps} genres={["Drama", "Comedia", "Terror", "Romance"]} />)
    expect(screen.getByText("Drama")).toBeDefined()
    expect(screen.getByText("Comedia")).toBeDefined()
    expect(screen.getByText("Terror")).toBeDefined()
    expect(screen.queryByText("Romance")).toBeNull()
  })

  it("muestra chip +N cuando hay más de 3 géneros", () => {
    render(<ContentCard {...baseProps} genres={["Drama", "Comedia", "Terror", "Romance"]} />)
    expect(screen.getByText("+1")).toBeDefined()
  })

  it("llama onClick al hacer click en la tarjeta", () => {
    const handleClick = vi.fn()
    render(<ContentCard {...baseProps} onClick={handleClick} />)
    fireEvent.click(screen.getByText("Inception"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
