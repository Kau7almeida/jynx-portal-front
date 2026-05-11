import { I } from '../icons'

export function Input({ label, value, onChange, placeholder, type = 'text', icon, className = '', id }) {
  return (
    <label className={`block ${className}`} htmlFor={id}>
      {label && <span className="block text-[13px] font-medium text-ink-900 mb-1.5">{label}</span>}
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 [&>svg]:w-[18px] [&>svg]:h-[18px]">{icon}</span>}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-11 ${icon ? 'pl-10' : 'pl-3.5'} pr-3.5 bg-white border border-ink-100 rounded-[10px] text-sm text-ink-900 placeholder:text-ink-500 focus-ring transition-all duration-200 hover:border-ink-500/40`}
        />
      </div>
    </label>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Buscar...', className = '' }) {
  return (
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      icon={<I.Search />}
    />
  );
}
