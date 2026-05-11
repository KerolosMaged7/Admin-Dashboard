const products = ['Enterprise Suite', 'CRM Platform', 'Analytics API', 'Marketing AI']

export default function ProductsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products.map((product) => (
        <div key={product} className="bg-[#14162A] p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-semibold mb-2">{product}</h2>
          <p className="text-white/50">Manage product details, pricing, and subscriptions.</p>
        </div>
      ))}
    </div>
  )
}
