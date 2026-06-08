import TabSelector from '../components/TabSelector'
import SwipeDeck from '../components/SwipeDeck'
import { useFeed } from '../contexts/FeedContext'

export default function Feed() {
  const { activeType } = useFeed()

  return (
    <div style={s.page}>
      <TabSelector />
      {/*
        key={activeType} desmonta y remonta SwipeDeck cuando el usuario
        cambia de tab, reseteando todo el estado interno del deck.
      */}
      <SwipeDeck key={activeType} />
    </div>
  )
}

const s = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#1a1a2e',
    paddingTop: 8,
  },
}
