/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modo claro
        primary: '#6A5ACD',
        'primary-dark': '#26428B',
        'primary-darker': '#4169E1',
        'primary-light': '#4682B4',
        'primary-lightest': '#6A5ACD',
        'primary-black': '#1e293b',
        'bg-color': '#f8fafc',
        'card-bg': '#ffffff',
        'hover-bg': '#f1f5f9',
        
        // Modo oscuro
        'dark-bg': '#0f172a',
        'dark-card': '#1e293b',
        'dark-text': '#f8fafc',
        'dark-hover': '#334155',
      }
    },
  },
  plugins: [],
} 