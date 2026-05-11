export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="relative mb-6">
        <div className="absolute inset-0 -m-3 rounded-full bg-brand-50 blur-xl opacity-70" />
        <div className="relative w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-500 [&>svg]:w-7 [&>svg]:h-7">
          {icon}
        </div>
      </div>
      <h3 className="text-base font-semibold text-ink-900 mb-1.5">{title}</h3>
      <p className="text-[13px] text-ink-500 max-w-[280px] leading-relaxed">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
