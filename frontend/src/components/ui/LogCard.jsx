import { Card } from './Card';
import { prettyDate } from '../../utils/date';

export const LogCard = ({ log }) => (
  <Card className="grid gap-3">
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="text-sm font-medium text-ink-500 dark:text-ink-300">{prettyDate(log.date)}</div>
        <div className="text-lg font-semibold text-ink-900 dark:text-white">{Number(log.totalEmission || 0).toFixed(2)} kg CO2e</div>
      </div>
      <div className={`rounded-full px-3 py-1 text-xs font-semibold ${Number(log.budgetRemaining || 0) < 0 ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-100' : 'bg-mint-50 text-mint-700 dark:bg-mint-950 dark:text-mint-100'}`}>
        {Number(log.budgetRemaining || 0) < 0 ? 'Exceeded' : 'Within budget'}
      </div>
    </div>
    <div className="grid gap-2 text-sm text-ink-600 dark:text-ink-300">
      <div>Travel: {Number(log.travel?.emission || 0).toFixed(2)} kg</div>
      <div>Food: {Number(log.food?.emission || 0).toFixed(2)} kg</div>
      <div>Energy: {Number(log.energy?.emission || 0).toFixed(2)} kg</div>
    </div>
  </Card>
);
