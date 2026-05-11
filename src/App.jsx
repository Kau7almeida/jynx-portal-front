import { useState, useEffect } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { DashboardScreen } from './screens/professor/DashboardScreen'
import { SelecaoTurmaScreen } from './screens/professor/SelecaoTurmaScreen'
import { ChamadaAtivaScreen } from './screens/professor/ChamadaAtivaScreen'
import { HistoricoScreen } from './screens/professor/HistoricoScreen'
import { DetalheScreen } from './screens/professor/DetalheScreen'
import { ConfigScreen } from './screens/professor/ConfigScreen'
import { TurmasScreen } from './screens/professor/TurmasScreen'
import { AdminScreen } from './screens/admin/AdminScreen'
import { AlunoFlow } from './screens/aluno/AlunoFlow'
import { AlunoSelectScreen } from './screens/aluno/AlunoSelectScreen'
import { AlunoSucessoScreen } from './screens/aluno/AlunoSucessoScreen'
import { PresenterOverlay } from './screens/PresenterOverlay'
import { DataProvider } from './lib/DataContext'

function AppContent() {
  // Detectar se o aluno acessou via QR Code (?chamada=turmaId)
  const params = new URLSearchParams(window.location.search)
  const chamadaTurmaId = params.get('chamada')

  const [route, setRoute] = useState(chamadaTurmaId ? 'aluno-chamada' : 'dashboard');
  const [activeTurma, setActiveTurma] = useState(null);
  const [detailEntry, setDetailEntry] = useState(null);
  const [presenter, setPresenter] = useState(false);
  const [alunoConfirmado, setAlunoConfirmado] = useState(null);

  const startChamada = (turmaId) => {
    setActiveTurma(turmaId);
    setRoute('chamada-ativa');
  };

  const endChamada = () => {
    setActiveTurma(null);
    setPresenter(false);
    setRoute('historico');
  };

  const openDetail = (entry) => {
    setDetailEntry(entry);
    setRoute('historico-detalhe');
  };

  // ESC closes presenter
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && presenter) setPresenter(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [presenter]);

  // Aluno acessou via QR Code — tela cheia mobile
  if (route === 'aluno-chamada' && chamadaTurmaId) {
    if (alunoConfirmado) {
      return (
        <div className="h-screen flex flex-col">
          <AlunoSucessoScreen
            aluno={alunoConfirmado}
            turmaId={chamadaTurmaId}
            onClose={() => { setAlunoConfirmado(null); }}
          />
        </div>
      )
    }
    return (
      <div className="h-screen flex flex-col">
        <AlunoSelectScreen
          turmaId={chamadaTurmaId}
          onConfirm={(a) => setAlunoConfirmado(a)}
          onCancel={() => {}}
        />
      </div>
    )
  }

  // Fullscreen aluno preview = no sidebar
  if (route === 'aluno') {
    return (
      <div className="h-screen flex flex-col">
        <AlunoFlow onExit={() => setRoute('dashboard')} />
      </div>
    );
  }

  // Header configuration per route
  const headerProps = {
    dashboard: { greeting: 'Olá, Profa. Marina!', subtitle: undefined },
    chamada: { greeting: 'Iniciar Chamada', subtitle: 'Escolha uma turma para começar' },
    turmas: { greeting: 'Suas Turmas', subtitle: undefined },
    historico: { greeting: 'Histórico', subtitle: 'Registros de chamadas anteriores' },
    'historico-detalhe': { greeting: 'Detalhe da Chamada', subtitle: undefined },
    config: { greeting: 'Configurações', subtitle: undefined },
    admin: { greeting: 'Painel Administrativo', subtitle: 'Gerencie cursos, turmas e alunos' },
  }[route] || { greeting: 'Olá, Profa. Marina!' };

  const showHeader = route !== 'chamada-ativa';

  return (
    <div className="h-screen flex bg-white">
      <Sidebar
        active={route}
        onNavigate={(id) => {
          if (id === 'aluno') { setRoute('aluno'); return; }
          if (id === 'config') { setRoute('config'); return; }
          if (id === 'admin') { setRoute('admin'); return; }
          if (id === 'dashboard') setRoute('dashboard');
          if (id === 'chamada') setRoute('chamada');
          if (id === 'turmas') setRoute('turmas');
          if (id === 'historico') setRoute('historico');
        }}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {showHeader && <Header {...headerProps} />}

        {route === 'dashboard' && (
          <DashboardScreen onNavigate={setRoute} onStartChamada={startChamada} />
        )}
        {route === 'chamada' && (
          <SelecaoTurmaScreen onStartChamada={startChamada} />
        )}
        {route === 'chamada-ativa' && (
          <ChamadaAtivaScreen
            turmaId={activeTurma}
            layout="split"
            tableAnim="fade"
            onEnd={endChamada}
            onPresenter={() => setPresenter(true)}
          />
        )}
        {route === 'turmas' && <TurmasScreen />}
        {route === 'historico' && <HistoricoScreen />}
        {route === 'historico-detalhe' && (
          <DetalheScreen onBack={() => setRoute('historico')} />
        )}
        {route === 'config' && <ConfigScreen />}
        {route === 'admin' && <AdminScreen />}
      </main>

      {/* Presenter mode overlay */}
      {presenter && activeTurma && (
        <PresenterOverlay turmaId={activeTurma} onClose={() => setPresenter(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  )
}
