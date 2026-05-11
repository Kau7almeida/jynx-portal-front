import { useState, useEffect, useCallback } from 'react'
import { I } from '../../components/icons'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { EmptyState } from '../../components/ui/EmptyState'
import { QRCode } from '../../components/ui/QRCode'
import { useData } from '../../lib/DataContext'

function QRBlock({ turma, seconds, fmtTime, compact = false, large = false }) {
  const qrSize = large ? 460 : compact ? 220 : 340;
  return (
    <div className="flex flex-col items-center text-center max-w-[560px]">
      {!compact && (
        <>
          <Badge variant="info" size="md" icon={<I.Wifi />}>Sessão ao vivo</Badge>
          <h2 className="mt-4 text-[24px] lg:text-[28px] font-bold text-ink-900 tracking-tight">{turma.name}</h2>
          <p className="mt-1 text-[13px] text-ink-500">{turma.curso} · Aponte a câmera para começar</p>
        </>
      )}

      <div className={`relative ${compact ? 'mt-0' : 'mt-7'} bg-white p-5 rounded-2xl shadow-card border border-ink-100 animate-qrPulse`}>
        <span className="absolute -top-1 -left-1 w-5 h-5 border-t-[3px] border-l-[3px] border-brand-500 rounded-tl-lg" />
        <span className="absolute -top-1 -right-1 w-5 h-5 border-t-[3px] border-r-[3px] border-brand-500 rounded-tr-lg" />
        <span className="absolute -bottom-1 -left-1 w-5 h-5 border-b-[3px] border-l-[3px] border-brand-500 rounded-bl-lg" />
        <span className="absolute -bottom-1 -right-1 w-5 h-5 border-b-[3px] border-r-[3px] border-brand-500 rounded-br-lg" />
        <QRCode value={`jynx-${turma.id}`} size={qrSize} />
      </div>

      {!compact && (
        <p className="mt-6 text-[14px] text-ink-900 max-w-sm leading-relaxed">
          Aponte a câmera do seu celular para o QR Code para registrar sua presença.
        </p>
      )}

      <div className={`${compact ? 'mt-3' : 'mt-5'} inline-flex items-center gap-2 px-4 h-9 rounded-full bg-white border border-ink-100 shadow-card`}>
        <I.Clock />
        <span className="text-[13px] text-ink-500">Sessão expira em</span>
        <span className="text-[14px] font-bold text-ink-900 num tabular-nums">{fmtTime(seconds)}</span>
      </div>
    </div>
  );
}

