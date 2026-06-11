import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import CommandPalette from './components/common/CommandPalette'

import DashboardPage from './pages/DashboardPage'
import AnalyticsPage from './pages/AnalyticsPage'
import UsersPage from './pages/UsersPage'
import RevenuePage from './pages/RevenuePage'
import ProductsPage from './pages/ProductsPage'
import AuditLogPage from './pages/AuditLogPage'
import ProfilePage from './pages/ProfilePage'
import { AdminDataProvider } from './context/AdminDataContext'

export default function App() {
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(event) {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'

      if (!isShortcut) return

      event.preventDefault()
      setCommandPaletteOpen((current) => !current)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function handleSetActiveNav(nextNav) {
    setActiveNav(nextNav)
    setMobileMenuOpen(false)
    setCommandPaletteOpen(false)
  }

  function renderActivePage() {
    switch (activeNav) {
      case 'Dashboard': return <DashboardPage setActiveNav={handleSetActiveNav} />
      case 'Analytics': return <AnalyticsPage />
      case 'Users': return <UsersPage />
      case 'Revenue': return <RevenuePage />
      case 'Products': return <ProductsPage />
      case 'Audit Log': return <AuditLogPage setActiveNav={handleSetActiveNav} />
      case 'Profile': return <ProfilePage setActiveNav={handleSetActiveNav} />
      default: return <DashboardPage />
    }
  }

  return (
    <AdminDataProvider>
      <a href="#main-content" className="sr-only focus:not-sr-only focus-ring absolute left-4 top-4 z-[60] rounded-full bg-white px-4 py-2 text-sm text-[#1a1d2e] shadow-lg dark:bg-[#101828] dark:text-white">
        Skip to main content
      </a>
      <div className="flex h-screen overflow-hidden">
        <Sidebar activeNav={activeNav} setActiveNav={handleSetActiveNav} isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />
        <main id="main-content" className="flex-1 overflow-y-auto px-4 md:px-8 py-7">
          <Topbar
            activeNav={activeNav}
            setActiveNav={handleSetActiveNav}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          />
          {renderActivePage()}
        </main>
        <CommandPalette
          key={commandPaletteOpen ? 'open' : 'closed'}
          open={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onNavigate={handleSetActiveNav}
        />
      </div>
    </AdminDataProvider>
  )
}
