'use client'

import { motion } from 'framer-motion';

/**
 * Consistent page-top header used above main content.
 *
 * Props:
 * - eyebrow: optional short label rendered in a pill above the title.
 * - title: required main heading (string or node).
 * - description: optional subtitle.
 * - icon: optional icon node rendered in a badge to the side of the title.
 * - actions: optional node rendered on the end (button/link group).
 * - align: 'start' | 'center'. Default 'start'.
 * - className: optional extra classes on the wrapper.
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  icon,
  actions,
  align = 'start',
  className = '',
}) {
  const isCenter = align === 'center';

  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`w-full ${isCenter ? 'text-center' : ''} ${className}`}
    >
      <div
        className={`flex flex-col ${
          isCenter
            ? 'items-center'
            : 'md:flex-row md:items-center md:justify-between'
        } gap-6`}
      >
        <div className={`flex items-start gap-4 ${isCenter ? 'flex-col items-center' : ''}`}>
          {icon && (
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.25rem] bg-primary/10 text-primary flex items-center justify-center text-2xl md:text-3xl shrink-0 shadow-sm">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            {eyebrow && (
              <div className={`inline-flex items-center gap-2 bg-base-200 text-base-content/70 text-xs font-bold px-3 py-1.5 rounded-xl mb-3 ${isCenter ? '' : ''}`}>
                {eyebrow}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-base-content leading-tight tracking-tight break-words">
              {title}
            </h1>
            {description && (
              <p className={`mt-3 text-base md:text-lg text-base-content/60 font-medium leading-relaxed ${isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
                {description}
              </p>
            )}
          </div>
        </div>

        {actions && (
          <div className={`flex items-center gap-3 ${isCenter ? 'justify-center' : 'md:shrink-0'}`}>
            {actions}
          </div>
        )}
      </div>
    </motion.header>
  );
}
