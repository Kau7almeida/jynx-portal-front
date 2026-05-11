import { api } from './api'

// ─── Cursos ──────────────────────────────────────────────

export async function getCursos() {
  return api.get('/courses/get-all')
}

export async function createCurso({ nome }) {
  return api.post('/courses/create', { name: nome })
}

export async function updateCurso(id, { nome }) {
  return api.put(`/courses/update/${id}`, { name: nome })
}

export async function deleteCurso(id) {
  return api.del(`/courses/delete/${id}`)
}

// ─── Turmas ──────────────────────────────────────────────

export async function getTurmas() {
  return api.get('/classes/get-all')
}

export async function createTurma({ curso_id, nome }) {
  return api.post('/classes/create', { name: nome, fk_course: curso_id })
}

export async function updateTurma(id, { curso_id, nome }) {
  return api.put(`/classes/update/${id}`, { name: nome, fk_course: curso_id })
}

export async function deleteTurma(id) {
  return api.del(`/classes/delete/${id}`)
}

// ─── Alunos ──────────────────────────────────────────────

export async function getAlunos() {
  return api.get('/students/get-all')
}

export async function createAluno({ full_name, cpf, email, phone, fk_class }) {
  return api.post('/students/create', { full_name, cpf, email, phone, fk_class })
}

export async function updateAluno(id, { full_name, cpf, email, phone, fk_class }) {
  return api.put(`/students/update/${id}`, { full_name, cpf, email, phone, fk_class })
}

export async function deleteAluno(id) {
  return api.del(`/students/delete/${id}`)
}
