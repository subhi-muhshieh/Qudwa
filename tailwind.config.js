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
      backgroundImage: {
        // We will create the leaf pattern in CSS, but this enables it
        'leaf-pattern': "url('/leaf-pattern.svg')", 
      },
      borderRadius: {
        // "Soft Rounded" usually means 1rem to 1.5rem (xl to 2xl), not full pills
        'box': '1.5rem', 
      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        qudwaTheme: {
          "primary": "#1281c3",   // Your Main Blue
          "secondary": "#1599d3", // Lighter Blue
          "accent": "#1268b1",    // Darker Blue highlight
          "neutral": "#0c4a6e",   // Dark text (Deep Ocean Blue)
          "base-100": "#f0f9ff",  // Very light azure (not pure white)
          "base-200": "#e0f2fe",  // Slightly darker azure for cards
          "base-300": "#bae6fd",  // Borders
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
  },
};