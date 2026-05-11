import { I } from '../../components/icons'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'

export function DetalheScreen({ onBack }) {
  return (
    <div className="flex-1 overflow-y-auto scroll-quiet">
      <div className="px-10 py-8">
        <button onClick={onBack} className="text-[13px] font-semibold text-ink-500 hover:text-brand-500 inline-flex items-center gap-1 mb-4">
          <I.ArrowLeft /> Voltar
        </button>

        <Card>
          <EmptyState
            icon={<I.Clock />}
            title="Recurso em desenvolvimento"
            description="Os detalhes de chamadas estarão disponíveis em uma próxima versão."
          />
        </Card>
      </div>
    </div>
  );
}
