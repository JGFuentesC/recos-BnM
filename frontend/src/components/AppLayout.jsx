import BottomNav from './BottomNav'

export default function AppLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 72 }}>
      {children}
      <BottomNav />
    </div>
  )
}
