export default function ProductManagePanel({ product, onEdit, onDuplicate, onDelete, disableDuplicate }) {
  return (
    <div className="glass rounded-2xl p-5 animate-fade-up hover-lift hover-glow">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[1.6px] theme-subtle-sm">Manage product</p>
          <h3 className="font-display text-xl font-semibold theme-text mt-1">{product?.name}</h3>
          <p className="theme-subtle mt-1">{product?.desc}</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-500/15 text-indigo-600 capitalize dark:text-indigo-300">
          {product?.status || 'active'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl theme-surface p-4">
          <p className="text-[11px] theme-subtle-sm">Subscribers</p>
          <p className="text-lg font-semibold theme-text mt-1">{product ? product.subscribers.toLocaleString() : '0'}</p>
        </div>
        <div className="rounded-xl theme-surface p-4">
          <p className="text-[11px] theme-subtle-sm">Price / month</p>
          <p className="text-lg font-semibold theme-text mt-1">${product?.price ?? 0}</p>
        </div>
        <div className="rounded-xl theme-surface p-4">
          <p className="text-[11px] theme-subtle-sm">Team</p>
          <p className="text-lg font-semibold theme-text mt-1">{product?.team}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={onEdit} className="theme-button-primary px-3 py-2 rounded-lg font-medium hover-press">Edit product</button>
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
