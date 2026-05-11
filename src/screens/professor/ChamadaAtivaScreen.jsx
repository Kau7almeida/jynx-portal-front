import { useState, useEffect } from 'react'
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

function PresencasTable({ turma, presentes, total, pct, animClass }) {
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
            <div className="grid grid-cols-[1fr_200px_90px] px-5 h-10 items-center bg-[#FAFAFA] border-b border-ink-100 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              <div>Aluno</div>
              <div>Email</div>
              <div className="text-right">Horário</div>
            </div>
            <ul>
              {[...presentes].reverse().map((p, i) => (
                <li
                  key={`${p.id}-${p.hora}`}
                  className={`${animClass} grid grid-cols-[1fr_200px_90px] px-5 h-14 items-center border-b border-ink-100 last:border-b-0 ${i % 2 === 1 ? 'bg-[#FAFAFA]/60' : 'bg-white'}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-success/15 text-success flex items-center justify-center [&>svg]:w-3.5 [&>svg]:h-3.5">
                      <I.Check />
                    </span>
                    <span className="text-[14px] font-medium text-ink-900 truncate">{p.full_name}</span>
                  </div>
                  <div className="text-[13px] text-ink-500 truncate">{p.email}</div>
                  <div className="text-[13px] text-ink-500 num text-right">{p.hora}</div>
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
  const { turmas, getAlunosDaTurma } = useData()
  const turma = turmas.find(t => t.id === turmaId) || turmas[0]
  const totalAlunos = turma?.alunos || 0
  const alunosDaTurma = turmaId ? getAlunosDaTurma(turmaId) : []
  const [presentes, setPresentes] = useState([]);
  const [seconds, setSeconds] = useState(15 * 60);
  const [confirmEnd, setConfirmEnd] = useState(false);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  // Simular presenças com alunos reais
  useEffect(() => {
    if (alunosDaTurma.length === 0) return
    if (presentes.length >= alunosDaTurma.length) return;
    const next = alunosDaTurma[presentes.length];
    if (!next) return;
    const delay = presentes.length === 0 ? 1200 : 900 + Math.random() * 1700;
    const id = setTimeout(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setPresentes((p) => [...p, { ...next, hora: `${hh}:${mm}:${ss}` }]);
    }, delay);
    return () => clearTimeout(id);
  }, [presentes, alunosDaTurma]);

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const pct = totalAlunos > 0 ? Math.round((presentes.length / totalAlunos) * 100) : 0;
  const animClass = { fade: 'animate-fadeUp', slide: 'animate-slideIn', scale: 'animate-scaleIn' }[tableAnim] || 'animate-fadeUp';

  if (!turma) return null

  const qrSection = <QRBlock turma={turma} seconds={seconds} fmtTime={fmtTime} />;
  const tableSection = (
    <PresencasTable turma={turma} presentes={presentes} total={totalAlunos} pct={pct} animClass={animClass} />
  );

  let layoutEl;
  if (layout === 'split') {
    layoutEl = (
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0">
        <div className="bg-gradient-to-br from-brand-50/60 via-white to-brand-50/30 border-r border-ink-100 flex items-center justify-center p-8 lg:p-12">
          {qrSection}
        </div>
        <div className="bg-white flex flex-col min-h-0">{tableSection}</div>
      </div>
    );
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
    );
  } else {
    layoutEl = (
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] min-h-0">
        <div className="bg-gradient-to-br from-brand-50 via-white to-brand-50/40 flex items-center justify-center p-12">
          <QRBlock turma={turma} seconds={seconds} fmtTime={fmtTime} large />
        </div>
        <div className="bg-white border-l border-ink-100 flex flex-col min-h-0">{tableSection}</div>
      </div>
    );
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
    </div>
  );
}
