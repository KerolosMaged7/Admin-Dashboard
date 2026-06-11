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
  email: '',
  plan: 'Pro',
  mrr: '',
  status: 'active',
  avatarColor: '',
}

const planOptions = ['Starter', 'Pro', 'Enterprise']
const statusOptions = ['active', 'trial', 'inactive']

export default function UsersPage() {
  const { users, addUser, updateUser, deleteUser, duplicateUser, metrics } = useAdminData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      (user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === 'all' || user.status === statusFilter) &&
      (planFilter === 'all' || user.plan === planFilter)
    )
  }, [search, users, statusFilter, planFilter])

  function openCreate() {
    setEditingUser(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  function openEdit(user) {
    setEditingUser(user)
    setForm({
      name: user.name,
      email: user.email,
      plan: user.plan,
      mrr: user.mrr.replace(/[^0-9]/g, ''),
      status: user.status,
      avatarColor: user.avatarColor,
    })
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingUser(null)
    setForm(emptyForm)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      plan: form.plan,
      mrr: form.mrr,
      status: form.status,
      avatarColor: form.avatarColor,
    }

    if (editingUser) updateUser(editingUser.id, payload)
    else addUser(payload)

    closeModal()
  }

  function handleDelete(user) {
    const confirmed = window.confirm(`Delete ${user.name}? This cannot be undone.`)
    if (!confirmed) return

    deleteUser(user.id)
  }

  function handleDuplicate(user) {
    duplicateUser(user.id)
  }

  function exportUsers(rows) {
    downloadCsv('users.csv', rows, [
      { label: 'Name', getValue: (row) => row.name },
      { label: 'Email', getValue: (row) => row.email },
      { label: 'Plan', getValue: (row) => row.plan },
      { label: 'MRR', getValue: (row) => row.mrr },
      { label: 'Status', getValue: (row) => row.status },
    ])
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Users Management</h2>
          <p className="muted text-sm mt-1">Create, edit, and search users from one place.</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-indigo-500/20 text-[#1a1d2e] font-medium">
            New user
          </button>
          <button onClick={() => exportUsers(filteredUsers)} className="px-4 py-2 rounded-lg bg-white/5 font-medium">
            Export CSV
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="theme-input rounded-lg px-3 py-2 text-sm min-w-[220px] flex-1"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="theme-input rounded-lg px-3 py-2 text-sm hover-field">
            <option value="all">All status</option>
            {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className="theme-input rounded-lg px-3 py-2 text-sm hover-field">
            <option value="all">All plans</option>
            {planOptions.map((plan) => <option key={plan} value={plan}>{plan}</option>)}
          </select>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="theme-surface rounded-2xl p-4">
          <p className="text-[11px] muted-sm">Total users</p>
          <p className="text-2xl font-semibold theme-text mt-1">{metrics.totalUsers}</p>
        </div>
        <div className="theme-surface rounded-2xl p-4">
          <p className="text-[11px] muted-sm">Active users</p>
          <p className="text-2xl font-semibold theme-text mt-1">{metrics.activeUsers}</p>
        </div>
        <div className="theme-surface rounded-2xl p-4">
          <p className="text-[11px] muted-sm">User revenue</p>
          <p className="text-2xl font-semibold theme-text mt-1">{formatMoney(metrics.totalUserMRR)}</p>
        </div>
      </div>

      <div className="overflow-auto glass p-4">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="text-sm muted">
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Plan</th>
              <th className="py-2">MRR</th>
              <th className="py-2">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {filteredUsers.map((user) => {
              return (
                <tr key={user.id} className="align-middle hover:bg-white/5">
                  <td className="py-3">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm muted hidden md:block">{user.email}</div>
                  </td>
                  <td className="py-3 md:hidden text-sm muted">{user.email}</td>
                  <td className="py-3">{user.plan}</td>
                  <td className="py-3">{user.mrr}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${user.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : user.status === 'trial' ? 'bg-amber-400/10 text-amber-300' : 'bg-red-500/10 text-red-300'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button onClick={() => openEdit(user)} className="text-sm px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 hover-press">
                        Edit
                      </button>
                      <button onClick={() => handleDuplicate(user)} className="text-sm px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 hover-press">
                        Duplicate
                      </button>
                      <button onClick={() => handleDelete(user)} className="text-sm px-3 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover-press">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <EmptyState
            title="No users matched this view"
            description="Adjust the filters or clear the saved view to see more users."
          />
        )}
      </div>

      {isModalOpen && (
        <Modal
          title={editingUser ? 'Edit user' : 'Create user'}
          subtitle="Manage user profile, plan, billing, and lifecycle status."
          onClose={closeModal}
        >
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <label className="space-y-2">
              <span className="text-sm muted">Full name</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                className="w-full rounded-xl bg-white/50 border border-white/70 px-3 py-2 outline-none"
                placeholder="Jane Doe"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm muted">Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                className="w-full rounded-xl bg-white/50 border border-white/70 px-3 py-2 outline-none"
                placeholder="jane@company.com"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm muted">Plan</span>
              <select
                value={form.plan}
                onChange={(e) => setForm((current) => ({ ...current, plan: e.target.value }))}
                className="w-full rounded-xl bg-white/50 border border-white/70 px-3 py-2 outline-none"
              >
                {planOptions.map((plan) => (
                  <option key={plan} value={plan}>{plan}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm muted">Monthly revenue</span>
              <input
                required
                inputMode="numeric"
                value={form.mrr}
                onChange={(e) => setForm((current) => ({ ...current, mrr: e.target.value }))}
                className="w-full rounded-xl bg-white/50 border border-white/70 px-3 py-2 outline-none"
                placeholder="490"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm muted">Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}
                className="w-full rounded-xl bg-white/50 border border-white/70 px-3 py-2 outline-none"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm muted">Avatar color</span>
              <input
                value={form.avatarColor}
                onChange={(e) => setForm((current) => ({ ...current, avatarColor: e.target.value }))}
                className="w-full rounded-xl bg-white/50 border border-white/70 px-3 py-2 outline-none"
                placeholder="#6366f1"
              />
            </label>

            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg bg-white/55 text-[#1a1d2e] font-medium">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-500/20 text-[#1a1d2e] font-medium">
                {editingUser ? 'Save changes' : 'Create user'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
