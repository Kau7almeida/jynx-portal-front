import { useState } from 'react'
import { I } from '../../components/icons'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Input, SearchInput } from '../../components/ui/Input'
import { EmptyState } from '../../components/ui/EmptyState'
import { useData } from '../../lib/DataContext'

export function AlunosTab() {
  const { alunos, turmas, createAluno, updateAluno, deleteAluno, refresh } = useData()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({ full_name: '', cpf: '', email: '', phone: '', fk_class: '' })
  const [saving, setSaving] = useState(false)

  // Ver turma do aluno
  const [turmaModal, setTurmaModal] = useState(null)

  const filtered = alunos.filter(a =>
    a.full_name.toLowerCase().includes(search.toLowerCase()) ||
    a.cpf?.includes(search) ||
    a.email?.toLowerCase().includes(search.toLowerCase())
  )

  const openNew = () => {
    setEditing(null)
    setForm({ full_name: '', cpf: '', email: '', phone: '', fk_class: '' })
    setModalOpen(true)
  }

  const openEdit = (a) => {
    setEditing(a)
    setForm({
      full_name: a.full_name,
      cpf: a.cpf || '',
      email: a.email || '',
      phone: a.phone || '',
      fk_class: a.fk_class || '',
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.full_name.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await updateAluno(editing.id, form)
      } else {
        await createAluno(form)
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
      await deleteAluno(confirmDelete.id)
      await refresh()
      setConfirmDelete(null)
    } catch (err) {
      alert('Erro ao excluir: ' + err.message)
    }
  }

  const openTurmaModal = (aluno) => {
    setTurmaModal(aluno)
  }

  // Encontra a turma do aluno pelo fk_class
  const turmaDoAluno = turmaModal ? turmas.find(t => t.id === turmaModal.fk_class) : null

  return (
    <>
      {/* Actions bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar aluno..."
          className="w-full max-w-sm"
        />
        <Button variant="primary" icon={<I.Plus />} onClick={openNew}>
          Novo Aluno
        </Button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<I.Mortar />}
            title="Nenhum aluno encontrado"
            description={search ? `Sem resultados para "${search}".` : 'Cadastre o primeiro aluno para começar.'}
            action={!search && <Button variant="primary" icon={<I.Plus />} onClick={openNew}>Novo Aluno</Button>}
          />
        </Card>
      ) : (
        <Card padding="p-0">
          <div className="grid grid-cols-[1fr_160px_200px_150px_140px] px-6 h-12 items-center bg-[#FAFAFA] border-b border-ink-100 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
            <div>Nome</div>
            <div>CPF</div>
            <div>Email</div>
            <div>Telefone</div>
            <div className="text-right">Ações</div>
          </div>
          <ul>
            {filtered.map((a, i) => (
              <li key={a.id} className={`grid grid-cols-[1fr_160px_200px_150px_140px] px-6 h-14 items-center border-b border-ink-100 last:border-b-0 ${i % 2 === 1 ? 'bg-[#FAFAFA]/60' : ''}`}>
                <div className="text-[14px] font-medium text-ink-900 truncate">{a.full_name}</div>
                <div className="text-[13px] text-ink-500 font-mono num">{a.cpf}</div>
                <div className="text-[13px] text-ink-500 truncate">{a.email}</div>
                <div className="text-[13px] text-ink-500 num">{a.phone}</div>
                <div className="flex justify-end gap-1">
                  <Button size="sm" variant="ghost" icon={<I.Eye />} onClick={() => openTurmaModal(a)} />
                  <Button size="sm" variant="ghost" icon={<I.Pencil />} onClick={() => openEdit(a)} />
                  <Button size="sm" variant="ghost" icon={<I.Trash />} onClick={() => setConfirmDelete(a)} />
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between px-6 py-4 border-t border-ink-100 bg-[#FAFAFA] rounded-b-card">
            <div className="text-[12px] text-ink-500">
              Mostrando <span className="font-semibold text-ink-900">{filtered.length}</span> de <span className="font-semibold text-ink-900">{alunos.length}</span> alunos
            </div>
          </div>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar Aluno' : 'Novo Aluno'}
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
          <Input
            label="Nome completo"
            value={form.full_name}
            onChange={(v) => setForm(f => ({ ...f, full_name: v }))}
            placeholder="Ex: João Pedro Martins"
          />
          <Input
            label="CPF"
            value={form.cpf}
            onChange={(v) => setForm(f => ({ ...f, cpf: v }))}
            placeholder="Ex: 123.456.789-00"
          />
          <Input
            label="Email"
            value={form.email}
            onChange={(v) => setForm(f => ({ ...f, email: v }))}
            placeholder="Ex: joao@email.com"
          />
          <Input
            label="Telefone"
            value={form.phone}
            onChange={(v) => setForm(f => ({ ...f, phone: v }))}
            placeholder="Ex: (11) 99999-0000"
          />
          <div>
            <label className="block text-[13px] font-medium text-ink-900 mb-1.5">Turma</label>
            <select
              value={form.fk_class}
              onChange={(e) => setForm(f => ({ ...f, fk_class: e.target.value || null }))}
              className="w-full h-11 px-3.5 bg-white border border-ink-100 rounded-[10px] text-sm text-ink-900 focus-ring transition-all hover:border-ink-500/40"
            >
              <option value="">Sem turma</option>
              {turmas.map(t => <option key={t.id} value={t.id}>{t.name} — {t.curso}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Excluir aluno?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
            <Button variant="danger" onClick={handleDelete}>Excluir</Button>
          </>
        }
      >
        Tem certeza que deseja excluir o aluno <span className="font-semibold text-ink-900">{confirmDelete?.full_name}</span>?
      </Modal>

      {/* Turma do aluno */}
      <Modal
        open={!!turmaModal}
        onClose={() => setTurmaModal(null)}
        title={`Turma — ${turmaModal?.full_name || ''}`}
        width={480}
        footer={
          <Button variant="ghost" onClick={() => setTurmaModal(null)}>Fechar</Button>
        }
      >
        {!turmaDoAluno ? (
          <p className="text-[13px] text-ink-500">Este aluno não está vinculado a nenhuma turma.</p>
        ) : (
          <ul className="border border-ink-100 rounded-[10px] overflow-hidden">
            <li className="flex items-center justify-between px-4 h-12 border-b border-ink-100 last:border-b-0">
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-ink-900 truncate">{turmaDoAluno.name}</div>
                <div className="text-[11px] text-ink-500">{turmaDoAluno.curso}</div>
              </div>
            </li>
          </ul>
        )}
      </Modal>
    </>
  )
}
