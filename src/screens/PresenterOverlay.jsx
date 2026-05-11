import { useState, useEffect } from 'react'
import { I } from '../components/icons'
import { Logo } from '../components/ui/Logo'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import { QRCode } from '../components/ui/QRCode'
import { useData } from '../lib/DataContext'

export function PresenterOverlay({ turmaId, onClose }) {
  const { turmas } = useData()
  const turma = turmas.find(t => t.id === turmaId) || turmas[0]
  const [seconds, setSeconds] = useState(15 * 60);
  const [presentes, setPresentes] = useState(8);

  const totalAlunos = turma?.alunos || 0

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (presentes >= totalAlunos) return;
    const id = setTimeout(() => setPresentes(p => p + 1), 1500 + Math.random() * 2000);
    return () => clearTimeout(id);
  }, [presentes, totalAlunos]);

  const pct = totalAlunos > 0 ? Math.round((presentes / totalAlunos) * 100) : 0;
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (!turma) return null

  return (
    <div className="fixed inset-0 z-50 bg-white animate-fadeUp" style={{ animationDuration: '220ms' }}>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 px-10 py-6 flex items-center justify-between z-10">
        <Logo size={36} />
        <div className="flex items-center gap-2">
          <Badge variant="info" size="lg" icon={<I.Wifi />}>Sessão ao vivo</Badge>
          <Button variant="secondary" size="sm" icon={<I.Minimize />} onClick={onClose}>
            Sair (Esc)
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="h-full grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-12 px-10 pt-24 pb-10">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-[14px] font-semibold uppercase tracking-[0.2em] text-brand-600">Chamada Ativa</div>
          <h1 className="mt-3 text-[44px] font-bold tracking-tight text-ink-900 leading-none">{turma.name}</h1>
          <p className="mt-2 text-[16px] text-ink-500">{turma.curso}</p>

          <div className="relative mt-10 bg-white p-6 rounded-3xl shadow-soft border border-ink-100 animate-qrPulse">
            <span className="absolute -top-2 -left-2 w-8 h-8 border-t-[4px] border-l-[4px] border-brand-500 rounded-tl-xl" />
            <span className="absolute -top-2 -right-2 w-8 h-8 border-t-[4px] border-r-[4px] border-brand-500 rounded-tr-xl" />
            <span className="absolute -bottom-2 -left-2 w-8 h-8 border-b-[4px] border-l-[4px] border-brand-500 rounded-bl-xl" />
            <span className="absolute -bottom-2 -right-2 w-8 h-8 border-b-[4px] border-r-[4px] border-brand-500 rounded-br-xl" />
            <QRCode value={`jynx-${turma.id}`} size={520} />
          </div>

          <p className="mt-8 text-[18px] font-medium text-ink-900 max-w-md leading-relaxed">
            Aponte a câmera do seu celular para o QR Code para registrar sua presença.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-8">
          <div className="bg-gradient-to-br from-brand-50 to-white rounded-3xl border border-brand-500/20 p-10">
            <div className="text-[14px] font-semibold uppercase tracking-wider text-brand-600">Presenças confirmadas</div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-[140px] font-bold tracking-tight num leading-none text-ink-900">{presentes}</span>
              <span className="text-[40px] font-semibold text-ink-500 num">/ {totalAlunos}</span>
            </div>
            <ProgressBar value={presentes} max={totalAlunos || 1} className="mt-6" height={14} />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[14px] text-ink-500">{pct}% da turma</span>
              <span className="text-[14px] font-semibold text-success">+{presentes} alunos</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-ink-100 p-6">
              <div className="text-[12px] uppercase tracking-wider text-ink-500 font-semibold">Tempo restante</div>
              <div className="mt-2 text-[44px] font-bold num text-ink-900 leading-none tabular-nums">{fmt(seconds)}</div>
            </div>
            <div className="bg-white rounded-2xl border border-ink-100 p-6">
              <div className="text-[12px] uppercase tracking-wider text-ink-500 font-semibold">Esperando</div>
              <div className="mt-2 text-[44px] font-bold num text-brand-500 leading-none">{totalAlunos - presentes}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
