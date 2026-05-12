import { useMemo, useState } from 'react'
import EmptyState from '../components/common/EmptyState'
import { useAdminData } from '../context/useAdminData'

const STORAGE_KEY = 'admin-dashboard-alerts'

const seedAlerts = [
  { id: 1, msg: 'Server CPU usage is high', level: 'critical', acknowledged: false },
  { id: 2, msg: 'Payment gateway delay reported', level: 'warning', acknowledged: false },
]

function buildInitialAlerts() {
  if (typeof window === 'undefined') return seedAlerts

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return seedAlerts
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : seedAlerts
  } catch {
    return seedAlerts
  }
}

export default function AlertsPage() {
  const { recordActivity } = useAdminData()
  const [alerts, setAlerts] = useState(buildInitialAlerts)
  const [levelFilter, setLevelFilter] = useState('all')
  const [message, setMessage] = useState('')

  const visibleAlerts = useMemo(() => {
    return alerts.filter((alert) => levelFilter === 'all' || alert.level === levelFilter)
  }, [alerts, levelFilter])

  const openCount = alerts.filter((alert) => !alert.acknowledged).length

  function save(next) {
    setAlerts(next)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  function addAlert(event) {
    event.preventDefault()
    const msg = message.trim()
    if (!msg) return

    const next = [{ id: Date.now(), msg, level: 'warning', acknowledged: false }, ...alerts]
    save(next)
    recordActivity('alert', `Created alert: ${msg}`)
    setMessage('')
  }

  function toggleAcknowledge(id) {
    const target = alerts.find((alert) => alert.id === id)
    if (!target) return

    const next = alerts.map((alert) => (alert.id === id ? { ...alert, acknowledged: !alert.acknowledged } : alert))
    save(next)
    recordActivity('data', `${target.acknowledged ? 'Reopened' : 'Acknowledged'} alert: ${target.msg}`)
  }

  function dismissAlert(id) {
    const target = alerts.find((alert) => alert.id === id)
    if (!target) return

    save(alerts.filter((alert) => alert.id !== id))
    recordActivity('alert', `Dismissed alert: ${target.msg}`)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">System Alerts</h2>
        <p className="muted text-sm mt-1">Keep track of open issues and acknowledge them quickly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="theme-surface rounded-2xl p-4 hover-lift">
          <p className="text-[11px] muted-sm">Total alerts</p>
          <p className="text-2xl font-semibold theme-text mt-1">{alerts.length}</p>
        </div>
        <div className="theme-surface rounded-2xl p-4 hover-lift">
          <p className="text-[11px] muted-sm">Open alerts</p>
          <p className="text-2xl font-semibold theme-text mt-1">{openCount}</p>
        </div>
      </div>

      <form onSubmit={addAlert} className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-2">
        <input
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a new alert"
          className="theme-input rounded-lg px-3 py-2 flex-1"
        />
        <button type="submit" className="theme-button-primary rounded-lg px-4 py-2 font-medium">Add alert</button>
      </form>

      <div className="glass rounded-2xl p-4">
        <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="theme-input rounded-lg px-3 py-2 mb-3 hover-field">
          <option value="all">All levels</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>

        <div className="space-y-2">
          {visibleAlerts.map((alert) => (
            <div key={alert.id} className="theme-surface rounded-xl p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 hover-lift hover-glow">
              <div>
                <p className="font-medium">{alert.msg}</p>
                <p className="text-sm muted">{alert.level} • {alert.acknowledged ? 'acknowledged' : 'open'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleAcknowledge(alert.id)} className="theme-button rounded-lg px-3 py-1.5 text-sm">
                  {alert.acknowledged ? 'Reopen' : 'Acknowledge'}
                </button>
                <button onClick={() => dismissAlert(alert.id)} className="theme-button-danger rounded-lg px-3 py-1.5 text-sm">Dismiss</button>
              </div>
            </div>
          ))}

          {visibleAlerts.length === 0 && (
            <EmptyState
              title="No alerts in this filter"
              description="Try another alert level or create a new alert."
            />
          )}
        </div>
      </div>
    </div>
  )
}
