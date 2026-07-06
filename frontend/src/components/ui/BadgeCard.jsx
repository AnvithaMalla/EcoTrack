import { motion } from 'framer-motion';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';
import { BadgePill } from './BadgePill';

export const BadgeCard = ({ badge }) => (
  <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -3 }}>
    <Card className={`grid gap-4 ${badge.unlocked ? 'ring-1 ring-mint-400/40' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <h3 className="text-lg font-semibold text-ink-900 dark:text-white">{badge.name}</h3>
          <p className="text-sm leading-6 text-ink-600 dark:text-ink-300">{badge.description}</p>
        </div>
        <BadgePill tone={badge.unlocked ? 'mint' : 'ink'}>{badge.unlocked ? 'Unlocked' : 'Locked'}</BadgePill>
      </div>
      <ProgressBar value={badge.progress * 100} tone={badge.unlocked ? 'mint' : 'sand'} label={`${Math.round(badge.progress * 100)}% progress`} />
    </Card>
  </motion.div>
);
