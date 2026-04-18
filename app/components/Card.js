'use client';

import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = true,
  onClick,
  ...props
}) {
  const variants = {
    default: 'bg-white/80 backdrop-blur-xl border border-white/60',
    glass: 'glass-card',
    elevated: 'bg-white shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-100',
    outlined: 'bg-transparent border-2 border-base-300',
    soft: 'bg-base-200/50 border border-base-200',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const baseClasses = `
    rounded-[2rem]
    transition-all duration-300
    ${variants[variant]}
    ${paddings[padding]}
    ${hover && onClick ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1' : ''}
    ${hover && !onClick ? 'hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1' : ''}
    ${className}
  `;

  const Wrapper = onClick ? motion.button : motion.div;

  return (
    <Wrapper
      className={baseClasses}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.01 } : {}}
      whileTap={onClick ? { scale: 0.99 } : {}}
      {...props}
    >
      {children}
    </Wrapper>
  );
}
