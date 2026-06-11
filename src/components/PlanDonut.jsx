import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { planData } from '../data'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-3 py-2 text-xs shadow-lg">
        <p style={{ color: payload[0].payload.color }} className="font-semibold">
          {payload[0].name}: {payload[0].value}%
        </p>
      </div>
    )
  }
  return null
}

export default function PlanDonut() {
  const totalShare = planData.reduce((sum, plan) => sum + plan.value, 0)

  return (
    <div className="glass rounded-2xl p-5 animate-fade-up delay-2 surface-elevated">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
        <h3 className="font-display font-semibold text-sm text-[#1a1d2e]">Plan Distribution</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Active subscriptions by tier</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[1.5px] text-gray-400">Total</p>
          <p className="text-sm font-semibold text-[#1a1d2e]">{totalShare}%</p>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-[11.5px] text-gray-500">
        {planData.map((p) => (
          <div key={p.name} className="theme-surface rounded-xl px-2.5 py-2 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-sm inline-block shrink-0" style={{ background: p.color }} />
              <span className="truncate">{p.name}</span>
            </span>
            <span className="font-medium theme-text">{p.value}%</span>
          </div>
        ))}
      </div>

      <div className="relative">
        <ResponsiveContainer width="100%" height={190}>
          <PieChart>
            <Pie
              data={planData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {planData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center">
          <div>
            <p className="text-[10px] uppercase tracking-[1.5px] text-gray-400">Mix</p>
            <p className="font-display text-2xl font-semibold text-[#1a1d2e]">100%</p>
            <p className="text-[11px] text-gray-400 mt-0.5">of active plans</p>
          </div>
        </div>
      </div>
    </div>
  )
}
