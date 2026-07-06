import { Card } from './Card';
import { Button } from './Button';

export const EmptyState = ({ title, description, actionLabel, onAction }) => (
  <Card className="grid place-items-center gap-4 py-10 text-center">
    <div className="max-w-md grid gap-2">
      <h3 className="text-xl font-semibold text-ink-900 dark:text-white">{title}</h3>
      <p className="text-sm leading-6 text-ink-600 dark:text-ink-300">{description}</p>
    </div>
    {actionLabel ? <Button onClick={onAction}>{actionLabel}</Button> : null}
  </Card>
);
