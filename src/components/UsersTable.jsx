import { useState } from 'react'
import { Search, ChevronRight } from 'lucide-react'
import { useAdminData } from '../context/useAdminData'
import EmptyState from './common/EmptyState'

const statusStyles = {
  active:   'bg-emerald-50 text-emerald-600',
  trial:    'bg-amber-50 text-amber-600',
  inactive: 'bg-gray-100 text-gray-400',
}

const statusDot = {
  active:   'bg-emerald-400',
  trial:    'bg-amber-400',
  inactive: 'bg-gray-300',
}

export default function UsersTable({ onViewAll }) {
  const [search, setSearch] = useState('')
  const { users } = useAdminData()

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="glass rounded-2xl p-5 animate-fade-up delay-3">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-sm text-[#1a1d2e]">Users</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Recent account activity</p>
        </div>
        <button onClick={onViewAll} className="theme-button-primary rounded-full px-3 py-1.5 text-[12px] font-medium flex items-center gap-0.5 focus-ring">
          View all <ChevronRight size={13} />
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 mb-3 text-[11px] muted-sm">
        <span>{filtered.length} visible</span>
        <span>{users.length} total</span>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search users…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-[12px] pl-8 pr-3 py-2 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-1 focus:ring-indigo-300 placeholder:text-gray-300 focus-ring"
        />
      </div>

      {filtered.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              {['User', 'Plan', 'MRR', 'Status'].map((h) => (
                <th
                  key={h}
                  className="text-[10.5px] font-semibold text-gray-400 tracking-wider uppercase text-left pb-2.5 border-b border-indigo-100/60"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="group hover:bg-indigo-50/40 transition-colors rounded-lg">
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0"
                      style={{ background: user.avatarColor }}
                    >
                      {user.initials}
                    </div>
                    <div>
                      <p className="text-[12.5px] font-medium text-[#1a1d2e] leading-tight">{user.name}</p>
                      <p className="text-[11px] text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 pr-3 text-[12px] text-gray-500">{user.plan}</td>
                <td className="py-2.5 pr-3 text-[13px] font-medium text-[#1a1d2e]">{user.mrr}</td>
                <td className="py-2.5">
                  <span className={`inline-flex items-center gap-1.5 text-[10.5px] font-medium px-2 py-0.5 rounded-full ${statusStyles[user.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot[user.status]}`} />
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyState
          title="No users match this search"
          description="Try a different name or email, or clear the search to see the full list."
          actionLabel={search ? 'Clear search' : 'View all users'}
          onAction={search ? () => setSearch('') : onViewAll}
        />
      )}
    </div>
  )
}
