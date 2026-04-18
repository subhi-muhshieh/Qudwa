'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-focus shadow-lg shadow-primary/25',
  secondary: 'bg-secondary text-white hover:bg-secondary-focus shadow-lg shadow-secondary/25',
  accent: 'bg-accent text-white hover:bg-accent-focus shadow-lg shadow-accent/25',
  neutral: 'bg-neutral text-white hover:bg-neutral-focus shadow-lg shadow-neutral/25',
  ghost: 'bg-transparent text-primary hover:bg-primary/10 border border-primary/20',
  outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
  glass: 'bg-white/70 backdrop-blur-md border border-white/60 text-slate-700 hover:bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
  soft: 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/10',
  error: 'bg-error text-white hover:bg-error-focus shadow-lg shadow-error/25',
  white: 'bg-white text-neutral hover:bg-base-100 border border-base-200 shadow-sm',
};

const sizes = {
  xs: 'px-3 py-1.5 text-xs rounded-lg min-h-[28px]',
  sm: 'px-4 py-2 text-sm rounded-xl min-h-[36px]',
  md: 'px-5 py-2.5 text-sm rounded-xl min-h-[44px]',
  lg: 'px-6 py-3 text-base rounded-[1.2rem] min-h-[52px]',
  xl: 'px-8 py-4 text-lg rounded-[1.5rem] min-h-[60px]',
  icon: 'p-2.5 rounded-xl min-h-[44px] min-w-[44px]',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    loading = false, // لالتقاطها من الاختبارات
    isDisabled = false,
    disabled = false, // لالتقاطها من الاختبارات
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    onClick,
    type = 'button',
    href, // أضفنا خاصية الرابط
    ...props
  },
  ref
) {
  // توحيد الحالات
  const isActuallyLoading = isLoading || loading;
  const isActuallyDisabled = isDisabled || disabled;

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-bold tracking-wide
    transition-all duration-200 ease-out
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
    focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const content = (
    <>
      {isActuallyLoading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {!isActuallyLoading && leftIcon}
      {children}
      {!isActuallyLoading && rightIcon}
    </>
  );

  const animationProps = {
    whileHover: isActuallyDisabled || isActuallyLoading ? {} : { scale: 1.02 },
    whileTap: isActuallyDisabled || isActuallyLoading ? {} : { scale: 0.98 }
  };

  // إذا تم تمرير href، قم بإرجاع عنصر <a>
  if (href) {
    return (
      <motion.a
        ref={ref}
        href={href}
        onClick={onClick}
        className={baseClasses}
        aria-disabled={isActuallyDisabled || isActuallyLoading}
        {...animationProps}
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  // في حال عدم وجود href، قم بإرجاع زر طبيعي
  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={isActuallyDisabled || isActuallyLoading}
      aria-busy={isActuallyLoading} // هاد السطر بيحل فشل الـ Accessibility
      className={baseClasses}
      {...animationProps}
      {...props}
    >
      {content}
    </motion.button>
  );
});

export default Button;