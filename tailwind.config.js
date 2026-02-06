import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'], 
  theme: {
    extend: {
      fontFamily: {
        // We added slogan before, now we add nastaliq back
        slogan: ['var(--font-slogan)'],
        nastaliq: ['var(--font-nastaliq)'], 
      },
      backgroundImage: {
        'leaf-pattern': "url('/leaf-pattern.svg')", 
      },
      borderRadius: {
        'box': '1.5rem', 
      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        qudwaTheme: {
          "primary": "#1281c3",   
          "secondary": "#1599d3", 
          "accent": "#1268b1",    
          "neutral": "#0c4a6e",   
          "base-100": "#f0f9ff",  
          "base-200": "#e0f2fe",  
          "base-300": "#bae6fd",  
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
      {
        dark: {
          "primary": "#38bdf8",   
          "secondary": "#0ea5e9", 
          "accent": "#7dd3fc",    
          "neutral": "#f0f9ff",   
          "base-100": "#0f172a",  
          "base-200": "#1e293b",  
          "base-300": "#334155",  
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
  },
};