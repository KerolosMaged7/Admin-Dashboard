import { useMemo, useState } from 'react'
import EmptyState from '../components/common/EmptyState'
import { useAdminData } from '../context/useAdminData'

export default function RecycleBinPage() {
  const { deletedUsers, deletedProducts, restoreUser, restoreProduct, purgeUser, purgeProduct, metrics } = useAdminData()
  const [scope, setScope] = useState('all')

  const rows = useMemo(() => {
    const userRows = deletedUsers.map((item) => ({ ...item, type: 'user' }))
    const productRows = deletedProducts.map((item) => ({ ...item, type: 'product' }))
    const merged = [...userRows, ...productRows]
    return scope === 'all' ? merged : merged.filter((item) => item.type === scope)
  }, [deletedProducts, deletedUsers, scope])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Recycle Bin</h2>
        <p className="muted text-sm mt-1">Restore or permanently remove deleted users and products.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="theme-surface rounded-2xl p-4">
          <p className="text-[11px] muted-sm">Items in bin</p>
          <p className="text-2xl font-semibold theme-text mt-1">{metrics.recycleBinCount}</p>
        </div>
        <div className="theme-surface rounded-2xl p-4">
          <p className="text-[11px] muted-sm">Deleted users</p>
          <p className="text-2xl font-semibold theme-text mt-1">{deletedUsers.length}</p>
        </div>
        <div className="theme-surface rounded-2xl p-4">
          <p className="text-[11px] muted-sm">Deleted products</p>
          <p className="text-2xl font-semibold theme-text mt-1">{deletedProducts.length}</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-3 flex flex-col sm:flex-row gap-1.5">
        <select value={scope} onChange={(e) => setScope(e.target.value)} className="theme-input rounded-lg px-3 py-2 text-sm">
          <option value="all">All items</option>
          <option value="user">Users</option>
          <option value="product">Products</option>
        </select>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="Recycle bin is empty"
          description="Deleted items will appear here until you restore or permanently delete them."
        />
      ) : (
        <div className="space-y-1.5">
          {rows.map((item) => (
            <div key={`${item.type}-${item.id}`} className="glass rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <p className="font-medium text-sm">{item.name ?? item.subject ?? 'Untitled'}</p>
                <p className="text-xs muted mt-0.5">{item.type} • deleted {item.deletedAt ? new Date(item.deletedAt).toLocaleDateString() : 'recently'}</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => (item.type === 'user' ? restoreUser(item.id) : restoreProduct(item.id))}
                  className="theme-button-primary rounded-lg px-2 py-1 text-xs"
                >
                  Restore
                </button>
                <button
                  onClick={() => (item.type === 'user' ? purgeUser(item.id) : purgeProduct(item.id))}
                  className="theme-button-danger rounded-lg px-2 py-1 text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
