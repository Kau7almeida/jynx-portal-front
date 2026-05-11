import { I } from '../../components/icons'
import { StatCard } from '../../components/ui/StatCard'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { useData } from '../../lib/DataContext'

export function DashboardScreen({ onNavigate, onStartChamada }) {
  const { turmas, loading } = useData()

  const totalAlunos = turmas.reduce((sum, t) => sum + t.alunos, 0)
  const primeiraTurma = turmas[0]

  return (
    <div className="flex-1 overflow-y-auto scroll-quiet">
      <div className="px-10 py-8">

        {/* Stats row */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
          <StatCard icon={<I.Users />}    label="Total de turmas"          value={turmas.length}    tone="brand" />
          <StatCard icon={<I.Mortar />}   label="Total de alunos"          value={totalAlunos}       tone="info" />
          <StatCard icon={<I.Check />}    label="Presença média"           value="—"                 tone="success" />
        </section>

        {/* Hero — quick chamada */}
        {primeiraTurma && (
          <section className="mb-10">
            <Card padding="p-0" className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]">
                <div className="p-8 lg:p-10">
                  <Badge variant="info" size="sm">Próxima aula</Badge>
                  <h2 className="mt-4 text-[28px] font-bold tracking-tight text-ink-900 leading-tight">
                    {primeiraTurma.name}
                  </h2>
                  <p className="mt-2 text-[14px] text-ink-500">
                    {primeiraTurma.curso} · {primeiraTurma.alunos} alunos matriculados
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button variant="primary" size="lg" icon={<I.Pulse />} onClick={() => onStartChamada(primeiraTurma.id)}>
                      Iniciar chamada agora
                    </Button>
                    <Button variant="secondary" size="lg" onClick={() => onNavigate('chamada')}>
                      Ver outras turmas
                    </Button>
                  </div>
                </div>
                <div className="relative bg-gradient-to-br from-brand-50 to-white border-l border-ink-100 p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <div className="text-[12px] font-semibold uppercase tracking-wider text-brand-600 mb-3">Resumo</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[44px] font-bold tracking-tight num text-ink-900 leading-none">{primeiraTurma.alunos}</span>
                      <span className="text-[18px] font-semibold text-ink-500">alunos</span>
                    </div>
                    <div className="mt-1 text-[13px] text-ink-500">matriculados nesta turma</div>
                  </div>
                  <div className="mt-6">
                    <ProgressBar value={primeiraTurma.alunos} max={primeiraTurma.alunos || 1} tone="success" />
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Turmas */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h3 className="text-[17px] font-bold text-ink-900">Suas turmas</h3>
              <p className="text-[13px] text-ink-500">Selecione uma para iniciar a chamada</p>
            </div>
            <button onClick={() => onNavigate('chamada')} className="text-[13px] font-semibold text-brand-500 hover:text-brand-600 inline-flex items-center gap-1">
              Ver todas <I.ArrowRight />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {turmas.slice(0, 6).map((t) => (
              <button
                key={t.id}
                onClick={() => onStartChamada(t.id)}
                className="group text-left bg-white border border-ink-100 rounded-card p-5 hover:border-brand-500/60 hover:shadow-cardHover transition-all duration-200 focus-ring"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-[10px] bg-brand-50 text-brand-500 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 group-hover:scale-110 transition-transform">
                    {t.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">{t.curso}</div>
                    <div className="text-[15px] font-semibold text-ink-900 truncate mt-0.5">{t.name}</div>
                    <div className="mt-3 flex items-center gap-3 text-[12px] text-ink-500">
                      <span>{t.alunos} alunos</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
