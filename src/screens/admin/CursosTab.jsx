import { useState } from 'react'
import { I } from '../../components/icons'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, SearchInput } from '../../components/ui/Input'
import { EmptyState } from '../../components/ui/EmptyState'
import { useData } from '../../lib/DataContext'

export function CursosTab() {
  const { cursos, createCurso, updateCurso, deleteCurso, refresh } = useData()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({ nome: '' })
  const [saving, setSaving] = useState(false)

  const filtered = cursos.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const openNew = () => {
    setEditing(null)
    setForm({ nome: '' })
    setModalOpen(true)
  }

  const openEdit = (c) => {
    setEditing(c)
    setForm({ nome: c.name })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.nome.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await updateCurso(editing.id, form)
      } else {
        await createCurso(form)
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
      await deleteCurso(confirmDelete.id)
      await refresh()
      setConfirmDelete(null)
    } catch (err) {
      alert('Erro ao excluir: ' + err.message)
    }
  }

  return (
    <>
      {/* Actions bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar curso..."
          className="w-full max-w-sm"
        />
        <Button variant="primary" icon={<I.Plus />} onClick={openNew}>
          Novo Curso
        </Button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<I.Book />}
            title="Nenhum curso encontrado"
            description={search ? `Sem resultados para "${search}".` : 'Cadastre o primeiro curso para começar.'}
            action={!search && <Button variant="primary" icon={<I.Plus />} onClick={openNew}>Novo Curso</Button>}
          />
        </Card>
      ) : (
        <Card padding="p-0">
          <div className="grid grid-cols-[1fr_160px_180px_140px] px-6 h-12 items-center bg-[#FAFAFA] border-b border-ink-100 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
            <div>Nome</div>
            <div>Turmas</div>
            <div>Criado em</div>
            <div className="text-right">Ações</div>
          </div>
          <ul>
            {filtered.map((c, i) => (
              <li key={c.id} className={`grid grid-cols-[1fr_160px_180px_140px] px-6 h-14 items-center border-b border-ink-100 last:border-b-0 ${i % 2 === 1 ? 'bg-[#FAFAFA]/60' : ''}`}>
                <div className="text-[14px] font-medium text-ink-900 truncate">{c.name}</div>
                <div className="text-[13px] text-ink-500">{c.classes?.length || 0} turma(s)</div>
                <div className="text-[13px] text-ink-500">{new Date(c.created_at).toLocaleDateString('pt-BR')}</div>
                <div className="flex justify-end gap-1">
                  <Button size="sm" variant="ghost" icon={<I.Pencil />} onClick={() => openEdit(c)} />
                  <Button size="sm" variant="ghost" icon={<I.Trash />} onClick={() => setConfirmDelete(c)} />
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
        title={editing ? 'Editar Curso' : 'Novo Curso'}
        width={440}
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
            label="Nome do curso"
            value={form.nome}
            onChange={(v) => setForm(f => ({ ...f, nome: v }))}
            placeholder="Ex: Ciência da Computação"
          />
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Excluir curso?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
            <Button variant="danger" onClick={handleDelete}>Excluir</Button>
          </>
        }
      >
        Tem certeza que deseja excluir o curso <span className="font-semibold text-ink-900">{confirmDelete?.name}</span>? Todas as turmas vinculadas também serão removidas.
      </Modal>
    </>
  )
}
