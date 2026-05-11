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
  return (
    <div className="glass rounded-2xl p-5 animate-fade-up delay-2">
      <div className="mb-4">
        <h3 className="font-display font-semibold text-sm text-[#1a1d2e]">Plan Distribution</h3>
        <p className="text-[11px] text-gray-400 mt-0.5">Active subscriptions by tier</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-3">
        {planData.map((p) => (
          <span key={p.name} className="flex items-center gap-1.5 text-[11.5px] text-gray-500">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: p.color }} />
            {p.name} {p.value}%
          </span>
        ))}
      </div>

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
    </div>
  )
}
