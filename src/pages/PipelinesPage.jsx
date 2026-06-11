import { useMemo, useState } from 'react'
import { useAdminData } from '../context/useAdminData'

const STORAGE_KEY = 'admin-dashboard-pipeline-deals'

const stageOrder = ['Lead Review', 'Sales Call', 'Contract Sent', 'Closed Deal']
const seedDeals = [
  { id: 1, account: 'Atlas Dynamics', stage: 'Lead Review', value: 12000 },
  { id: 2, account: 'Blue Harbor', stage: 'Sales Call', value: 34000 },
]

function buildInitialDeals() {
  if (typeof window === 'undefined') return seedDeals

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return seedDeals
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : seedDeals
  } catch {
    return seedDeals
  }
}

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString('en-US')}`
}

export default function PipelinesPage() {
  const { recordActivity } = useAdminData()
  const [deals, setDeals] = useState(buildInitialDeals)
  const [form, setForm] = useState({ account: '', value: '' })

  const totals = useMemo(() => {
    const totalValue = deals.reduce((sum, deal) => sum + Number(deal.value || 0), 0)
    const closedDeals = deals.filter((deal) => deal.stage === 'Closed Deal').length
    return { totalValue, closedDeals }
  }, [deals])

  function save(next) {
    setDeals(next)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  function addDeal(event) {
    event.preventDefault()
    const account = form.account.trim()
    const value = Number(form.value || 0)
    if (!account || value <= 0) return

    const next = [{ id: Date.now(), account, value, stage: 'Lead Review' }, ...deals]
    save(next)
    recordActivity('data', `Created pipeline deal ${account}`)
    setForm({ account: '', value: '' })
  }

  function advanceDeal(id) {
    const target = deals.find((deal) => deal.id === id)
    if (!target) return

    const currentIndex = stageOrder.indexOf(target.stage)
    if (currentIndex >= stageOrder.length - 1) return

    const nextStage = stageOrder[currentIndex + 1]
    const next = deals.map((deal) => (deal.id === id ? { ...deal, stage: nextStage } : deal))
    save(next)
    recordActivity('upgrade', `${target.account} moved to ${nextStage}`)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Sales Pipelines</h2>
        <p className="muted text-sm mt-1">Simple deal tracking with stage progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="theme-surface rounded-2xl p-4">
          <p className="text-[11px] muted-sm">Pipeline value</p>
          <p className="text-2xl font-semibold theme-text mt-1">{formatMoney(totals.totalValue)}</p>
        </div>
        <div className="theme-surface rounded-2xl p-4">
          <p className="text-[11px] muted-sm">Closed deals</p>
          <p className="text-2xl font-semibold theme-text mt-1">{totals.closedDeals}</p>
        </div>
      </div>

      <form onSubmit={addDeal} className="glass rounded-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <input
          required
          value={form.account}
          onChange={(e) => setForm((current) => ({ ...current, account: e.target.value }))}
          className="theme-input rounded-lg px-3 py-2"
          placeholder="Account name"
        />
        <input
          required
          inputMode="numeric"
          value={form.value}
          onChange={(e) => setForm((current) => ({ ...current, value: e.target.value }))}
          className="theme-input rounded-lg px-3 py-2"
          placeholder="Deal value"
        />
        <div className="hidden md:block" />
        <button type="submit" className="theme-button-primary rounded-lg px-4 py-2 font-medium h-[42px]">Add deal</button>
      </form>

      <div className="space-y-2">
        {deals.map((deal) => (
          <div key={deal.id} className="glass rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="font-medium">{deal.account}</p>
              <p className="text-sm muted">{deal.stage} • {formatMoney(deal.value)}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => advanceDeal(deal.id)} disabled={deal.stage === 'Closed Deal'} className="theme-button rounded-lg px-3 py-1.5 text-sm disabled:opacity-40">Advance</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
