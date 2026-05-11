import { I } from '../icons'

export function Modal({ open, onClose, title, children, footer, width = 480 }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeUp" style={{ animationDuration: '180ms' }}>
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-white rounded-card shadow-soft border border-ink-100 w-full animate-scaleIn"
        style={{ maxWidth: width }}
      >
        <div className="px-6 pt-5 pb-3 flex items-start justify-between">
          <h3 className="text-[17px] font-bold text-ink-900">{title}</h3>
          <button onClick={onClose} className="text-ink-500 hover:text-ink-900 focus-ring rounded p-1 -m-1">
            <I.X />
          </button>
        </div>
        <div className="px-6 pb-5 text-sm text-ink-500 leading-relaxed">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-ink-100 flex items-center justify-end gap-2 bg-[#FAFAFA] rounded-b-card">{footer}</div>}
      </div>
    </div>
  );
}
