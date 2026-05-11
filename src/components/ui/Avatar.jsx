export function Avatar({ name, size = 40, className = '' }) {
  const initials = (name || '??')
    .split(' ').filter(Boolean).slice(0, 2)
    .map((s) => s[0]).join('').toUpperCase();
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-brand-50 text-brand-600 font-semibold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}
