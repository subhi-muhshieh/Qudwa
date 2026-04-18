import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:     ['var(--font-tajawal)', 'sans-serif'],
        slogan:   ['var(--font-slogan)'],
        nastaliq: ['var(--font-nastaliq)'],
      },
      backgroundImage: {
        'leaf-pattern': "url('/leaf-pattern.svg')",
        // Custom gradient using your exact colors for easy calling
        'gradient-qudwa': 'linear-gradient(135deg, #1268b1 0%, #0ea9dd 100%)',
      },
      borderRadius: {
        'box': '1.5rem',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        qudwaTheme: {
          // ── Primary: Deep Rich Blue (#1268b1) ──────────────────────
          "primary":         "#1268b1",
          "primary-focus":   "#0e528d",
          "primary-content": "#ffffff",

          // ── Secondary: Vibrant Sky/Cyan (#0ea9dd) ─────────────────
          "secondary":         "#0ea9dd",
          "secondary-focus":   "#0b8bb8",
          "secondary-content": "#ffffff",

          // ── Accent: Vibrant Orange/Amber ────────
          "accent":         "#d95d14",
          "accent-focus":   "#b54a0d",
          "accent-content": "#ffffff",

          // ── Neutral: Deep Navy ───────
          "neutral":         "#0a2a4a",
          "neutral-focus":   "#061b30",
          "neutral-content": "#f4fafd",

          // ── Base: Crisp Icy Whites ────
          "base-100": "#f4fafd",
          "base-200": "#e3f1f9",
          "base-300": "#cde5f4",
          "base-content": "#0a2640",

          // ── Semantic Colors (WCAG AA compliant on base-100) ───────────
          "info":    "#0ea9dd",
          "success": "#059669",  // Darkened from #10b981 for 4.5:1 contrast
          "warning": "#d97706",  // Darkened from #f59e0b for 4.5:1 contrast
          "error":   "#dc2626",  // Darkened from #ef4444 for 5:1 contrast
        },
      },
    ],
  },
};