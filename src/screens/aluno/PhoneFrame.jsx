import { I } from '../../components/icons'

export function PhoneFrame({ children, className = '' }) {
  return (
    <div className={`relative mx-auto ${className}`} style={{ width: 390 }}>
      <div
        className="relative bg-white rounded-[44px] border-[10px] border-[#1A1A1A] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35),0_15px_30px_-10px_rgba(0,0,0,0.2)] overflow-hidden"
        style={{ height: 800 }}
      >
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1A1A1A] rounded-full z-30" />
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-10 px-7 flex items-center justify-between z-20 text-[12px] font-semibold text-ink-900">
          <span>9:41</span>
          <span className="flex items-center gap-1.5 [&>svg]:w-3.5 [&>svg]:h-3.5">
            <I.Wifi />
            <svg viewBox="0 0 24 12" width="22" height="11" fill="currentColor"><rect x="0" y="2" width="18" height="8" rx="2" stroke="currentColor" strokeWidth="1" fill="none"/><rect x="2" y="4" width="13" height="4" rx="1"/><rect x="19" y="4" width="2" height="4" rx="0.5"/></svg>
          </span>
        </div>
        <div className="pt-10 h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
