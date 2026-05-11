export function Badge({ variant = 'info', icon, children, size = 'md' }) {
  const variants = {
    success: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
    warning: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    danger:  'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]',
    info:    'bg-brand-50 text-brand-600 border-brand-500/20',
    neutral: 'bg-ink-100 text-ink-900 border-ink-100',
  };
  const sizes = {
    sm: 'text-[11px] px-2 h-5',
    md: 'text-xs px-2.5 h-6',
    lg: 'text-[13px] px-3 h-7',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variants[variant]} ${sizes[size]}`}>
      {icon && <span className="shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5">{icon}</span>}
      {children}
    </span>
  );
}
