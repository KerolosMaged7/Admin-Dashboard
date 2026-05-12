export default function ProductPricingPanel({ product, onEdit, onDuplicate, onDelete, disableDuplicate }) {
  return (
    <div className="glass rounded-2xl p-5 animate-fade-up hover-lift hover-glow">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[1.6px] theme-subtle-sm">Pricing</p>
          <h3 className="font-display text-xl font-semibold theme-text mt-1">{product?.name}</h3>
          <p className="theme-subtle mt-1">Subscription options and plan economics.</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
          Updated
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl theme-surface p-4">
          <p className="text-[11px] theme-subtle-sm">Current price</p>
          <p className="text-lg font-semibold theme-text mt-1">${product?.price ?? 0} / mo</p>
        </div>
        <div className="rounded-xl theme-surface p-4">
          <p className="text-[11px] theme-subtle-sm">MRR</p>
          <p className="text-lg font-semibold theme-text mt-1">${product?.mrr?.toLocaleString?.() ?? product?.mrr ?? 0}</p>
        </div>
        <div className="rounded-xl theme-surface p-4">
          <p className="text-[11px] theme-subtle-sm">Tier</p>
          <p className="text-lg font-semibold theme-text mt-1 capitalize">{product?.status}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={onEdit} className="theme-button-primary px-3 py-2 rounded-lg font-medium hover-press">Update pricing</button>
        <button
          onClick={onDuplicate}
          disabled={disableDuplicate}
          className={`theme-button px-3 py-2 rounded-lg font-medium hover-press ${disableDuplicate ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Duplicate
        </button>
        <button onClick={onDelete} className="theme-button-danger px-3 py-2 rounded-lg font-medium hover-press">Delete</button>
      </div>
    </div>
  )
}
