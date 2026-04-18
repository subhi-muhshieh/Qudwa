'use client'

import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

/**
 * Accessible modal primitive (RTL-aware).
 *
 * Features:
 * - Renders in a portal on <body> to escape stacking contexts.
 * - Backdrop click to close (configurable).
 * - Escape key to close.
 * - Scroll-lock on <body> while open.
 * - Focus trap: Tab/Shift+Tab cycles within the modal; focus returns to the trigger on close.
 * - Respects prefers-reduced-motion via the framer-motion guidelines.
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - title: optional string/node rendered in the header.
 * - description: optional string used for aria-describedby.
 * - children: body content.
 * - footer: optional footer node (e.g., action buttons).
 * - size: 'sm' | 'md' | 'lg' | 'xl' | 'full'. Default 'md'.
 * - closeOnBackdrop: boolean, default true.
 * - showCloseButton: boolean, default true.
 * - initialFocusRef: optional ref to focus on open.
 */
const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw] h-[90vh]',
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  showCloseButton = true,
  initialFocusRef,
}) {
  const containerRef = useRef(null);
  const previouslyFocused = useRef(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2, 9)}`);
  const descId = useRef(`modal-desc-${Math.random().toString(36).slice(2, 9)}`);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Save/restore focus + initial focus
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement;

    // Defer so the modal content is mounted and measurable.
    const id = window.requestAnimationFrame(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else if (containerRef.current) {
        const focusable = getFocusable(containerRef.current);
        (focusable[0] || containerRef.current).focus();
      }
    });

    return () => {
      window.cancelAnimationFrame(id);
      const prev = previouslyFocused.current;
      if (prev && typeof prev.focus === 'function') {
        prev.focus();
      }
    };
  }, [open, initialFocusRef]);

  // Escape + focus trap
  const handleKeyDown = useCallback(
    (e) => {
      if (!open) return;
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key === 'Tab' && containerRef.current) {
        const focusable = getFocusable(containerRef.current);
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [open, onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="إغلاق"
            tabIndex={-1}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="absolute inset-0 w-full h-full bg-neutral/40 backdrop-blur-md cursor-default"
          />

          {/* Panel */}
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId.current : undefined}
            aria-describedby={description ? descId.current : undefined}
            tabIndex={-1}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className={`relative w-full ${SIZE_CLASSES[size] || SIZE_CLASSES.md} bg-base-100 rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.25)] border border-white/60 overflow-hidden flex flex-col max-h-[90vh]`}
          >
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-base-200">
                <div className="min-w-0 flex-1">
                  {title && (
                    <h2
                      id={titleId.current}
                      className="text-xl md:text-2xl font-black text-base-content truncate"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      id={descId.current}
                      className="text-sm text-base-content/60 mt-1"
                    >
                      {description}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="إغلاق"
                    className="w-10 h-10 rounded-full bg-base-200 hover:bg-base-300 text-base-content/70 hover:text-base-content flex items-center justify-center transition-colors active:scale-95 shrink-0"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">
              {children}
            </div>

            {footer && (
              <div className="px-6 py-4 border-t border-base-200 bg-base-200/40 flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function getFocusable(root) {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');
  return Array.from(root.querySelectorAll(selector)).filter(
    (el) => !el.hasAttribute('inert') && el.offsetParent !== null
  );
}
