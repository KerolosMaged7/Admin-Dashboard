import { DollarSign, Users, RefreshCw, Rocket, TrendingUp, TrendingDown } from 'lucide-react'

const iconMap = { DollarSign, Users, RefreshCw, Rocket }

const colorMap = {
  indigo: {
    icon: 'bg-indigo-100 text-indigo-500',
    blob: 'bg-indigo-500',
  },
  emerald: {
    icon: 'bg-emerald-100 text-emerald-500',
    blob: 'bg-emerald-500',
  },
  cyan: {
    icon: 'bg-cyan-100 text-cyan-500',
    blob: 'bg-cyan-500',
  },
  amber: {
    icon: 'bg-amber-100 text-amber-500',
    blob: 'bg-amber-500',
  },
}

export default function KpiCard({ label, value, change, up, icon, color, delay, onClick }) {
  const Icon = iconMap[icon]
  const c = colorMap[color]
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `Open ${label}` : undefined}
      className={`glass rounded-2xl p-5 relative overflow-hidden animate-fade-up hover-lift hover-glow focus-ring surface-elevated text-left w-full ${delay} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* corner blob */}
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-[0.07] ${c.blob}`} />

      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${c.icon}`}>
        <Icon size={17} />
      </div>

      <p className="text-[11.5px] font-medium text-gray-500 tracking-wide mb-1">{label}</p>
      <p className="font-display text-[26px] font-bold text-kpi leading-none tracking-tight">{value}</p>

      <span
        className={`inline-flex items-center gap-1 text-[11px] font-medium mt-2 px-2 py-0.5 rounded-full ${
          up ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'
        }`}
      >
        {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {change}
      </span>
    </Component>
  )
}