function PresencasTable({
  presentes,
  total,
  pct,
  animClass,
  selectedIds,
  allSelected,
  onToggleSelection,
  onToggleAll,
  onDelete,
  onDeleteSelected,
  onDeleteAll,
  onClearSelection,
}) {
  const selectedCount = selectedIds.length

  return (
    <>
      <div className="px-8 pt-7 pb-5">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">Em tempo real</div>
            <h3 className="mt-1 text-[22px] font-bold text-ink-900">Presenças Confirmadas</h3>
          </div>
          <div className="text-right">
            <div className="text-[44px] font-bold num leading-none text-ink-900">
              {presentes.length}<span className="text-ink-500 font-semibold text-[28px]"> / {total}</span>
            </div>
            <div className="mt-1 text-[12px] text-ink-500">{pct}% da turma</div>
          </div>
        </div>
        <ProgressBar value={presentes.length} max={total} className="mt-5" height={10} />
        {presentes.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-[#FAFAFA] px-4 py-3">
            <div className="text-[12px] text-ink-500">
              {selectedCount > 0 ? (
                <>
                  <span className="font-semibold text-ink-900">{selectedCount}</span> presença{selectedCount > 1 ? 's' : ''} selecionada{selectedCount > 1 ? 's' : ''}
                </>
              ) : (
                'Selecione uma ou mais presenças para remover em lote.'
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" size="sm" onClick={allSelected ? onClearSelection : onToggleAll}>
                {allSelected ? 'Limpar seleção' : 'Selecionar todas'}
              </Button>
              <Button variant="danger" size="sm" icon={<I.Trash />} onClick={onDeleteSelected} disabled={selectedCount === 0}>
                Apagar selecionadas
              </Button>
              <Button variant="danger" size="sm" icon={<I.Trash />} onClick={onDeleteAll}>
                Limpar todas
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scroll-quiet px-8 pb-6 min-h-0">
        {presentes.length === 0 ? (
          <EmptyState
            icon={<I.Phone />}
            title="Aguardando alunos..."
            description="A primeira presença aparecerá aqui assim que alguém escanear o QR Code."
          />
        ) : (
          <div className="rounded-card border border-ink-100 overflow-hidden">
            <div className="grid grid-cols-[40px_1fr_200px_90px_44px] px-5 h-10 items-center bg-[#FAFAFA] border-b border-ink-100 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              <label className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                  aria-label="Selecionar todas as presenças"
                  className="h-4 w-4 rounded border-ink-200 text-brand-500 focus:ring-brand-500"
                />
              </label>
              <div>Aluno</div>
              <div>Email</div>
              <div className="text-right">Horário</div>
              <div></div>
            </div>
            <ul>
              {[...presentes].reverse().map((p, i) => (
                <li
                  key={p.attendanceId}
                  className={`${animClass} grid grid-cols-[40px_1fr_200px_90px_44px] px-5 h-14 items-center border-b border-ink-100 last:border-b-0 ${selectedIds.includes(p.attendanceId) ? 'bg-brand-50/70' : i % 2 === 1 ? 'bg-[#FAFAFA]/60' : 'bg-white'}`}
                >
                  <label className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p.attendanceId)}
                      onChange={() => onToggleSelection(p.attendanceId)}
                      aria-label={`Selecionar presença de ${p.full_name}`}
                      className="h-4 w-4 rounded border-ink-200 text-brand-500 focus:ring-brand-500"
                    />
                  </label>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-success/15 text-success flex items-center justify-center [&>svg]:w-3.5 [&>svg]:h-3.5">
                      <I.Check />
                    </span>
                    <span className="text-[14px] font-medium text-ink-900 truncate">{p.full_name}</span>
                  </div>
                  <div className="text-[13px] text-ink-500 truncate">{p.email}</div>
                  <div className="text-[13px] text-ink-500 num text-right">{p.hora}</div>
                  <button
                    onClick={() => onDelete(p)}
                    className="text-ink-500 hover:text-[#B91C1C] [&>svg]:w-4 [&>svg]:h-4 p-1 justify-self-center"
                    aria-label={`Remover presença de ${p.full_name}`}
                  >
                    <I.X />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export function ChamadaAtivaScreen({ turmaId, layout = 'split', tableAnim = 'fade', onEnd, onPresenter }) {
  const { turmas, getPresencas, deletePresenca, deleteManyPresencas, deleteAllPresencas } = useData()
  const turma = turmas.find(t => t.id === turmaId) || turmas[0]
  const totalAlunos = turma?.alunos || 0
  const [presentes, setPresentes] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [seconds, setSeconds] = useState(15 * 60)
  const [confirmEnd, setConfirmEnd] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Timer
  useEffect(() => {
    if (seconds <= 0) return
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [seconds])

  const loadPresencas = useCallback(async (isActive = () => true) => {
    if (!turmaId) return

    const data = await getPresencas(turmaId)
    const formatted = data.map((p) => ({
      attendanceId: p.id,
      id: p.fk_student,
      full_name: p.full_name,
      email: p.email,
      hora: new Date(p.registered_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    }))
    if (isActive()) {
      setPresentes(formatted)
    }
  }, [getPresencas, turmaId])

  // Polling: buscar presenças reais a cada 3 segundos
  useEffect(() => {
    if (!turmaId) return
    let active = true

    const poll = async () => {
      try {
        if (!active) return
        await loadPresencas(() => active)
      } catch (err) {
        console.error('Erro ao buscar presenças:', err)
      }
    }

    poll()
    const id = setInterval(poll, 3000)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [loadPresencas, turmaId])

  useEffect(() => {
    setSelectedIds((current) => current.filter((id) => presentes.some((presenca) => presenca.attendanceId === id)))
  }, [presentes])

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const pct = totalAlunos > 0 ? Math.round((presentes.length / totalAlunos) * 100) : 0
  const animClass = { fade: 'animate-fadeUp', slide: 'animate-slideIn', scale: 'animate-scaleIn' }[tableAnim] || 'animate-fadeUp'
  const allSelected = presentes.length > 0 && selectedIds.length === presentes.length

  const toggleSelection = (attendanceId) => {
    setSelectedIds((current) => (
      current.includes(attendanceId)
        ? current.filter((id) => id !== attendanceId)
        : [...current, attendanceId]
    ))
  }

  const toggleAllSelection = () => {
    setSelectedIds((current) => (
      current.length === presentes.length
        ? []
        : presentes.map((presenca) => presenca.attendanceId)
    ))
  }

  const handleDeleteRequest = (presenca) => {
    setConfirmDelete({
      type: 'single',
      ids: [presenca.attendanceId],
      label: presenca.full_name,
    })
  }

  const handleDeleteSelectedRequest = () => {
    if (selectedIds.length === 0) return
    setConfirmDelete({
      type: 'selected',
      ids: selectedIds,
    })
  }

  const handleDeleteAllRequest = () => {
    setConfirmDelete({ type: 'all' })
  }

  const handleConfirmDelete = async () => {
    if (!confirmDelete || !turmaId) return

    setDeleting(true)
    try {
      if (confirmDelete.type === 'single') {
        await deletePresenca(confirmDelete.ids[0])
      } else if (confirmDelete.type === 'selected') {
        await deleteManyPresencas(confirmDelete.ids, turmaId)
      } else {
        await deleteAllPresencas(turmaId)
      }

      await loadPresencas()
      setSelectedIds([])
      setConfirmDelete(null)
    } catch (err) {
      alert('Erro ao excluir presença: ' + err.message)
    } finally {
      setDeleting(false)
    }
  }

  if (!turma) return null

  const qrSection = <QRBlock turma={turma} seconds={seconds} fmtTime={fmtTime} />
  const tableSection = (
    <PresencasTable
      presentes={presentes}
      total={totalAlunos}
      pct={pct}
      animClass={animClass}
      selectedIds={selectedIds}
      allSelected={allSelected}
      onToggleSelection={toggleSelection}
      onToggleAll={toggleAllSelection}
      onDelete={handleDeleteRequest}
      onDeleteSelected={handleDeleteSelectedRequest}
      onDeleteAll={handleDeleteAllRequest}
      onClearSelection={() => setSelectedIds([])}
    />
  )

  let layoutEl
  if (layout === 'split') {
    layoutEl = (
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0">
        <div className="bg-gradient-to-br from-brand-50/60 via-white to-brand-50/30 border-r border-ink-100 flex items-center justify-center p-8 lg:p-12">
          {qrSection}
        </div>
        <div className="bg-white flex flex-col min-h-0">{tableSection}</div>
      </div>
    )
  } else if (layout === 'stacked') {
    layoutEl = (
      <div className="flex-1 grid grid-rows-[auto_1fr] min-h-0">
        <div className="bg-gradient-to-br from-brand-50/60 via-white to-brand-50/30 border-b border-ink-100 px-8 py-8 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 items-center">
          <div className="flex justify-center lg:justify-start">
            <QRBlock turma={turma} seconds={seconds} fmtTime={fmtTime} compact />
          </div>
          <div className="lg:pl-8">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-brand-600 mb-2">Sessão ao vivo</div>
            <h2 className="text-[28px] font-bold text-ink-900 leading-tight">{turma.name}</h2>
            <p className="text-[14px] text-ink-500 mt-1">{turma.curso}</p>
            <div className="mt-5 grid grid-cols-3 gap-4 max-w-md">
              <div>
                <div className="text-[12px] text-ink-500">Presentes</div>
                <div className="text-[24px] font-bold num text-ink-900">{presentes.length}</div>
              </div>
              <div>
                <div className="text-[12px] text-ink-500">Esperados</div>
                <div className="text-[24px] font-bold num text-ink-500">{totalAlunos}</div>
              </div>
              <div>
                <div className="text-[12px] text-ink-500">Presença</div>
                <div className="text-[24px] font-bold num text-success">{pct}%</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white flex flex-col min-h-0">{tableSection}</div>
      </div>
    )
  } else {
    layoutEl = (
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] min-h-0">
        <div className="bg-gradient-to-br from-brand-50 via-white to-brand-50/40 flex items-center justify-center p-12">
          <QRBlock turma={turma} seconds={seconds} fmtTime={fmtTime} large />
        </div>
        <div className="bg-white border-l border-ink-100 flex flex-col min-h-0">{tableSection}</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="h-[72px] shrink-0 px-8 flex items-center justify-between border-b border-ink-100 bg-white">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center">
            <span className="absolute w-2 h-2 rounded-full bg-success animate-ping" />
            <span className="w-2 h-2 rounded-full bg-success" />
          </div>
          <span className="text-[13px] font-semibold text-success uppercase tracking-wider">Sessão ao vivo</span>
          <div className="h-5 w-px bg-ink-100" />
          <div>
            <div className="text-[13px] font-semibold text-ink-900">{turma.name}</div>
            <div className="text-[11px] text-ink-500">{turma.curso}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={<I.Maximize />} onClick={onPresenter}>
            Modo apresentação
          </Button>
          <Button variant="danger" size="sm" icon={<I.Stop />} onClick={() => setConfirmEnd(true)}>
            Encerrar Chamada
          </Button>
        </div>
      </div>

      {layoutEl}

      <Modal
        open={confirmEnd}
        onClose={() => setConfirmEnd(false)}
        title="Encerrar a chamada?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmEnd(false)}>Cancelar</Button>
            <Button variant="primary" onClick={() => { setConfirmEnd(false); onEnd?.(); }}>Encerrar agora</Button>
          </>
        }
      >
        Após encerrar, novas presenças não serão aceitas. <span className="font-semibold text-ink-900">{presentes.length} de {totalAlunos}</span> alunos confirmaram presença.
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => !deleting && setConfirmDelete(null)}
        title={
          confirmDelete?.type === 'single'
            ? 'Excluir presença?'
            : confirmDelete?.type === 'selected'
              ? 'Excluir presenças selecionadas?'
              : 'Limpar todas as presenças?'
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)} disabled={deleting}>Cancelar</Button>
            <Button variant="danger" onClick={handleConfirmDelete} disabled={deleting}>
              {deleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </>
        }
      >
        {confirmDelete?.type === 'single' && (
          <>
            Tem certeza que deseja excluir a presença de <span className="font-semibold text-ink-900">{confirmDelete.label}</span>?
          </>
        )}
        {confirmDelete?.type === 'selected' && (
          <>
            Tem certeza que deseja excluir <span className="font-semibold text-ink-900">{confirmDelete.ids.length}</span> presenças selecionadas?
          </>
        )}
        {confirmDelete?.type === 'all' && (
          <>
            Esta ação removerá <span className="font-semibold text-ink-900">todas as presenças</span> registradas para <span className="font-semibold text-ink-900">{turma.name}</span>.
          </>
        )}
      </Modal>
    </div>
  )
}
