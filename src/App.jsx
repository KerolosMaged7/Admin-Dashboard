import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'

import DashboardPage from './pages/DashboardPage'
import AnalyticsPage from './pages/AnalyticsPage'
import UsersPage from './pages/UsersPage'
import RevenuePage from './pages/RevenuePage'
import ProductsPage from './pages/ProductsPage'
import PipelinesPage from './pages/PipelinesPage'
import AlertsPage from './pages/AlertsPage'
import SettingsPage from './pages/SettingsPage'
import SupportPage from './pages/SupportPage'

export default function App() {
  const [activeNav, setActiveNav] = useState('Dashboard')

  function renderActivePage() {
    switch (activeNav) {
      case 'Dashboard': return <DashboardPage />
      case 'Analytics': return <AnalyticsPage />
      case 'Users': return <UsersPage />
      case 'Revenue': return <RevenuePage />
      case 'Products': return <ProductsPage />
      case 'Pipelines': return <PipelinesPage />
      case 'Alerts': return <AlertsPage />
      case 'Settings': return <SettingsPage />
      case 'Support': return <SupportPage />
      default: return <DashboardPage />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <main className="flex-1 overflow-y-auto px-8 py-7">
        <Topbar activeNav={activeNav} />
        {renderActivePage()}
      </main>
    </div>
  )
}
