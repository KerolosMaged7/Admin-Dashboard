import { useAdminData } from '../context/useAdminData'
import RevenueChart from '../components/RevenueChart'

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString('en-US')}`
}

export default function RevenuePage() {
  const { metrics } = useAdminData()

  return (
    <div className="space-y-4">
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-2">Revenue Overview</h2>
        <p className="muted">Track your monthly revenue performance and targets, compare vs target, and inspect recent spikes.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/5">
            <p className="text-sm muted">Tracked revenue</p>
            <p className="text-xl font-semibold">{formatMoney(metrics.totalTrackedRevenue)}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5">
            <p className="text-sm muted">Product MRR</p>
            <p className="text-xl font-semibold text-emerald-300">{formatMoney(metrics.totalProductMRR)}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5">
            <p className="text-sm muted">Subscribers</p>
            <p className="text-xl font-semibold">{metrics.totalSubscribers.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl glass p-4">
        <RevenueChart />
      </div>
    </div>
  )
}
