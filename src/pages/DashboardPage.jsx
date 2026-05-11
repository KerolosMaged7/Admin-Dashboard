import KpiCard from '../components/KpiCard'
import RevenueChart from '../components/RevenueChart'
import PlanDonut from '../components/PlanDonut'
import UsersTable from '../components/UsersTable'
import ActivityFeed from '../components/ActivityFeed'
import { kpiData } from '../data'

export default function DashboardPage() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        {kpiData.map((kpi, i) => (
          <KpiCard key={kpi.id} {...kpi} delay={`delay-${i + 1}`} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-4 mb-5">
        <RevenueChart />
        <PlanDonut />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">
        <UsersTable />
        <ActivityFeed />
      </div>
    </>
  )
}
