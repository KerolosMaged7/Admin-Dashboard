import { useMemo, useState } from 'react'
import EmptyState from '../components/common/EmptyState'
import { useAdminData } from '../context/useAdminData'

const STORAGE_KEY = 'admin-dashboard-support-tickets'

const seedTickets = [
  {
    id: 1,
    subject: 'Unable to sync CRM webhooks',
    status: 'open',
    createdAt: Date.now() - 1000 * 60 * 90,
  },
]

function buildInitialTickets() {
  if (typeof window === 'undefined') return seedTickets

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return seedTickets
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : seedTickets
  } catch {
    return seedTickets
  }
}

function hoursAgo(ts) {
  return Math.max(0, Math.floor((Date.now() - ts) / (1000 * 60 * 60)))
}

export default function SupportPage() {
  const { recordActivity } = useAdminData()
  const [tickets, setTickets] = useState(buildInitialTickets)
  const [subject, setSubject] = useState('')

  const openCount = useMemo(() => tickets.filter((ticket) => ticket.status === 'open').length, [tickets])

  function save(next) {
    setTickets(next)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  function createTicket(event) {
    event.preventDefault()
    const cleanSubject = subject.trim()
    if (!cleanSubject) return

    const next = [{ id: Date.now(), subject: cleanSubject, status: 'open', createdAt: Date.now() }, ...tickets]
    save(next)
    recordActivity('data', `Created support ticket: ${cleanSubject}`)
    setSubject('')
  }

  function toggleStatus(id) {
    const target = tickets.find((ticket) => ticket.id === id)
    if (!target) return

    const next = tickets.map((ticket) =>
      ticket.id === id ? { ...ticket, status: ticket.status === 'open' ? 'resolved' : 'open' } : ticket
    )
    save(next)
    recordActivity('upgrade', `${target.status === 'open' ? 'Resolved' : 'Reopened'} ticket: ${target.subject}`)
  }

  function removeTicket(id) {
    const target = tickets.find((ticket) => ticket.id === id)
    if (!target) return

    save(tickets.filter((ticket) => ticket.id !== id))
    recordActivity('alert', `Deleted ticket: ${target.subject}`)
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold">Support Center</h2>
        <p className="muted text-sm mt-1">Create and track support tickets in a simple way.</p>
      </div>

      <div className="theme-surface rounded-2xl p-4">
        <p className="text-[11px] muted-sm">Open tickets</p>
        <p className="text-2xl font-semibold theme-text mt-1">{openCount}</p>
      </div>

      <form onSubmit={createTicket} className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-2">
        <input
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Ticket subject"
          className="theme-input rounded-lg px-3 py-2 flex-1"
        />
        <button type="submit" className="theme-button-primary rounded-lg px-4 py-2 font-medium">Create</button>
      </form>

      <div className="space-y-2">
        {tickets.length === 0 ? (
          <EmptyState
            title="No support tickets yet"
            description="Create a ticket to track requests and follow-ups in one place."
          />
        ) : tickets.map((ticket) => (
          <div key={ticket.id} className="glass rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="font-medium">{ticket.subject}</p>
              <p className="text-sm muted">{ticket.status} • created {hoursAgo(ticket.createdAt)}h ago</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleStatus(ticket.id)} className="theme-button rounded-lg px-3 py-1.5 text-sm">
                {ticket.status === 'open' ? 'Resolve' : 'Reopen'}
              </button>
              <button onClick={() => removeTicket(ticket.id)} className="theme-button-danger rounded-lg px-3 py-1.5 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-4">
        <p className="font-medium">Contact</p>
        <p className="text-sm muted mt-1">support@admin-dashboard.com</p>
      </div>
    </div>
  )
}
