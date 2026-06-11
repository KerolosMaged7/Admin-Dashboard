import { useEffect, useMemo, useState } from 'react'
import { Bell, Calendar, Menu, Search } from 'lucide-react'
import { useAdminData } from '../context/useAdminData'

const READ_ACTIVITY_STORAGE_KEY = 'admin-dashboard-read-activity-ids'
const DISMISSED_ACTIVITY_STORAGE_KEY = 'admin-dashboard-dismissed-activity-ids'

function buildInitialReadIds() {
  if (typeof window === 'undefined') return []

  try {
    const stored = window.localStorage.getItem(READ_ACTIVITY_STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function buildInitialDismissedIds() {
  if (typeof window === 'undefined') return []

  try {
    const stored = window.localStorage.getItem(DISMISSED_ACTIVITY_STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function Topbar({ activeNav, setActiveNav, mobileMenuOpen, setMobileMenuOpen, onOpenCommandPalette }) {
  const { activity, demoMode, resetDemoData } = useAdminData()
  const [dateFormat, setDateFormat] = useState('long')
  const [isDateOpen, setIsDateOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [readActivityIds, setReadActivityIds] = useState(buildInitialReadIds)
  const [dismissedActivityIds, setDismissedActivityIds] = useState(buildInitialDismissedIds)

  const today = new Date().toLocaleDateString('en-US',
    dateFormat === 'long'
      ? { month: 'long', day: 'numeric', year: 'numeric' }
      : { month: '2-digit', day: '2-digit', year: 'numeric' }
  )

  useEffect(() => {
    window.localStorage.setItem(READ_ACTIVITY_STORAGE_KEY, JSON.stringify(readActivityIds))
  }, [readActivityIds])

  useEffect(() => {
    window.localStorage.setItem(DISMISSED_ACTIVITY_STORAGE_KEY, JSON.stringify(dismissedActivityIds))
  }, [dismissedActivityIds])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsDateOpen(false)
        setIsNotificationsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const activityNotifications = useMemo(
    () => activity.map((item) => ({
      id: item.id,
      text: item.text,
      time: item.time,
      target: getNotificationTarget(item),
    })),
    [activity]
  )

  const visibleNotifications = useMemo(
    () => activityNotifications.filter((item) => !dismissedActivityIds.includes(item.id)),
    [activityNotifications, dismissedActivityIds]
  )

  const unreadCount = visibleNotifications.filter((item) => !readActivityIds.includes(item.id)).length

  function getNotificationTarget(item) {
    const text = item.text.toLowerCase()
    if (text.includes('timezone') || text.includes('dark mode') || text.includes('settings')) return 'Audit Log'
    if (text.includes('user') || text.includes('trial') || text.includes('signup') || text.includes('sign-up')) return 'Users'
    if (text.includes('product') || text.includes('mrr') || text.includes('revenue')) return 'Products'
    if (text.includes('alert')) return 'Audit Log'
    return 'Dashboard'
  }

  function markRead(id) {
    setReadActivityIds((current) => (current.includes(id) ? current : [...current, id]))
  }

  function markAllRead() {
    setReadActivityIds((current) => {
      const next = new Set(current)
      visibleNotifications.forEach((item) => next.add(item.id))
      return [...next]
    })
  }

  function clearNotifications() {
    setDismissedActivityIds((current) => {
      const next = new Set(current)
      visibleNotifications.forEach((item) => next.add(item.id))
      return [...next]
    })
    setReadActivityIds((current) => {
      const next = new Set(current)
      visibleNotifications.forEach((item) => next.add(item.id))
      return [...next]
    })
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
      <div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="md:hidden w-9 h-9 rounded-xl glass flex items-center justify-center hover:bg-white/70 transition-colors focus-ring"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <Menu size={16} className="text-gray-500" />
          </button>
          <h1 className="font-display text-[22px] font-bold theme-text tracking-tight leading-none">
            {activeNav}
          </h1>
        </div>
        <p className="text-[12px] text-gray-400 mt-1">Welcome back, Kerolos - here's what's happening.</p>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {demoMode && (
          <button
            type="button"
            onClick={resetDemoData}
            className="hidden sm:inline-flex items-center gap-2 text-[12px] text-emerald-700 glass rounded-full px-3.5 py-1.5 focus-ring bg-emerald-50/80 dark:bg-emerald-500/15 dark:text-emerald-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Reset demo data
          </button>
        )}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 text-[12px] text-gray-500 glass rounded-full px-3.5 py-1.5 focus-ring"
          aria-label="Open search palette"
        >
          <Search size={12} className="text-indigo-400" />
          <span>Search</span>
          <span className="rounded-full bg-white/40 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-white/10 dark:text-white/55">Ctrl K</span>
        </button>
        <div className="relative">
          <button
            onClick={() => {
              setIsDateOpen((current) => !current)
              setIsNotificationsOpen(false)
            }}
            className="flex items-center gap-1.5 text-[12px] text-gray-500 glass rounded-full px-3.5 py-1.5 focus-ring"
          >
            <Calendar size={12} className="text-indigo-400" />
            {today}
          </button>

          {isDateOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl glass p-3 z-30">
              <p className="text-sm font-medium theme-text">Date</p>
              <p className="text-xs muted mt-1">{today}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setDateFormat('long')}
                  className={`px-2.5 py-1.5 text-xs rounded-lg ${dateFormat === 'long' ? 'theme-button-primary' : 'theme-button'}`}
                >
                  Long
                </button>
                <button
                  onClick={() => setDateFormat('short')}
                  className={`px-2.5 py-1.5 text-xs rounded-lg ${dateFormat === 'short' ? 'theme-button-primary' : 'theme-button'}`}
                >
                  Short
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen((current) => !current)
              setIsDateOpen(false)
            }}
            className="relative w-9 h-9 rounded-xl glass flex items-center justify-center hover:bg-white/70 transition-colors focus-ring"
          >
            <Bell size={16} className="text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-indigo-500 text-white text-[10px] leading-4 text-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl glass p-3 z-30">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium theme-text">Notifications</p>
                <div className="flex gap-2">
                  <button onClick={markAllRead} className="text-[11px] muted hover:text-gray-600">Mark all read</button>
                  <button onClick={clearNotifications} className="text-[11px] muted hover:text-gray-600">Clear</button>
                </div>
              </div>

              <div className="space-y-1.5 max-h-64 overflow-auto">
                {visibleNotifications.map((item) => (
                  <div key={item.id} className="theme-surface rounded-lg px-2.5 py-2 space-y-1">
                    <p className="text-xs theme-text leading-5">{item.text}</p>
                    <p className="text-[10px] muted mt-1">{item.time}</p>
                    <div className="flex items-center justify-between gap-2">
                      {!readActivityIds.includes(item.id) ? (
                        <p className="text-[10px] text-indigo-500">Unread</p>
                      ) : (
                        <p className="text-[10px] muted">Read</p>
                      )}
                      <button
                        onClick={() => {
                          markRead(item.id)
                          setActiveNav?.(item.target)
                          setIsNotificationsOpen(false)
                        }}
                        className="text-[10px] muted hover:text-gray-600"
                      >
                        Open {item.target}
                      </button>
                    </div>
                  </div>
                ))}
                {visibleNotifications.length === 0 && (
                  <p className="text-xs muted">No notifications.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
