import { useState } from 'react'
import { I } from '../../components/icons'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { SearchInput } from '../../components/ui/Input'
import { useData } from '../../lib/DataContext'

export function SelecaoTurmaScreen({ onStartChamada }) {
  const { turmas } = useData()
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = turmas.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.curso.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto scroll-quiet pb-32">
      <div className="px-10 py-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="info" size="sm">Etapa 1 de 2</Badge>
            <h1 className="mt-3 text-[32px] font-bold tracking-tight text-ink-900 leading-tight">Iniciar Chamada</h1>
            <p className="mt-2 text-[15px] text-ink-500 max-w-xl">
              Selecione a turma para a qual deseja iniciar uma sessão de chamada com QR Code.
            </p>
          </div>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar turma ou curso..."
            className="w-full md:w-80"
          />
        </div>

        {filtered.length === 0 ? (
          <Card>
            <EmptyState
              icon={<I.Search />}
              title="Nenhuma turma encontrada"
              description={`Não encontramos turmas para "${search}". Verifique a busca.`}
              action={<Button variant="secondary" onClick={() => setSearch('')}>Limpar busca</Button>}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((t) => {
              const sel = selectedId === t.id;
              return (
                <Card
                  key={t.id}
                  selected={sel}
                  hoverable
                  onClick={() => setSelectedId(t.id)}
                  className="relative"
                >
                  {sel && (
                    <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4 animate-checkPop">
                      <I.Check />
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center transition-all [&>svg]:w-5 [&>svg]:h-5 ${
                      sel ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-500'
                    }`}>
                      {t.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">{t.curso}</div>
                      <h3 className="text-[16px] font-semibold text-ink-900 mt-0.5 leading-tight">{t.name}</h3>
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-ink-100 text-[12px]">
                    <div>
                      <div className="text-ink-500 mb-0.5">Alunos</div>
                      <div className="font-semibold text-ink-900 num">{t.alunos}</div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky footer with primary action */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-ink-100 px-10 py-5 flex items-center justify-between z-10">
        <div className="text-[13px] text-ink-500">
          {selectedId
            ? <span className="text-ink-900 font-medium">{turmas.find(t => t.id === selectedId)?.name}</span>
            : 'Selecione uma turma para continuar'}
        </div>
        <Button
          variant="primary"
          size="lg"
          icon={<I.Pulse />}
          iconRight={<I.ArrowRight />}
          disabled={!selectedId}
          onClick={() => selectedId && onStartChamada(selectedId)}
        >
          Iniciar Chamada
        </Button>
      </div>
    </div>
  );
}
