import { I } from '../../components/icons'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useData } from '../../lib/DataContext'

export function TurmasScreen() {
  const { turmas } = useData()

  return (
    <div className="flex-1 overflow-y-auto scroll-quiet">
      <div className="px-10 py-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-ink-900">Turmas</h1>
            <p className="mt-1 text-[14px] text-ink-500">{turmas.length} turmas ativas.</p>
          </div>
          <Button variant="primary">Nova turma</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {turmas.map(t => (
            <Card key={t.id} hoverable>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-[10px] bg-brand-50 text-brand-500 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">{t.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">{t.curso}</div>
                  <h3 className="text-[16px] font-semibold text-ink-900 leading-tight mt-0.5">{t.name}</h3>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-ink-100 flex items-center justify-between text-[12px]">
                <span className="text-ink-500">{t.alunos} alunos</span>
                <Button variant="ghostBrand" size="sm">Editar</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
