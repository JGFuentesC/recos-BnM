import { createContext, useContext, useState, useCallback } from "react"

const FeedContext = createContext(null)

export function FeedProvider({ children }) {
  const [activeType, setActiveType] = useState("movie")

  const value = { activeType, setActiveType: useCallback(setActiveType, []) }

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>
}

export function useFeed() {
  const ctx = useContext(FeedContext)
  if (!ctx) throw new Error("useFeed must be used within a FeedProvider")
  return ctx
}
