export function Logo({ size = 32, withWordmark = true, dark = false }) {
  const ink = dark ? '#FFFFFF' : '#1A1A1A';
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect x="0" y="0" width="32" height="32" rx="8" fill="#FF6B00" />
        <path d="M10.5 9.5h11M16 9.5v11.2c0 1.7-1.4 3.1-3.1 3.1h-1.4" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="22.2" cy="22" r="1.6" fill="#FFFFFF" />
      </svg>
      {withWordmark && (
        <div className="leading-none">
          <div className="font-bold text-[15px] tracking-tight" style={{ color: ink }}>jynx</div>
          <div className="text-[10px] font-medium tracking-[0.14em] uppercase" style={{ color: dark ? '#FFFFFFB3' : '#9CA3AF' }}>educação</div>
        </div>
      )}
    </div>
  );
}
