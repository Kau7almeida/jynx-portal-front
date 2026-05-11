import { useState } from 'react'
import { I } from '../../components/icons'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Input, SearchInput } from '../../components/ui/Input'
import { EmptyState } from '../../components/ui/EmptyState'
import { Avatar } from '../../components/ui/Avatar'
import { useData } from '../../lib/DataContext'

export function TurmasTab() {
  const {
    turmas, cursos, alunos, contagem,
    createTurma, updateTurma, deleteTurma,
    getAlunosDaTurma, updateAluno,
    refresh,
  } = useData()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({ curso_id: '', nome: '' })
  const [saving, setSaving] = useState(false)

  // Gerenciamento de alunos
  const [alunosModal, setAlunosModal] = useState(null)
  const [alunoSearch, setAlunoSearch] = useState('')

  const filtered = turmas.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.curso.toLowerCase().includes(search.toLowerCase())
  )

  const openNew = () => {
    setEditing(null)
    setForm({ curso_id: cursos[0]?.id || '', nome: '' })
    setModalOpen(true)
  }

  const openEdit = (t) => {
    setEditing(t)
    setForm({
      curso_id: t.fk_course,
      nome: t.name,
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.nome.trim() || !form.curso_id) return
    setSaving(true)
    try {
      if (editing) {
        await updateTurma(editing.id, form)
      } else {
        await createTurma(form)
      }
      await refresh()
      setModalOpen(false)
    } catch (err) {
      alert('Erro ao salvar: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await deleteTurma(confirmDelete.id)
      await refresh()
      setConfirmDelete(null)
    } catch (err) {
      alert('Erro ao excluir: ' + err.message)
    }
  }

  // Abrir modal de alunos
  const openAlunosModal = (turma) => {
    setAlunosModal(turma)
    setAlunoSearch('')
  }

  // Alunos vinculados a esta turma (filtro local)
  const alunosDaTurma = alunosModal ? getAlunosDaTurma(alunosModal.id) : []

  const handleVincular = async (aluno) => {
    if (!alunosModal) return
    try {
      await updateAluno(aluno.id, {
        full_name: aluno.full_name,
        cpf: aluno.cpf,
        email: aluno.email,
        phone: aluno.phone,
        fk_class: alunosModal.id,
      })
      await refresh()
    } catch (err) {
      alert('Erro ao vincular: ' + err.message)
    }
  }

  const handleDesvincular = async (aluno) => {
    if (!alunosModal) return
    try {
      await updateAluno(aluno.id, {
        full_name: aluno.full_name,
        cpf: aluno.cpf,
        email: aluno.email,
        phone: aluno.phone,
        fk_class: null,
      })
      await refresh()
    } catch (err) {
      alert('Erro ao desvincular: ' + err.message)
    }
  }

  const vinculadosIds = new Set(alunosDaTurma.map(a => a.id))
  const alunosDisponiveis = alunos.filter(a =>
    !vinculadosIds.has(a.id) &&
    (a.full_name.toLowerCase().includes(alunoSearch.toLowerCase()) ||
     a.email?.includes(alunoSearch) ||
     a.cpf?.includes(alunoSearch))
  )

  return (
    <>
      {/* Actions bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar turma..."
          className="w-full max-w-sm"
        />
        <Button variant="primary" icon={<I.Plus />} onClick={openNew}>
          Nova Turma
        </Button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<I.Users />}
            title="Nenhuma turma encontrada"
            description={search ? `Sem resultados para "${search}".` : 'Cadastre a primeira turma para começar.'}
            action={!search && <Button variant="primary" icon={<I.Plus />} onClick={openNew}>Nova Turma</Button>}
          />
        </Card>
      ) : (
        <Card padding="p-0">
          <div className="grid grid-cols-[1fr_180px_100px_140px] px-6 h-12 items-center bg-[#FAFAFA] border-b border-ink-100 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
            <div>Nome</div>
            <div>Curso</div>
            <div className="text-center">Alunos</div>
            <div className="text-right">Ações</div>
          </div>
          <ul>
            {filtered.map((t, i) => (
              <li key={t.id} className={`grid grid-cols-[1fr_180px_100px_140px] px-6 h-14 items-center border-b border-ink-100 last:border-b-0 ${i % 2 === 1 ? 'bg-[#FAFAFA]/60' : ''}`}>
                <div className="text-[14px] font-medium text-ink-900 truncate">{t.name}</div>
                <div className="text-[13px] text-ink-500 truncate">{t.curso}</div>
                <div className="text-center">
                  <Badge variant="neutral" size="sm">{t.alunos}</Badge>
                </div>
                <div className="flex justify-end gap-1">
                  <Button size="sm" variant="ghost" icon={<I.Link />} onClick={() => openAlunosModal(t)} />
                  <Button size="sm" variant="ghost" icon={<I.Pencil />} onClick={() => openEdit(t)} />
                  <Button size="sm" variant="ghost" icon={<I.Trash />} onClick={() => setConfirmDelete(t)} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar Turma' : 'Nova Turma'}
        width={480}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-ink-900 mb-1.5">Curso</label>
            <select
              value={form.curso_id}
              onChange={(e) => setForm(f => ({ ...f, curso_id: e.target.value }))}
              className="w-full h-11 px-3.5 bg-white border border-ink-100 rounded-[10px] text-sm text-ink-900 focus-ring transition-all hover:border-ink-500/40"
            >
              <option value="">Selecione um curso</option>
              {cursos.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <Input
            label="Nome da turma"
            value={form.nome}
            onChange={(v) => setForm(f => ({ ...f, nome: v }))}
            placeholder="Ex: Engenharia de Software"
          />
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Excluir turma?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
            <Button variant="danger" onClick={handleDelete}>Excluir</Button>
          </>
        }
      >
        Tem certeza que deseja excluir a turma <span className="font-semibold text-ink-900">{confirmDelete?.name}</span>? Todos os alunos vinculados perderão o vínculo.
      </Modal>

      {/* Gerenciar alunos da turma */}
      <Modal
        open={!!alunosModal}
        onClose={() => setAlunosModal(null)}
        title={`Alunos — ${alunosModal?.name || ''}`}
        width={560}
        footer={
          <Button variant="ghost" onClick={() => setAlunosModal(null)}>Fechar</Button>
        }
      >
        <div className="space-y-4">
          {/* Alunos vinculados */}
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wider text-ink-500 mb-2">
              Vinculados ({alunosDaTurma.length})
            </div>
            {alunosDaTurma.length === 0 ? (
              <p className="text-[13px] text-ink-500">Nenhum aluno vinculado a esta turma.</p>
            ) : (
              <ul className="border border-ink-100 rounded-[10px] overflow-hidden max-h-48 overflow-y-auto scroll-quiet">
                {alunosDaTurma.map(a => (
                  <li key={a.id} className="flex items-center justify-between px-4 h-11 border-b border-ink-100 last:border-b-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar name={a.full_name} size={24} />
                      <span className="text-[13px] font-medium text-ink-900 truncate">{a.full_name}</span>
                      <span className="text-[11px] text-ink-500 num">{a.email}</span>
                    </div>
                    <button
                      onClick={() => handleDesvincular(a)}
                      className="text-ink-500 hover:text-[#B91C1C] [&>svg]:w-4 [&>svg]:h-4 p-1"
                    >
                      <I.Unlink />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Adicionar alunos */}
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wider text-ink-500 mb-2">
              Adicionar aluno
            </div>
            <SearchInput
              value={alunoSearch}
              onChange={setAlunoSearch}
              placeholder="Buscar aluno por nome, email ou CPF..."
              className="mb-2"
            />
            {alunoSearch && (
              <ul className="border border-ink-100 rounded-[10px] overflow-hidden max-h-48 overflow-y-auto scroll-quiet">
                {alunosDisponiveis.length === 0 ? (
                  <li className="px-4 py-3 text-[13px] text-ink-500">Nenhum aluno encontrado.</li>
                ) : (
                  alunosDisponiveis.slice(0, 20).map(a => (
                    <li key={a.id} className="flex items-center justify-between px-4 h-11 border-b border-ink-100 last:border-b-0 hover:bg-brand-50/30 transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar name={a.full_name} size={24} />
                        <span className="text-[13px] font-medium text-ink-900 truncate">{a.full_name}</span>
                        <span className="text-[11px] text-ink-500 num">{a.email}</span>
                      </div>
                      <button
                        onClick={() => handleVincular(a)}
                        className="text-ink-500 hover:text-brand-500 [&>svg]:w-4 [&>svg]:h-4 p-1"
                      >
                        <I.Plus />
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </Modal>
    </>
  )
}
