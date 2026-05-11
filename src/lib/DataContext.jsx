import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { I } from '../components/icons'
import * as db from './database'

const DataContext = createContext(null)

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData deve ser usado dentro de <DataProvider>')
  return ctx
}

// Mapeia nome do curso para um ícone
const ICON_MAP = {
  'Ciência da Computação': <I.Code />,
  'Sistemas de Informação': <I.Book />,
  'Engenharia':             <I.Beaker />,
  'Multi-curso':            <I.Globe />,
}

function getIconForCurso(cursoNome) {
  for (const [key, icon] of Object.entries(ICON_MAP)) {
    if (cursoNome?.toLowerCase().includes(key.toLowerCase())) return icon
  }
  return <I.Mortar />
}

export function DataProvider({ children }) {
  const [cursos, setCursos] = useState([])
  const [turmas, setTurmas] = useState([])
  const [alunos, setAlunos] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      const [c, t, a] = await Promise.all([
        db.getCursos(),
        db.getTurmas(),
        db.getAlunos(),
      ])
      setCursos(c)
      setTurmas(t)
      setAlunos(a)
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  // Contagem de alunos por turma (calculada localmente a partir de fk_class)
  const contagem = {}
  alunos.forEach(a => {
    if (a.fk_class) {
      contagem[a.fk_class] = (contagem[a.fk_class] || 0) + 1
    }
  })

  // Mapa de cursos por id para lookup rápido
  const cursosMap = {}
  cursos.forEach(c => { cursosMap[c.id] = c })

  // Turmas formatadas para uso nas telas
  const turmasFormatadas = turmas.map(t => ({
    ...t,
    curso: cursosMap[t.fk_course]?.name || '',
    alunos: contagem[t.id] || 0,
    icon: getIconForCurso(cursosMap[t.fk_course]?.name),
  }))

  // Busca alunos de uma turma filtrando localmente
  const getAlunosDaTurma = useCallback((turmaId) => {
    return alunos.filter(a => a.fk_class === turmaId)
  }, [alunos])

  const value = {
    cursos,
    turmas: turmasFormatadas,
    turmasRaw: turmas,
    alunos,
    contagem,
    loading,
    refresh,
    getAlunosDaTurma,
    createCurso: db.createCurso,
    updateCurso: db.updateCurso,
    deleteCurso: db.deleteCurso,
    createTurma: db.createTurma,
    updateTurma: db.updateTurma,
    deleteTurma: db.deleteTurma,
    createAluno: db.createAluno,
    updateAluno: db.updateAluno,
    deleteAluno: db.deleteAluno,
    getPresencas: db.getPresencas,
    registrarPresenca: db.registrarPresenca,
    deletePresenca: db.deletePresenca,
    deleteManyPresencas: db.deleteManyPresencas,
    deleteAllPresencas: db.deleteAllPresencas,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
