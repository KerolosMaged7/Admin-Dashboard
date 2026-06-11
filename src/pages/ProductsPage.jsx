import { useMemo, useState } from 'react'
import Modal from '../components/common/Modal'
import EmptyState from '../components/common/EmptyState'
import { useAdminData } from '../context/useAdminData'
import { downloadCsv } from '../utils/csv'

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString('en-US')}`
}

const emptyForm = {
  name: '',
  desc: '',
  status: 'active',
  team: 'Product',
  subscribers: '',
  mrr: '',
  price: '',
}

const statusOptions = ['active', 'beta', 'draft', 'archived']
const teamOptions = ['Platform', 'Revenue', 'Data', 'Growth', 'Product']

export default function ProductsPage() {
  const { products, addProduct, updateProduct, duplicateProduct, metrics } = useAdminData()
  const [duplicateDisabled, setDuplicateDisabled] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [teamFilter, setTeamFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const visibleProducts = useMemo(() => {
    return products.filter((product) =>
      (product.name.toLowerCase().includes(search.toLowerCase()) || product.desc.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === 'all' || product.status === statusFilter) &&
      (teamFilter === 'all' || product.team === teamFilter)
    )
  }, [products, search, statusFilter, teamFilter])

  function openCreate() {
    setEditingProduct(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  function openEdit(product) {
    setEditingProduct(product)
    setForm({
      name: product.name,
      desc: product.desc,
      status: product.status,
      team: product.team,
      subscribers: String(product.subscribers),
      mrr: String(product.mrr),
      price: String(product.price),
    })
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingProduct(null)
    setForm(emptyForm)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      name: form.name.trim(),
      desc: form.desc.trim(),
      status: form.status,
      team: form.team,
      subscribers: form.subscribers,
      mrr: form.mrr,
      price: form.price,
    }

    // basic validation: name required and numeric fields must be valid non-negative numbers
    if (!payload.name) {
      window.alert('Product name is required')
      return
    }

    const subs = Number(payload.subscribers)
    const mrrVal = Number(payload.mrr)
    const priceVal = Number(payload.price)

    if (Number.isNaN(subs) || subs < 0) { window.alert('Subscribers must be a non-negative number'); return }
    if (Number.isNaN(mrrVal) || mrrVal < 0) { window.alert('MRR must be a non-negative number'); return }
    if (Number.isNaN(priceVal) || priceVal < 0) { window.alert('Price must be a non-negative number'); return }

    payload.subscribers = subs
    payload.mrr = mrrVal
    payload.price = priceVal

    if (editingProduct) updateProduct(editingProduct.id, payload)
    else addProduct(payload)

    closeModal()
  }

  function handleDuplicate(product) {
    if (duplicateDisabled) return
    setDuplicateDisabled(true)
    // short disable period to avoid rapid double-clicks
    setTimeout(() => setDuplicateDisabled(false), 600)
    duplicateProduct(product.id)
  }

  function exportProducts(rows) {
    downloadCsv('products.csv', rows, [
      { label: 'Name', getValue: (row) => row.name },
      { label: 'Description', getValue: (row) => row.desc },
      { label: 'Status', getValue: (row) => row.status },
      { label: 'Team', getValue: (row) => row.team },
      { label: 'Subscribers', getValue: (row) => row.subscribers },
      { label: 'MRR', getValue: (row) => row.mrr },
      { label: 'Price', getValue: (row) => row.price },
    ])
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold theme-text">Products</h2>
          <p className="muted text-sm mt-1">Manage product details from one place.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={openCreate} className="theme-button-primary px-4 py-2 rounded-lg font-medium">
            New product
          </button>
          <button onClick={() => exportProducts(products)} className="theme-button px-4 py-2 rounded-lg font-medium">
            Export CSV
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="theme-input rounded-lg px-3 py-2 text-sm min-w-[220px] flex-1"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="theme-input rounded-lg px-3 py-2 text-sm hover-field">
            <option value="all">All status</option>
            {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)} className="theme-input rounded-lg px-3 py-2 text-sm hover-field">
            <option value="all">All teams</option>
            {teamOptions.map((team) => <option key={team} value={team}>{team}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="theme-surface rounded-2xl p-4">
          <p className="text-[11px] muted">Total products</p>
          <p className="text-2xl font-semibold theme-text mt-1">{metrics.totalProducts}</p>
        </div>
        <div className="theme-surface rounded-2xl p-4">
          <p className="text-[11px] muted">Active products</p>
          <p className="text-2xl font-semibold theme-text mt-1">{metrics.activeProducts}</p>
        </div>
        <div className="theme-surface rounded-2xl p-4">
          <p className="text-[11px] muted">Portfolio MRR</p>
          <p className="text-2xl font-semibold theme-text mt-1">{formatMoney(metrics.totalProductMRR)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleProducts.map((product) => {
          return (
            <div key={product.id} className="glass p-6 rounded-2xl transition-all hover-lift hover-glow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div>
                    <h2 className="text-xl font-semibold mb-1 theme-text">{product.name}</h2>
                    <p className="muted">{product.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm muted">Active subscriptions</p>
                  <p className="font-medium">{product.subscribers.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => openEdit(product)} className="theme-button px-3 py-1 rounded-lg font-medium hover-press">
                  Edit
                </button>
                <button
                  onClick={() => handleDuplicate(product)}
                  disabled={duplicateDisabled}
                  className={`theme-button px-3 py-1 rounded-lg font-medium hover-press ${duplicateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Duplicate
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {visibleProducts.length === 0 && (
        <EmptyState
          title="No products matched this view"
          description="Try a different filter, search term, or saved view."
        />
      )}

      {isModalOpen && (
        <Modal
          title={editingProduct ? 'Edit product' : 'Create product'}
          subtitle="Update product details, pricing, ownership, and lifecycle status."
          onClose={closeModal}
        >
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm muted">Product name</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                className="theme-input w-full rounded-xl px-3 py-2 outline-none"
                placeholder="Operations Suite"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm muted">Description</span>
              <input
                required
                value={form.desc}
                onChange={(e) => setForm((current) => ({ ...current, desc: e.target.value }))}
                className="theme-input w-full rounded-xl px-3 py-2 outline-none"
                placeholder="What does this product do?"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm muted">Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}
                className="theme-input w-full rounded-xl px-3 py-2 outline-none"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm muted">Team</span>
              <select
                value={form.team}
                onChange={(e) => setForm((current) => ({ ...current, team: e.target.value }))}
                className="theme-input w-full rounded-xl px-3 py-2 outline-none"
              >
                {teamOptions.map((team) => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm muted">Subscribers</span>
              <input
                required
                inputMode="numeric"
                value={form.subscribers}
                onChange={(e) => setForm((current) => ({ ...current, subscribers: e.target.value }))}
                className="theme-input w-full rounded-xl px-3 py-2 outline-none"
                placeholder="1240"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm muted">MRR</span>
              <input
                required
                inputMode="numeric"
                value={form.mrr}
                onChange={(e) => setForm((current) => ({ ...current, mrr: e.target.value }))}
                className="theme-input w-full rounded-xl px-3 py-2 outline-none"
                placeholder="48200"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm muted">Price / month</span>
              <input
                required
                inputMode="numeric"
                value={form.price}
                onChange={(e) => setForm((current) => ({ ...current, price: e.target.value }))}
                className="theme-input w-full rounded-xl px-3 py-2 outline-none"
                placeholder="249"
              />
            </label>

            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <button type="button" onClick={closeModal} className="theme-button px-4 py-2 rounded-lg font-medium">
                Cancel
              </button>
              <button type="submit" className="theme-button-primary px-4 py-2 rounded-lg font-medium">
                {editingProduct ? 'Save changes' : 'Create product'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
