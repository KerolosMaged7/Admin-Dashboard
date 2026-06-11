import { useState } from 'react'

export default function ProfilePage() {
  const [photoFailed, setPhotoFailed] = useState(false)

  return (
    <div className="space-y-4 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold theme-text">Profile</h2>
        <p className="muted text-sm mt-1">A concise view of the admin account and workspace footprint.</p>
      </div>

      <div className="glass rounded-3xl p-6 surface-elevated overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start gap-5">
          <div className="relative shrink-0">
            {!photoFailed ? (
              <img
                src="/profile.jpg"
                alt="Kerolos Maged"
                className="w-24 h-24 rounded-3xl object-cover border border-white/20"
                onError={() => setPhotoFailed(true)}
              />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center border border-white/10 shadow-lg">
                <span className="text-2xl font-display font-semibold text-white">KM</span>
              </div>
            )}
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500 text-white shadow-lg">
              Active
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-400/15">
                Super Admin
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-400/15">
                Active workspace access
              </span>
            </div>

            <h3 className="font-display text-2xl font-semibold theme-text leading-tight">Kerolos Maged</h3>
            <p className="muted mt-1">kerolos@admin-dashboard.com</p>
            <p className="muted text-sm mt-3 max-w-2xl leading-6">
              Admin manager profile for quick workspace context and identity.
            </p>
          </div>

          <div className="md:text-right shrink-0">
            <p className="text-[11px] uppercase tracking-[1.6px] muted-sm">Role</p>
            <p className="text-2xl font-semibold theme-text mt-1">Super Admin</p>
            <p className="muted text-sm mt-1">kerolos@admin-dashboard.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}