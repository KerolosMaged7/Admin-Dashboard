export default function Modal({ title, subtitle, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-[#0b1220]/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl glass rounded-3xl p-6 shadow-2xl animate-fade-up hover-lift">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-[11px] uppercase tracking-[1.6px] theme-subtle-sm">Admin action</p>
            <h3 className="font-display text-2xl font-semibold theme-text mt-1">{title}</h3>
            {subtitle ? <p className="theme-subtle mt-1">{subtitle}</p> : null}
          </div>
          <button onClick={onClose} className="px-3 py-2 rounded-lg bg-white/55 text-[#1a1d2e] font-medium dark:bg-white/10 dark:text-white hover-press">
            Close
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
