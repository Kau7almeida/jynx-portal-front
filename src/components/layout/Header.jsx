import { I } from '../icons'
import { Avatar } from '../ui/Avatar'

export function Header({ greeting = 'Olá, Professor!', subtitle, action }) {
  const today = new Date();
  const fmtDate = today.toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  });

  return (
    <header className="h-[88px] shrink-0 px-10 flex items-center justify-between border-b border-ink-100 bg-white">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink-900">{greeting}</h1>
        <p className="text-[13px] text-ink-500 capitalize">{subtitle || fmtDate}</p>
      </div>
      <div className="flex items-center gap-3">
        {action}
        <button className="relative w-10 h-10 rounded-full border border-ink-100 hover:border-brand-500 hover:bg-brand-50 transition-all flex items-center justify-center text-ink-500 hover:text-brand-500 focus-ring">
          <I.Bell />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white" />
        </button>
        <div className="flex items-center gap-3 pl-3 border-l border-ink-100">
          <Avatar name="Marina Silva" size={40} />
          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-ink-900">Profa. Marina Silva</div>
            <div className="text-[11px] text-ink-500">Engenharia de Software</div>
          </div>
        </div>
      </div>
    </header>
  );
}
