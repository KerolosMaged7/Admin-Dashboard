import { useMemo } from 'react'
import KpiCard from '../components/KpiCard'
import RevenueChart from '../components/RevenueChart'
import PlanDonut from '../components/PlanDonut'
import UsersTable from '../components/UsersTable'
import ActivityFeed from '../components/ActivityFeed'
import { useAdminData } from '../context/useAdminData'

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString('en-US')}`
}

export default function DashboardPage({ setActiveNav }) {
  const { metrics } = useAdminData()

  const dashboardKpis = useMemo(() => [
    {
      id: 1,
      label: 'Tracked Revenue',
      value: formatMoney(metrics.totalTrackedRevenue),
      change: 'Live CRUD total',
      up: true,
      icon: 'DollarSign',
      color: 'indigo',
      drilldown: 'Revenue',
    },
    {
      id: 2,
      label: 'Active Users',
      value: metrics.activeUsers.toLocaleString(),
      change: `${metrics.trialUsers.toLocaleString()} in trial`,
      up: true,
      icon: 'Users',
      color: 'emerald',
      drilldown: 'Users',
    },
    {
      id: 3,
      label: 'Active Products',
      value: metrics.activeProducts.toLocaleString(),
      change: `${metrics.betaProducts.toLocaleString()} in beta`,
      up: true,
      icon: 'RefreshCw',
      color: 'cyan',
      drilldown: 'Products',
    },
    {
      id: 4,
      label: 'Subscribers',
      value: metrics.totalSubscribers.toLocaleString(),
      change: `${metrics.totalUsers.toLocaleString()} user accounts`,
      up: true,
      icon: 'Rocket',
      color: 'amber',
      drilldown: 'Products',
    },
  ], [metrics])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        {dashboardKpis.map((kpi, i) => (
          <KpiCard key={kpi.id} {...kpi} delay={`delay-${i + 1}`} onClick={() => setActiveNav(kpi.drilldown)} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-4 mb-5">
        <RevenueChart />
        <PlanDonut />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">
        <UsersTable onViewAll={() => setActiveNav('Users')} />
        <ActivityFeed />
      </div>
    </>
  )
}
