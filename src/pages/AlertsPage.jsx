import { useState } from 'react'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([
    'Server CPU usage is high',
    'New user registration spike detected',
    'Payment gateway delay reported',
  ])

  return (
    <div className="bg-[#14162A] p-6 rounded-2xl border border-white/10">
      <h2 className="text-2xl font-bold mb-5">System Alerts</h2>
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div key={index} className="flex justify-between items-center bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p>{alert}</p>
            <button
              onClick={() => setAlerts(alerts.filter((_, i) => i !== index))}
              className="bg-red-500 px-3 py-1 rounded-lg text-sm"
            >
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
