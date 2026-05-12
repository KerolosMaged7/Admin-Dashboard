import {
  LayoutDashboard, BarChart2, Users, CreditCard, Package,
  Bell, Settings,
} from 'lucide-react'
import { useState } from 'react'
import { navItems } from '../data'

const iconMap = { LayoutDashboard, BarChart2, Users, CreditCard, Package, Bell, Settings }

const NAV_GROUPS = [
  { label: 'Main',    items: navItems.slice(0, 4) },
  { label: 'Product', items: navItems.slice(4, 7) },
  { label: null, items: navItems.slice(7) },
]

export default function Sidebar({ activeNav, setActiveNav, isOpen, setIsOpen }) {
  const [photoFailed, setPhotoFailed] = useState(false)

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 md:hidden z-10 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside
        className={`fixed md:sticky top-0 left-0 z-20 flex flex-col h-screen w-[220px] shrink-0 overflow-hidden bg-[#14162A] border-r border-white/10 shadow-[12px_0_40px_rgba(10,14,30,0.18)] transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* glow blobs */}
        <div className="absolute -top-12 -left-12 w-44 h-44 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-36 h-36 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="px-6 pt-7 pb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.9)]" />
          <span className="font-display font-bold text-[19px] text-white tracking-tight">Admin Dashboard</span>
        </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {group.label && (
              <p className="text-[9.5px] font-semibold text-white/35 tracking-[1.5px] uppercase px-3 pt-4 pb-1">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = iconMap[item.icon]
              const isActive = activeNav === item.label
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveNav(item.label)}
                  className={`w-full flex items-center gap-2.5 px-3 py-[8px] rounded-lg text-[13px] mb-0.5 transition-all border-l-2 hover-press hover-shine ${
                    isActive
                      ? 'bg-indigo-500/20 text-white font-medium border-indigo-500 shadow-[0_0_0_1px_rgba(99,102,241,0.15)]'
                      : 'text-white/55 hover:text-white hover:bg-white/5 border-transparent'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-indigo-400' : ''} />
                  {item.label}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          {!photoFailed ? (
            <img
              src="/profile.jpg"
              alt="Kerolos Maged"
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/20"
              onError={() => setPhotoFailed(true)}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-[11px] font-semibold text-white shrink-0">
              KM
            </div>
          )}
          <div>
            <p className="text-[13px] font-medium text-white leading-tight">Kerolos Maged</p>
            <p className="text-[11px] text-white/45">Super Admin</p>
          </div>
        </div>
      </div>
      </aside>
    </>
  )
}
