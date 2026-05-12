import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useAdminData } from '../../context/useAdminData'
import { navItems } from '../../data'

export default function CommandPalette({ open, onClose, onNavigate }) {
  const { users, products, activity } = useAdminData()
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()

    const pageResults = navItems
      .filter((item) => item.label.toLowerCase().includes(needle))
      .map((item) => ({ type: 'page', label: item.label, detail: 'Open page', page: item.label }))

    const userResults = users
      .filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(needle))
      .slice(0, 5)
      .map((user) => ({ type: 'user', label: user.name, detail: user.email, page: 'Users' }))

    const productResults = products
      .filter((product) => `${product.name} ${product.desc}`.toLowerCase().includes(needle))
      .slice(0, 5)
      .map((product) => ({ type: 'product', label: product.name, detail: product.team, page: 'Products' }))

    const activityResults = activity
      .filter((item) => item.text.toLowerCase().includes(needle))
      .slice(0, 5)
      .map((item) => ({ type: 'activity', label: item.text, detail: item.time, page: 'Audit Log' }))

    return [...pageResults, ...userResults, ...productResults, ...activityResults].slice(0, 10)
  }, [activity, products, query, users])

  if (!open) return null

  function selectResult(result) {
    if (result.page) onNavigate(result.page)
    onClose()
    setQuery('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      <button className="absolute inset-0 bg-[#0b1220]/35 backdrop-blur-[2px]" onClick={onClose} aria-label="Close command palette" />
      <div className="relative z-10 w-full max-w-2xl glass rounded-3xl p-3 shadow-2xl">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg theme-surface">
          <Search size={16} className="text-gray-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, users, products, activity..."
            className="w-full bg-transparent outline-none theme-text placeholder:text-gray-400 text-sm"
          />
        </div>

        <div className="mt-2 max-h-80 overflow-auto space-y-1">
          {results.map((result, index) => (
            <button
              key={`${result.type}-${index}`}
              onClick={() => selectResult(result)}
              className="w-full text-left theme-surface rounded-lg px-3 py-2 hover:bg-white/10 transition-colors"
            >
              <p className="font-medium text-sm theme-text">{result.label}</p>
              <p className="text-xs muted">{result.detail}</p>
            </button>
          ))}
          {results.length === 0 && (
            <p className="muted text-xs px-2 py-3 text-center">No matches yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
