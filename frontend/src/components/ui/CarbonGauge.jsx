import { motion } from 'framer-motion';

export const CarbonGauge = ({ value = 0, budget = 7 }) => {
  const ratio = Math.min(1, Math.max(0, value / budget));
  const angle = -120 + ratio * 240;
  const tone = ratio < 0.5 ? 'text-mint-500' : ratio < 0.75 ? 'text-sand-500' : 'text-red-500';
  return (
    <div className="relative mx-auto grid aspect-square w-full max-w-[280px] place-items-center">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-mint-500/20 via-transparent to-sand-500/20 blur-2xl" />
      <svg viewBox="0 0 200 200" className="relative h-full w-full drop-shadow-2xl">
        <defs>
          <linearGradient id="gaugeTrack" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#15a473" />
            <stop offset="50%" stopColor="#f98a12" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <path d="M 30 150 A 70 70 0 1 1 170 150" fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="18" strokeLinecap="round" />
        <path d="M 30 150 A 70 70 0 1 1 170 150" fill="none" stroke="url(#gaugeTrack)" strokeWidth="18" strokeLinecap="round" strokeDasharray={`${ratio * 220} 220`} />
        <line x1="100" y1="150" x2="100" y2="78" stroke="#0b1320" strokeWidth="5" strokeLinecap="round" transform={`rotate(${angle} 100 150)`} />
        <circle cx="100" cy="150" r="8" fill="#0b1320" />
      </svg>
      <motion.div className="absolute grid place-items-center text-center" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
        <div className={`text-4xl font-black tracking-tight ${tone}`}>{value.toFixed(1)}</div>
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-500 dark:text-ink-300">kg CO2e</div>
      </motion.div>
    </div>
  );
};
