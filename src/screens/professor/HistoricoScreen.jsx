import { I } from '../../components/icons'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'

export function HistoricoScreen() {
  return (
    <div className="flex-1 overflow-y-auto scroll-quiet">
      <div className="px-10 py-8">
        <div className="mb-6">
          <h1 className="text-[28px] font-bold tracking-tight text-ink-900">Histórico de Chamadas</h1>
          <p className="mt-1 text-[14px] text-ink-500">Visualize registros das chamadas realizadas.</p>
        </div>

        <Card>
          <EmptyState
            icon={<I.Clock />}
            title="Recurso em desenvolvimento"
            description="O histórico de chamadas estará disponível em uma próxima versão."
          />
        </Card>
      </div>
    </div>
  );
}
