const stats = [
  { title: 'Visitors', value: '98.2K' },
  { title: 'Conversion Rate', value: '4.8%' },
  { title: 'Bounce Rate', value: '28%' },
]

export default function AnalyticsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((item) => (
        <div key={item.title} className="bg-[#14162A] p-6 rounded-2xl border border-white/10">
          <p className="text-white/50 mb-2">{item.title}</p>
          <h2 className="text-3xl font-bold">{item.value}</h2>
        </div>
      ))}
    </div>
  )
}
