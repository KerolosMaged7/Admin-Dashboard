import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'

import DashboardPage from './pages/DashboardPage'
import AnalyticsPage from './pages/AnalyticsPage'
import UsersPage from './pages/UsersPage'
import RevenuePage from './pages/RevenuePage'
import ProductsPage from './pages/ProductsPage'
import AlertsPage from './pages/AlertsPage'
import SettingsPage from './pages/SettingsPage'
import { AdminDataProvider } from './context/AdminDataContext'

export default function App() {
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // toggle a class on the document element so CSS can target dark mode
    if (darkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [darkMode])

  function handleSetActiveNav(nextNav) {
    setActiveNav(nextNav)
    setMobileMenuOpen(false)
  }

  function renderActivePage() {
    switch (activeNav) {
      case 'Dashboard': return <DashboardPage setActiveNav={handleSetActiveNav} />
      case 'Analytics': return <AnalyticsPage />
      case 'Users': return <UsersPage />
      case 'Revenue': return <RevenuePage />
      case 'Products': return <ProductsPage />
      case 'Alerts': return <AlertsPage />
      case 'Settings': return <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} />
      default: return <DashboardPage />
    }
  }

  return (
    <AdminDataProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar activeNav={activeNav} setActiveNav={handleSetActiveNav} isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-7">
          <Topbar activeNav={activeNav} setActiveNav={handleSetActiveNav} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
          {renderActivePage()}
        </main>
      </div>
    </AdminDataProvider>
  )
}
