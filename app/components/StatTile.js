'use client';

import { motion } from 'framer-motion';

export default function StatTile({
  value,
  label,
  icon,
  color = 'primary',
  trend,
  trendUp = true,
  loading = false,
  onClick,
  className = '',
}) {
  const colors = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    neutral: 'bg-neutral/10 text-neutral',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
  };

  if (loading) {
    return (
      <div className={`bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-5 animate-pulse ${className}`}>
        <div className="w-12 h-12 bg-base-300 rounded-2xl mb-3" />
        <div className="h-8 w-20 bg-base-300 rounded-lg mb-1" />
        <div className="h-4 w-32 bg-base-300 rounded" />
      </div>
    );
  }

  return (
    <motion.div
      className={`
        bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-5
        transition-all duration-300
        ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${colors[color]}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-bold ${trendUp ? 'text-success' : 'text-error'}`}>
            {trendUp ? '+' : ''}{trend}%
          </span>
        )}
      </div>

      <div className="text-3xl font-black text-slate-800 mb-1">
        {value}
      </div>

      <div className="text-xs text-slate-500 font-bold">
        {label}
      </div>
    </motion.div>
  );
}
