import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export function ConfigScreen() {
  return (
    <div className="flex-1 overflow-y-auto scroll-quiet">
      <div className="px-10 py-8 max-w-3xl">
        <h1 className="text-[28px] font-bold tracking-tight text-ink-900">Configurações</h1>
        <p className="mt-1 text-[14px] text-ink-500 mb-7">Preferências da conta e da chamada.</p>

        <div className="space-y-5">
          <Card>
            <h3 className="text-[15px] font-semibold text-ink-900 mb-1">Duração padrão da sessão</h3>
            <p className="text-[13px] text-ink-500 mb-4">Tempo até o QR Code expirar automaticamente.</p>
            <div className="flex items-center gap-3">
              <Input value="15 minutos" onChange={() => {}} className="w-48" />
              <Button variant="secondary" size="sm">Salvar</Button>
            </div>
          </Card>
          <Card>
            <h3 className="text-[15px] font-semibold text-ink-900 mb-1">Notificações</h3>
            <p className="text-[13px] text-ink-500 mb-4">Receba lembretes antes de cada aula.</p>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-ink-900">Lembrete 10 min antes</span>
              <button className="w-11 h-6 rounded-full bg-brand-500 relative transition-colors">
                <span className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
