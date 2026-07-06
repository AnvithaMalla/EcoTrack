import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const base = 'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-mint-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
const variants = {
  primary: 'bg-mint-500 text-white shadow-glow hover:bg-mint-400',
  secondary: 'bg-ink-100 text-ink-800 hover:bg-ink-200 dark:bg-ink-800 dark:text-white dark:hover:bg-ink-700',
  ghost: 'bg-transparent text-ink-700 hover:bg-ink-100 dark:text-ink-100 dark:hover:bg-ink-800',
  danger: 'bg-red-500 text-white hover:bg-red-400',
};

export const Button = forwardRef(function Button({ variant = 'primary', className = '', as: Component = 'button', ...props }, ref) {
  return <Component ref={ref} className={`${base} ${variants[variant]} ${className}`} {...props} />;
});

export const MotionButton = motion(Button);
