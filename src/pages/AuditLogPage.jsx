import { useMemo, useState } from 'react'
import EmptyState from '../components/common/EmptyState'
import { useAdminData } from '../context/useAdminData'

function getRelatedPage(entry) {
  const text = entry.text.toLowerCase()
  if (text.includes('timezone') || text.includes('dark mode') || text.includes('settings')) return 'Settings'
  if (text.includes('user') || text.includes('trial')) return 'Users'
  if (text.includes('product') || text.includes('revenue') || text.includes('mrr')) return 'Products'
  if (text.includes('ticket') || text.includes('support')) return 'Support'
  if (text.includes('alert')) return 'Alerts'
  return 'Dashboard'
}

export default function AuditLogPage({ setActiveNav }) {
  const { activity } = useAdminData()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filtered = useMemo(() => {
    return activity.filter((item) => {
      const matchSearch = `${item.text} ${item.time}`.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === 'all' || item.type === typeFilter
      return matchSearch && matchType
    })
  }, [activity, search, typeFilter])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Audit Log</h2>
        <p className="muted text-sm mt-1">A running history of important dashboard actions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="theme-surface rounded-2xl p-4">
          <p className="text-[11px] muted-sm">Total entries</p>
          <p className="text-2xl font-semibold theme-text mt-1">{activity.length}</p>
        </div>
        <div className="theme-surface rounded-2xl p-4">
          <p className="text-[11px] muted-sm">Filtered entries</p>
          <p className="text-2xl font-semibold theme-text mt-1">{filtered.length}</p>
        </div>
        <div className="theme-surface rounded-2xl p-4">
          <p className="text-[11px] muted-sm">Latest action</p>
          <p className="text-sm font-medium theme-text mt-1 truncate">{activity[0]?.text ?? 'No actions yet'}</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-3 flex flex-col md:flex-row gap-1.5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="theme-input rounded-lg px-3 py-2 flex-1 text-sm"
          placeholder="Search the log"
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="theme-input rounded-lg px-3 py-2 text-sm">
          <option value="all">All types</option>
          <option value="user">Users</option>
          <option value="data">Data</option>
          <option value="alert">Alerts</option>
          <option value="upgrade">Upgrades</option>
          <option value="payment">Payments</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No matching audit entries"
          description="Try a different keyword or clear the type filter."
          actionLabel="Back to dashboard"
          onAction={() => setActiveNav?.('Dashboard')}
        />
      ) : (
        <div className="space-y-1.5">
          {filtered.map((item) => (
            <div key={item.id} className="glass rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <p className="font-medium text-sm">{item.text}</p>
                <p className="text-xs muted mt-0.5">{item.time} • {item.type}</p>
              </div>
              <button onClick={() => setActiveNav?.(getRelatedPage(item))} className="theme-button rounded-lg px-3 py-1 text-xs whitespace-nowrap">
                Open related
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
