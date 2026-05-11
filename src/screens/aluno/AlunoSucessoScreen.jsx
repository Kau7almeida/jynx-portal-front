import { I } from '../../components/icons'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { useData } from '../../lib/DataContext'

export function AlunoSucessoScreen({ aluno, turmaId, onClose }) {
  const { turmas } = useData()
  const turma = turmas.find(t => t.id === turmaId) || turmas[0]
  const a = aluno || { full_name: 'Aluno', email: '' }
  const now = new Date();
  const fmtTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const fmtDate = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-full bg-white flex flex-col">
      {/* Top spacer with subtle gradient */}
      <div className="h-32 bg-gradient-to-b from-brand-50 to-transparent" />

      <div className="flex-1 px-6 -mt-16 flex flex-col items-center text-center">
        {/* Animated check */}
        <div className="relative animate-checkPop">
          <div className="absolute inset-0 -m-4 rounded-full bg-success/15 blur-xl" />
          <div className="relative w-24 h-24 rounded-full bg-success flex items-center justify-center shadow-[0_12px_28px_-8px_rgba(16,185,129,0.45)]">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path
                d="M11 22 L19 30 L33 14"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="60"
                strokeDashoffset="60"
                className="animate-checkDraw"
              />
            </svg>
          </div>
        </div>

        <h1 className="mt-7 text-[26px] font-bold tracking-tight text-ink-900">Presença Confirmada!</h1>
        <p className="mt-2 text-[14px] text-ink-500 max-w-[280px] leading-relaxed">
          Sua presença foi registrada com sucesso na chamada.
        </p>

        {/* Info card */}
        <div className="mt-7 w-full max-w-[320px] bg-white border border-ink-100 rounded-2xl shadow-card p-5 text-left">
          <div className="flex items-center gap-3 pb-4 border-b border-ink-100">
            <Avatar name={a.full_name} size={40} />
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-ink-900 truncate">{a.full_name}</div>
              <div className="text-[12px] text-ink-500">{a.email}</div>
            </div>
          </div>

          <dl className="pt-4 space-y-2.5 text-[13px]">
            <div className="flex items-center justify-between">
              <dt className="text-ink-500">Turma</dt>
              <dd className="font-medium text-ink-900 text-right max-w-[60%] truncate">{turma?.name || ''}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink-500">Data</dt>
              <dd className="font-medium text-ink-900 num">{fmtDate}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink-500">Horário</dt>
              <dd className="font-medium text-ink-900 num">{fmtTime}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink-500">Status</dt>
              <dd><Badge variant="success" size="sm" icon={<I.Check />}>Registrado</Badge></dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="px-6 pt-5 pb-7 text-center">
        <p className="text-[12px] text-ink-500">Você já pode fechar esta página.</p>
        <button onClick={onClose} className="mt-3 text-[13px] font-semibold text-brand-500 hover:text-brand-600 inline-flex items-center gap-1">
          <I.ArrowLeft /> Voltar para o início
        </button>
      </div>
    </div>
  );
}
