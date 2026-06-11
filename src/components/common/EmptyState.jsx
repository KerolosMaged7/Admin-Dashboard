export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="glass rounded-2xl p-6 text-center surface-elevated">
      <h3 className="text-base font-semibold theme-text">{title}</h3>
      <p className="muted text-xs mt-1 max-w-md mx-auto leading-6">{description}</p>
      {actionLabel && onAction ? (
        <button onClick={onAction} className="theme-button-primary rounded-lg px-3 py-1.5 font-medium mt-3 text-sm focus-ring">
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
