import RevenueChart from '../components/RevenueChart'

export default function RevenuePage() {
  return (
    <div className="space-y-4">
      <div className="bg-[#14162A] p-6 rounded-2xl border border-white/10">
        <h2 className="text-2xl font-bold mb-2">Revenue Overview</h2>
        <p className="text-white/50">Track your monthly revenue performance and targets.</p>
      </div>
      <RevenueChart />
    </div>
  )
}
