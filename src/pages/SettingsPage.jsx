import { useState } from 'react'

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div className="bg-[#14162A] p-6 rounded-2xl border border-white/10 max-w-xl">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
        <div>
          <p className="font-medium">Dark Mode</p>
          <p className="text-sm text-white/50">Toggle dashboard appearance.</p>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-emerald-500' : 'bg-gray-500'}`}
        >
          {darkMode ? 'Enabled' : 'Disabled'}
        </button>
      </div>
    </div>
  )
}
