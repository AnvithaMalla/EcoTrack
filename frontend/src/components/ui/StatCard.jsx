import { motion } from 'framer-motion';
import { Card } from './Card';

export const StatCard = ({ label, value, hint, icon, tone = 'mint' }) => {
  const tones = {
    mint: 'from-mint-500/20 to-transparent text-mint-500',
    sand: 'from-sand-500/20 to-transparent text-sand-500',
    ink: 'from-ink-500/20 to-transparent text-ink-700',
    red: 'from-red-500/20 to-transparent text-red-500',
  };
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${tones[tone]} opacity-70`} />
      <motion.div className="relative grid gap-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink-600 dark:text-ink-300">{label}</span>
          {icon ? <span className="text-xl">{icon}</span> : null}
        </div>
        <div className="text-3xl font-semibold tracking-tight text-ink-900 dark:text-white">{value}</div>
        {hint ? <div className="text-xs leading-5 text-ink-500 dark:text-ink-300">{hint}</div> : null}
      </motion.div>
    </Card>
  );
};
