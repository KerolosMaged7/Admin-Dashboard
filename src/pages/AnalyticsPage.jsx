import { useEffect, useRef, useState } from 'react'
import { LineChart, Line, XAxis, Tooltip, CartesianGrid } from 'recharts'
import { revenueData } from '../data'

const stats = [
  { title: 'Visitors', value: '98.2K' },
  { title: 'Conversion Rate', value: '4.8%' },
  { title: 'Bounce Rate', value: '28%' },
]

export default function AnalyticsPage() {
  const [chartWidth, setChartWidth] = useState(0)
  const chartWrapRef = useRef(null)

  useEffect(() => {
    if (!chartWrapRef.current) return undefined

    const element = chartWrapRef.current
    const updateWidth = () => {
      setChartWidth(element.clientWidth || 0)
    }

    updateWidth()

    const observer = new ResizeObserver(updateWidth)
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((item) => (
          <div key={item.title} className="glass p-6 rounded-2xl">
            <p className="muted mb-2">{item.title}</p>
            <h2 className="text-3xl font-bold">{item.value}</h2>
            <p className="text-sm muted mt-2">Detailed metrics and recent trends.</p>
          </div>
        ))}
      </div>

      <div className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-3">Monthly Visitors Trend</h3>
        <div ref={chartWrapRef} className="w-full h-[220px] min-w-0 overflow-hidden">
          {chartWidth > 0 && (
            <LineChart width={chartWidth} height={220} data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.6)' }} />
              <Tooltip />
              <Line type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={3} dot={false} />
            </LineChart>
          )}
        </div>
      </div>
    </div>
  )
}
