import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import TabSelector from "../components/TabSelector"
import { FeedProvider } from "../contexts/FeedContext"

function renderWithFeed(ui) {
  return render(<FeedProvider>{ui}</FeedProvider>)
}

describe("TabSelector", () => {
  it("renders both tabs", () => {
    renderWithFeed(<TabSelector />)
    expect(screen.getByText("Películas")).toBeDefined()
    expect(screen.getByText("Libros")).toBeDefined()
  })

  it("has 'movie' as the default active type", () => {
    renderWithFeed(<TabSelector />)
    const movieTab = screen.getByText("Películas")
    const bookTab = screen.getByText("Libros")
    expect(movieTab.getAttribute("aria-selected")).toBe("true")
    expect(bookTab.getAttribute("aria-selected")).toBe("false")
  })

  it("changes active type when clicking 'Libros' tab", () => {
    renderWithFeed(<TabSelector />)
    const bookTab = screen.getByText("Libros")
    fireEvent.click(bookTab)
    expect(bookTab.getAttribute("aria-selected")).toBe("true")
    expect(screen.getByText("Películas").getAttribute("aria-selected")).toBe("false")
  })

  it("switches back to 'movie' when clicking Películas tab", () => {
    renderWithFeed(<TabSelector />)
    fireEvent.click(screen.getByText("Libros"))
    fireEvent.click(screen.getByText("Películas"))
    expect(screen.getByText("Películas").getAttribute("aria-selected")).toBe("true")
  })

  it("active tab has role='tab' and aria-selected attribute", () => {
    renderWithFeed(<TabSelector />)
    const tabs = screen.getAllByRole("tab")
    expect(tabs).toHaveLength(2)
    expect(tabs[0].getAttribute("aria-selected")).toBe("true")
    expect(tabs[1].getAttribute("aria-selected")).toBe("false")
  })
})
