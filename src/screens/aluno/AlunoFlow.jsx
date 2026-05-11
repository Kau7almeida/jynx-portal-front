import { useState } from 'react'
import { I } from '../../components/icons'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { PhoneFrame } from './PhoneFrame'
import { AlunoSelectScreen } from './AlunoSelectScreen'
import { AlunoSucessoScreen } from './AlunoSucessoScreen'
import { useData } from '../../lib/DataContext'

export function AlunoFlow({ onExit }) {
  const { turmas } = useData()
  const [step, setStep] = useState('select'); // select | sucesso
  const [aluno, setAluno] = useState(null);

  const turmaId = turmas[0]?.id || null

  return (
    <div className="flex-1 overflow-y-auto scroll-quiet bg-[#F5F5F5] py-10">
      <div className="px-10">
        <div className="flex items-center justify-between max-w-5xl mx-auto mb-6">
          <div>
            <Badge variant="info" size="sm">Preview Mobile</Badge>
            <h1 className="mt-2 text-[22px] font-bold tracking-tight text-ink-900">Tela do Aluno</h1>
            <p className="text-[13px] text-ink-500">Como o aluno verá ao escanear o QR Code com o celular</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => { setStep('select'); setAluno(null); }} icon={<I.Refresh />}>Reiniciar</Button>
            <Button variant="ghost" size="sm" onClick={onExit}>Sair do preview</Button>
          </div>
        </div>

        <PhoneFrame>
          {step === 'select' && (
            <AlunoSelectScreen
              turmaId={turmaId}
              onConfirm={(a) => { setAluno(a); setStep('sucesso'); }}
              onCancel={onExit}
            />
          )}
          {step === 'sucesso' && (
            <AlunoSucessoScreen aluno={aluno} turmaId={turmaId} onClose={() => setStep('select')} />
          )}
        </PhoneFrame>

        <div className="text-center mt-6 text-[12px] text-ink-500">
          {step === 'select' && 'Toque em um nome e confirme presença para ver a próxima tela.'}
          {step === 'sucesso' && 'Tela exibida após confirmação bem-sucedida.'}
        </div>
      </div>
    </div>
  );
}
