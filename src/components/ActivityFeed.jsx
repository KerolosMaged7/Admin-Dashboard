import { ArrowUpCircle, CreditCard, UserPlus, AlertCircle, Database } from 'lucide-react'
import { useAdminData } from '../context/useAdminData'

const typeConfig = {
  upgrade: { icon: ArrowUpCircle, bg: 'bg-amber-50',   text: 'text-amber-500'  },
  payment: { icon: CreditCard,    bg: 'bg-emerald-50', text: 'text-emerald-500'},
  user:    { icon: UserPlus,      bg: 'bg-indigo-50',  text: 'text-indigo-500' },
  alert:   { icon: AlertCircle,   bg: 'bg-red-50',     text: 'text-red-400'    },
  data:    { icon: Database,      bg: 'bg-cyan-50',    text: 'text-cyan-500'   },
}

export default function ActivityFeed() {
  const { activity, clearActivity, canUndo, canRedo, undo, redo } = useAdminData()
  const items = activity

  return (
    <div className="glass rounded-2xl p-5 animate-fade-up delay-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-sm text-[#1a1d2e]">Recent Activity</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Live event stream</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={undo} disabled={!canUndo} className="text-[11px] font-medium text-gray-400 hover:text-gray-600 disabled:opacity-40 transition-colors">
            Undo
          </button>
          <button onClick={redo} disabled={!canRedo} className="text-[11px] font-medium text-gray-400 hover:text-gray-600 disabled:opacity-40 transition-colors">
            Redo
          </button>
          <button onClick={clearActivity} className="text-[11px] font-medium text-gray-400 hover:text-gray-600 transition-colors">
            Clear log
          </button>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live inline-block" />
            Live
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        {items.length === 0 ? (
          <p className="text-[11px] text-gray-400">No activity yet.</p>
        ) : items.map((item, i) => {
          const cfg = typeConfig[item.type]
          const Icon = cfg.icon
          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 py-2.5 ${
                i < items.length - 1 ? 'border-b border-indigo-50' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg}`}>
                <Icon size={15} className={cfg.text} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] text-[#1a1d2e] leading-5">{item.text}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{item.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
