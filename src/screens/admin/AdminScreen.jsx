import { useState } from 'react'
import { I } from '../../components/icons'
import { CursosTab } from './CursosTab'
import { TurmasTab } from './TurmasTab'
import { AlunosTab } from './AlunosTab'

const TABS = [
  { id: 'cursos', label: 'Cursos',  icon: <I.Book /> },
  { id: 'turmas', label: 'Turmas',  icon: <I.Users /> },
  { id: 'alunos', label: 'Alunos',  icon: <I.Mortar /> },
]

export function AdminScreen() {
  const [tab, setTab] = useState('cursos')

  return (
    <div className="flex-1 overflow-y-auto scroll-quiet">
      <div className="px-10 py-8">
        {/* Tab bar */}
        <div className="flex items-center gap-1 border-b border-ink-100 mb-8">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`
                flex items-center gap-2 px-5 h-11 text-[13px] font-semibold transition-all
                border-b-2 -mb-px
                ${tab === t.id
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-ink-500 hover:text-ink-900 hover:border-ink-100'}
              `}
            >
              <span className="[&>svg]:w-4 [&>svg]:h-4">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'cursos' && <CursosTab />}
        {tab === 'turmas' && <TurmasTab />}
        {tab === 'alunos' && <AlunosTab />}
      </div>
    </div>
  )
}
