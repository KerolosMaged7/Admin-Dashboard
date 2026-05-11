const pipelines = ['Lead Review', 'Sales Call', 'Contract Sent', 'Closed Deal']

export default function PipelinesPage() {
  return (
    <div className="bg-[#14162A] p-6 rounded-2xl border border-white/10">
      <h2 className="text-2xl font-bold mb-5">Sales Pipelines</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {pipelines.map((step, index) => (
          <div key={step} className="bg-white/5 rounded-xl p-4">
            <p className="text-sm text-white/50 mb-2">Stage {index + 1}</p>
            <h3 className="font-semibold">{step}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
