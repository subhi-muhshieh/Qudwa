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
          "primary-focus":   "#0e528d", // Slightly darker for hover states
          "primary-content": "#ffffff",
          
          // ── Secondary: Vibrant Sky/Cyan (#0ea9dd) ─────────────────
          "secondary":         "#0ea9dd",
          "secondary-focus":   "#0b8bb8", // Slightly darker for hover states
          "secondary-content": "#ffffff",
          
          // ── Accent: Vibrant Orange/Amber (The Complement) ────────
          // This sits perfectly opposite your blues on the color wheel
          "accent":         "#d95d14", 
          "accent-focus":   "#b54a0d",
          "accent-content": "#ffffff",
          
          // ── Neutral: Deep Navy (For dark cinematic headers) ───────
          "neutral":         "#0a2a4a",
          "neutral-focus":   "#061b30",
          "neutral-content": "#f4fafd",
          
          // ── Base: Crisp Icy Whites (Glassmorphism backgrounds) ────
          "base-100": "#f4fafd", // Main app background (tinted with your cyan)
          "base-200": "#e3f1f9", // Slightly darker for section contrast
          "base-300": "#cde5f4", // For borders and heavy shadows
          "base-content": "#0a2640", // Deep slate for highly readable text
          
          // ── Semantic Colors ─────────────────────────────────────────
          "info":    "#0ea9dd",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error":   "#ef4444",
        },
      },
    ],
  },
};