import { I } from '../icons'
import { Card } from './Card'
import { Badge } from './Badge'

export function StatCard({ icon, label, value, delta, tone = 'brand' }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-500',
    success: 'bg-[#ECFDF5] text-success',
    info: 'bg-[#EEF2FF] text-[#4F46E5]',
  };
  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-[10px] flex items-center justify-center ${tones[tone]} [&>svg]:w-5 [&>svg]:h-5`}>{icon}</div>
        {delta && (
          <Badge variant="success" size="sm" icon={<I.TrendUp />}>{delta}</Badge>
        )}
      </div>
      <div>
        <div className="text-[13px] text-ink-500 font-medium mb-1">{label}</div>
        <div className="text-[34px] font-bold tracking-tight text-ink-900 num leading-none">{value}</div>
      </div>
    </Card>
  );
}
