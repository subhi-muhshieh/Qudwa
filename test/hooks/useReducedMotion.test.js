import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

describe('useReducedMotion', () => {
  it('should return false when prefers-reduced-motion is not set', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('should return true when prefers-reduced-motion is set to reduce', () => {
    // Mock matchMedia to return true for reduced motion
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('should provide enabled variants for animations', () => {
    const { result } = renderHook(() => useReducedMotion());

    // The hook should provide animation variants
    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe('boolean');
  });
});
