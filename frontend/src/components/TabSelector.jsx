import { useFeed } from "../contexts/FeedContext"

const TABS = [
  { key: "movie", label: "Películas" },
  { key: "book", label: "Libros" },
]

const styles = {
  container: {
    display: "flex",
    gap: 0,
    padding: "4px",
    borderRadius: 9999,
    backgroundColor: "rgba(255,255,255,0.05)",
    margin: "0 16px",
    position: "sticky",
    top: 8,
    zIndex: 10,
  },
  tab: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: 9999,
    backgroundColor: "transparent",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "Geist, Inter, sans-serif",
    cursor: "pointer",
    transition: "all 200ms ease-out",
    minHeight: 40,
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    padding: "0 16px",
    whiteSpace: "nowrap",
  },
}

export default function TabSelector() {
  const { activeType, setActiveType } = useFeed()

  return (
    <div style={styles.container} role="tablist">
      {TABS.map((tab) => {
        const isActive = activeType === tab.key
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveType(tab.key)}
            style={{
              ...styles.tab,
              color: isActive ? "#FFFFFF" : "rgba(229,226,225,0.6)",
              backgroundColor: isActive ? "#ff571a" : "transparent",
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
