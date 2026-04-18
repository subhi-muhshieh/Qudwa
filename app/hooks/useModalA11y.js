'use client'

import { useEffect, useRef, useCallback } from 'react';

/**
 * Modal accessibility helpers:
 *  - Scroll lock on <body> while open.
 *  - Escape key closes the modal.
 *  - Tab/Shift+Tab is trapped inside the container.
 *  - Focus is auto-moved inside on open and restored to the previous element on close.
 *
 * Usage:
 *   const containerRef = useModalA11y({ open, onClose });
 *   return <div ref={containerRef} role="dialog" aria-modal="true">...</div>;
 */
export default function useModalA11y({ open, onClose }) {
  const containerRef = useRef(null);
  const previouslyFocused = useRef(null);

  // Scroll lock
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Save/restore focus + auto-focus first focusable
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement;

    const id = window.requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const focusable = getFocusable(containerRef.current);
      (focusable[0] || containerRef.current).focus();
    });

    return () => {
      window.cancelAnimationFrame(id);
      const prev = previouslyFocused.current;
      if (prev && typeof prev.focus === 'function') {
        prev.focus();
      }
    };
  }, [open]);

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
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
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

  return containerRef;
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
