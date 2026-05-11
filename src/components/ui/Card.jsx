export function Card({ children, className = '', hoverable = false, selected = false, onClick, padding = 'p-6' }) {
  const interactive = hoverable || onClick;
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-card border transition-all duration-200
        ${selected
          ? 'border-brand-500 shadow-cardHover ring-1 ring-brand-500/20'
          : 'border-ink-100 shadow-card'}
        ${interactive && !selected ? 'hover:border-brand-500/60 hover:shadow-cardHover cursor-pointer' : ''}
        ${padding} ${className}
      `}
    >
      {children}
    </div>
  );
}
