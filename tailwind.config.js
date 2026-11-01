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
        lab: {
          bg: '#0a0d14',
          card: '#111726',
          border: '#1e293b',
          surface: '#151d30',
        },
        physics: {
          light: '#38bdf8',
          DEFAULT: '#0284c7',
          dark: '#0369a1',
        },
        chemistry: {
          light: '#34d399',
          DEFAULT: '#059669',
          dark: '#047857',
        },
        biology: {
          light: '#a3e635',
          DEFAULT: '#65a30d',
          dark: '#4d7c0f',
        },
        environmental: {
          light: '#2dd4bf',
          DEFAULT: '#0d9488',
          dark: '#0f766e',
        },
        mathematics: {
          light: '#818cf8',
          DEFAULT: '#4f46e5',
          dark: '#4338ca',
        },
        computerscience: {
          light: '#fb7185',
          DEFAULT: '#e11d48',
          dark: '#be123c',
        },
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(56, 189, 248, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(56, 189, 248, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}

