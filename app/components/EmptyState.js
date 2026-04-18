'use client'

/**
 * Reusable empty-state panel.
 *
 * Props:
 * - icon: ReactNode rendered inside the circular badge.
 * - title: string heading.
 * - description: optional string/ReactNode subtext.
 * - action: optional ReactNode (button/link).
 * - className: optional extra classes for the outer wrapper.
 */
export default function EmptyState({ icon, title, description, action, className = '' }) {
  return (
    <div
      role="status"
      className={`text-center bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_10px_40px_rgb(0,0,0,0.03)] border border-white/60 ${className}`}
    >
      {icon && (
        <div className="w-20 h-20 md:w-24 md:h-24 bg-base-200 rounded-[1.75rem] flex items-center justify-center mx-auto mb-6 text-primary/50 text-3xl">
          {icon}
        </div>
      )}
      <h3 className="text-xl md:text-2xl font-black text-base-content mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-base-content/60 font-medium max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
