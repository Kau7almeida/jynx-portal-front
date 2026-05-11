import { I } from '../icons'
import { Logo } from '../ui/Logo'

export function Sidebar({ active, onNavigate }) {
  const items = [
    { id: 'dashboard',  label: 'Dashboard',     icon: <I.Home /> },
    { id: 'chamada',    label: 'Chamada',       icon: <I.Pulse />, primary: true },
    { id: 'turmas',     label: 'Turmas',        icon: <I.Users /> },
    { id: 'historico',  label: 'Histórico',     icon: <I.Clock /> },
    { id: 'admin',      label: 'Admin',         icon: <I.Shield /> },
    { id: 'config',     label: 'Configurações', icon: <I.Cog /> },
  ];

  return (
    <aside className="w-64 shrink-0 h-full bg-white border-r border-ink-100 flex flex-col">
      <div className="px-6 py-6 border-b border-ink-100">
        <Logo />
      </div>
      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        {items.map((item) => {
          const isActive = active === item.id || (item.id === 'chamada' && active === 'chamada-ativa');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                group flex items-center gap-3 h-11 px-3.5 rounded-[10px] text-sm font-medium
                transition-all duration-200 focus-ring text-left
                ${isActive
                  ? 'bg-brand-500 text-white shadow-[0_4px_12px_-2px_rgba(255,107,0,0.35)]'
                  : 'text-ink-900 hover:bg-brand-50 hover:text-brand-600'}
              `}
            >
              <span className={`shrink-0 [&>svg]:w-[18px] [&>svg]:h-[18px] ${isActive ? 'text-white' : 'text-ink-500 group-hover:text-brand-500'}`}>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.primary && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              )}
            </button>
          );
        })}
      </nav>
      <div className="px-3 pb-5">
        <div className="rounded-card bg-brand-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-brand-500 [&>svg]:w-4 [&>svg]:h-4"><I.Sparkle /></span>
            <span className="text-[13px] font-semibold text-ink-900">Tela do aluno</span>
          </div>
          <p className="text-[12px] leading-relaxed text-ink-500 mb-3">
            Visualize a experiência mobile do aluno ao escanear o QR.
          </p>
          <button
            onClick={() => onNavigate('aluno')}
            className="text-[12px] font-semibold text-brand-600 hover:text-brand-500 transition-colors inline-flex items-center gap-1"
          >
            Abrir preview <I.ArrowRight />
          </button>
        </div>
      </div>
    </aside>
  );
}
