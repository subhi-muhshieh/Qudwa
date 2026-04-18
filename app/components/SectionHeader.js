'use client'

/**
 * Lightweight section heading with a colored bar accent.
 *
 * Props:
 * - title: string/node.
 * - count: optional number rendered as a pill (for lists).
 * - description: optional subtitle.
 * - action: optional trailing node (button/link).
 * - tone: 'primary' | 'secondary' | 'accent'. Controls bar gradient. Default 'primary'.
 * - className: optional extra classes on the wrapper.
 */
const TONES = {
  primary: 'from-primary to-secondary',
  secondary: 'from-secondary to-primary',
  accent: 'from-accent to-primary',
};

export default function SectionHeader({
  title,
  count,
  description,
  action,
  tone = 'primary',
  className = '',
}) {
  return (
    <div className={`flex items-center justify-between gap-4 mb-6 md:mb-8 ${className}`}>
      <div className="flex items-start gap-3 min-w-0">
        <div
          className={`w-2 md:w-2.5 h-8 md:h-10 rounded-full bg-gradient-to-b shrink-0 mt-1 ${TONES[tone] || TONES.primary}`}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl md:text-2xl font-black text-base-content leading-tight break-words">
              {title}
            </h2>
            {typeof count === 'number' && (
              <span className="inline-flex items-center justify-center min-w-[1.75rem] h-7 px-2 rounded-full bg-primary/10 text-primary text-xs font-black">
                {count}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-sm md:text-base text-base-content/60 font-medium">
              {description}
            </p>
          )}
        </div>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
