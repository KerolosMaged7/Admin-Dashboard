import { useEffect, useState } from 'react'
import { useAdminData } from '../context/useAdminData'

const STORAGE_KEY = 'admin-dashboard-settings'

const timezoneOptions = [
  { value: 'Africa/Cairo', label: 'Asyut / Cairo (UTC+02:00)' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (UTC+02:00)' },
  { value: 'Europe/Athens', label: 'Athens (UTC+02:00)' },
  { value: 'Europe/Istanbul', label: 'Istanbul (UTC+03:00)' },
  { value: 'Asia/Jerusalem', label: 'Jerusalem (UTC+02:00)' },
  { value: 'Asia/Riyadh', label: 'Riyadh (UTC+03:00)' },
  { value: 'Asia/Dubai', label: 'Dubai (UTC+04:00)' },
  { value: 'UTC', label: 'UTC (UTC+00:00)' },
  { value: 'Europe/London', label: 'London (UTC+00:00)' },
  { value: 'Europe/Paris', label: 'Paris (UTC+01:00)' },
  { value: 'America/New_York', label: 'New York (UTC-05:00)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (UTC-08:00)' },
  { value: 'Asia/Kolkata', label: 'Mumbai / New Delhi (UTC+05:30)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (UTC+08:00)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (UTC+09:00)' },
  { value: 'Australia/Sydney', label: 'Sydney (UTC+10:00)' },
]

const defaultSettings = {
  notifications: true,
  timezone: 'UTC',
}

function buildInitialSettings() {
  if (typeof window === 'undefined') return defaultSettings

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultSettings
    return { ...defaultSettings, ...JSON.parse(stored) }
  } catch {
    return defaultSettings
  }
}

export default function SettingsPage({ darkMode, setDarkMode }) {
  const { recordActivity } = useAdminData()
  const [settings, setSettings] = useState(buildInitialSettings)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const timezoneLabel = timezoneOptions.find((item) => item.value === settings.timezone)?.label ?? settings.timezone
  const currentTimezoneTime = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    timeZone: settings.timezone,
    timeZoneName: 'short',
  }).format(now)

  function reset() {
    setSettings(defaultSettings)
    setDarkMode(false)
    recordActivity('alert', 'Reset settings to defaults')
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="muted text-sm mt-1">Simple preferences for theme and notifications.</p>
      </div>

      <div className="glass rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Dark mode</p>
            <p className="text-sm muted">Toggle dashboard appearance.</p>
          </div>
          <button
            onClick={() => {
              const nextValue = !darkMode
              setDarkMode(nextValue)
              recordActivity('data', `Dark mode ${nextValue ? 'enabled' : 'disabled'}`)
            }}
            className={`px-3 py-1.5 rounded-lg text-sm ${darkMode ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'}`}
          >
            {darkMode ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Email notifications</p>
            <p className="text-sm muted">Receive product and billing updates.</p>
            <p className="text-xs muted mt-1">When enabled, new dashboard activity can trigger a browser notification.</p>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) => {
              const nextValue = e.target.checked
              setSettings((current) => ({ ...current, notifications: nextValue }))

              if (nextValue && 'Notification' in window && window.Notification.permission === 'default') {
                window.Notification.requestPermission()
              }

              recordActivity('data', `Notifications ${nextValue ? 'enabled' : 'disabled'}`)
            }}
          />
        </div>

        <label className="space-y-1 block">
          <span className="text-sm muted">Timezone</span>
          <select
            value={settings.timezone}
            onChange={(e) => {
              const nextValue = e.target.value
              const selectedTimezone = timezoneOptions.find((item) => item.value === nextValue)
              setSettings((current) => ({ ...current, timezone: nextValue }))
              recordActivity('data', `Changed timezone to ${selectedTimezone?.label ?? nextValue}`)
            }}
            className="theme-input rounded-lg px-3 py-2 w-full hover-field"
          >
            {timezoneOptions.map((timezone) => (
              <option key={timezone.value} value={timezone.value}>{timezone.label}</option>
            ))}
          </select>
          <p className="text-sm muted pt-1">
            Current time in {timezoneLabel}: {currentTimezoneTime}
          </p>
        </label>
      </div>

      <button onClick={reset} className="theme-button rounded-lg px-4 py-2 font-medium">Reset to defaults</button>
    </div>
  )
}
