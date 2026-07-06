import { Card } from './Card';
import { ProgressBar } from './ProgressBar';

export const CategoryCard = ({ label, value, color = 'mint', delta }) => {
  return (
    <Card className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-ink-500 dark:text-ink-300">{label}</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-ink-900 dark:text-white">{value.toFixed(2)} kg</div>
        </div>
        <div className={`h-11 w-11 rounded-2xl ${color === 'mint' ? 'bg-mint-500/15 text-mint-500' : color === 'sand' ? 'bg-sand-500/15 text-sand-500' : 'bg-ink-500/15 text-ink-500'} grid place-items-center text-lg font-bold`}>{label[0]}</div>
      </div>
      <ProgressBar value={Math.min(100, value * 10)} tone={color} label={delta ? `Change ${delta}` : undefined} />
    </Card>
  );
};
