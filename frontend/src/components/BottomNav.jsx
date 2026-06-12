import { useNavigate, useLocation } from 'react-router-dom'

const TABS = [
  { path: '/feed', label: 'Descubrir', icon: '🔍' },
  { path: '/search', label: 'Buscar', icon: '🔎' },
  { path: '/library', label: 'Biblioteca', icon: '📚' },
  { path: '/profile', label: 'Perfil', icon: '👤' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav style={s.nav}>
      {TABS.map((tab) => {
        const isActive = pathname.startsWith(tab.path)
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{ ...s.tab, color: isActive ? '#ff571a' : 'rgba(242,239,237,0.5)' }}
          >
            <span style={s.icon}>{tab.icon}</span>
            <span style={s.label}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

const s = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    display: 'flex',
    alignItems: 'stretch',
    background: 'rgba(11,12,13,0.97)',
    backdropFilter: 'blur(14px)',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    zIndex: 100,
  },
  tab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'color 150ms ease',
    WebkitTapHighlightColor: 'transparent',
    padding: '6px 0 8px',
    fontFamily: 'inherit',
  },
  icon: { fontSize: 22, lineHeight: 1 },
  label: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
}
