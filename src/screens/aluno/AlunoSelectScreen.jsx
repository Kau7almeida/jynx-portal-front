import { useState } from 'react'
import { I } from '../../components/icons'
import { Logo } from '../../components/ui/Logo'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { SearchInput } from '../../components/ui/Input'
import { useData } from '../../lib/DataContext'

export function AlunoSelectScreen({ turmaId, onConfirm, onCancel }) {
  const { turmas, getAlunosDaTurma } = useData()
  const turma = turmas.find(t => t.id === turmaId) || turmas[0]
  const alunosDaTurma = turmaId ? getAlunosDaTurma(turmaId) : []
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const filtered = alunosDaTurma.filter(a =>
    a.full_name.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase()) ||
    a.cpf?.includes(search)
  );

  if (!turma) return null

  return (
    <div className="min-h-full bg-[#FAFAFA] flex flex-col">
      {/* Orange header */}
      <header className="bg-brand-500 text-white px-6 pt-6 pb-8 relative">
        <div className="flex items-center justify-between mb-4">
          <Logo size={28} dark withWordmark />
          <button onClick={onCancel} className="text-white/80 hover:text-white p-1 -m-1"><I.X /></button>
        </div>
        <div className="text-[12px] uppercase tracking-wider text-white/80 font-semibold">Chamada ativa</div>
        <h1 className="mt-1 text-[20px] font-bold leading-tight">{turma.name}</h1>
        <p className="text-[12px] text-white/80 mt-0.5">{turma.curso}</p>

        {/* Floating card overlap */}
        <div className="absolute left-5 right-5 -bottom-6">
          <div className="bg-white rounded-2xl shadow-[0_10px_25px_-10px_rgba(0,0,0,0.18)] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">
                <I.Pulse />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-semibold text-ink-900">Confirmar Presença</div>
                <div className="text-[11px] text-ink-500">Selecione seu nome na lista abaixo</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-5 pt-10 pb-32">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar nome ou email"
          className="mb-4"
        />

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-ink-100 p-6">
            <EmptyState
              icon={<I.Search />}
              title="Nenhum aluno"
              description={search ? `Não encontramos alunos para "${search}".` : 'Nenhum aluno vinculado a esta turma.'}
            />
          </div>
        ) : (
          <ul className="bg-white rounded-2xl border border-ink-100 overflow-hidden divide-y divide-ink-100">
            {filtered.slice(0, 50).map((a) => {
              const sel = selectedId === a.id;
              return (
                <li key={a.id}>
                  <button
                    onClick={() => setSelectedId(a.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                      sel ? 'bg-brand-50 ring-1 ring-brand-500/40' : 'hover:bg-[#FAFAFA]'
                    }`}
                  >
                    <Avatar name={a.full_name} size={36} />
                    <div className="flex-1 min-w-0">
                      <div className={`text-[14px] font-medium truncate ${sel ? 'text-brand-600' : 'text-ink-900'}`}>{a.full_name}</div>
                      <div className="text-[11px] text-ink-500">{a.email}</div>
                    </div>
                    <span className={`shrink-0 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center [&>svg]:w-3 [&>svg]:h-3 ${
                      sel ? 'bg-brand-500 border-brand-500 text-white' : 'border-ink-100 text-transparent'
                    }`}>
                      <I.Check />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Sticky footer button */}
      <div className="sticky bottom-0 left-0 right-0 px-5 pt-3 pb-6 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA] to-transparent">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!selectedId}
          onClick={() => selectedId && onConfirm(alunosDaTurma.find(a => a.id === selectedId))}
          icon={<I.Check />}
        >
          Confirmar Presença
        </Button>
        <p className="mt-3 text-center text-[11px] text-ink-500">
          Sua presença será registrada com seu nome e horário atual.
        </p>
      </div>
    </div>
  );
}
