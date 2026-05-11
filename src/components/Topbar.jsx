import { Bell, Calendar } from 'lucide-react'

export default function Topbar({ activeNav }) {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="flex items-center justify-between mb-7">
      <div>
        <h1 className="font-display text-[22px] font-bold text-[#1a1d2e] tracking-tight leading-none">
          {activeNav}
        </h1>
        <p className="text-[12px] text-gray-400 mt-1">Welcome back, Alex — here's what's happening.</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-[12px] text-gray-500 glass rounded-full px-3.5 py-1.5">
          <Calendar size={12} className="text-indigo-400" />
          {today}
        </span>
        <button className="relative w-9 h-9 rounded-xl glass flex items-center justify-center hover:bg-white/70 transition-colors">
          <Bell size={16} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 border-2 border-[#f0f2ff]" />
        </button>
      </div>
    </div>
  )
}
