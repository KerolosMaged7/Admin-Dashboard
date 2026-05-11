import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart,
} from 'recharts'
import { revenueData } from '../data'

const PERIODS = ['1W', '1M', '6M', '1Y']

const sliceMap = { '1W': 4, '1M': 6, '6M': 9, '1Y': 12 }

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-3 py-2 text-xs shadow-lg">
        <p className="font-semibold text-[#1a1d2e] mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ color: p.color }} className="leading-5">
            {p.name}: ${(p.value / 1000).toFixed(1)}k
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function RevenueChart() {
  const [period, setPeriod] = useState('1Y')
  const data = revenueData.slice(-sliceMap[period])

  return (
    <div className="glass rounded-2xl p-5 animate-fade-up delay-1">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-sm text-[#1a1d2e]">Revenue Overview</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Monthly recurring revenue trend</p>
        </div>
        <div className="flex gap-1 bg-indigo-50 rounded-lg p-0.5">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-all ${
                period === p
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-3">
        <span className="flex items-center gap-1.5 text-[11.5px] text-gray-400">
          <span className="w-3 h-0.5 bg-indigo-500 rounded inline-block" />
          MRR
        </span>
        <span className="flex items-center gap-1.5 text-[11.5px] text-gray-400">
          <span className="w-3 h-0 border-t border-dashed border-cyan-400 inline-block" />
          Target
        </span>
      </div>

      <ResponsiveContainer width="100%" height={210}>
        <ComposedChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="mrr"
            name="MRR"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#mrrGrad)"
            dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#6366f1' }}
          />
          <Line
            type="monotone"
            dataKey="target"
            name="Target"
            stroke="#06b6d4"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
