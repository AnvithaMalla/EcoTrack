import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';
import { Card } from './Card';
import { BadgePill } from './BadgePill';

export const SuggestionCard = ({ suggestion }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}>
    <Card className="grid gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <div className="flex items-center gap-2">
            <FiZap className="text-mint-500" />
            <h3 className="text-lg font-semibold text-ink-900 dark:text-white">{suggestion.title}</h3>
          </div>
          <p className="text-sm leading-6 text-ink-600 dark:text-ink-300">{suggestion.description}</p>
        </div>
        <BadgePill tone={suggestion.category === 'travel' ? 'mint' : suggestion.category === 'food' ? 'sand' : 'ink'}>{suggestion.difficulty}</BadgePill>
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-ink-500 dark:text-ink-300">
        <span>Estimated savings: {Number(suggestion.estimated_savings || 0).toFixed(2)} kg CO2e</span>
        <span>Category: {suggestion.category}</span>
      </div>
    </Card>
  </motion.div>
);
