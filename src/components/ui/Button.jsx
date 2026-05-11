export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  disabled,
  onClick,
  type = 'button',
  className = '',
  children,
  fullWidth = false,
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-[10px] transition-all duration-200 focus-ring select-none';
  const sizes = {
    sm: 'h-9 px-3.5 text-[13px]',
    md: 'h-11 px-5 text-sm',
    lg: 'h-[52px] px-7 text-[15px]',
  };
  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 hover:shadow-[0_6px_16px_-4px_rgba(255,107,0,0.45)] active:scale-[0.98] disabled:bg-ink-100 disabled:text-ink-500 disabled:hover:bg-ink-100 disabled:hover:shadow-none disabled:active:scale-100 disabled:cursor-not-allowed',
    secondary: 'bg-white text-ink-900 border border-ink-100 hover:border-brand-500 hover:text-brand-500 hover:bg-brand-50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'bg-white text-[#B91C1C] border border-[#FECACA] hover:bg-[#FEF2F2] hover:border-[#EF4444] active:scale-[0.98]',
    ghost: 'bg-transparent text-ink-900 hover:bg-ink-100 active:scale-[0.98]',
    ghostBrand: 'bg-transparent text-brand-500 hover:bg-brand-50 active:scale-[0.98]',
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {icon && <span className="shrink-0 [&>svg]:w-[18px] [&>svg]:h-[18px]">{icon}</span>}
      <span>{children}</span>
      {iconRight && <span className="shrink-0 [&>svg]:w-[18px] [&>svg]:h-[18px]">{iconRight}</span>}
    </button>
  );
}
