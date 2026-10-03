/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#FAF8F5',
          warm: '#F5F2EB',
          surface: '#FFFFFF',
          muted: '#F0ECE4',
        },
        charcoal: {
          DEFAULT: '#22252A',
          deep: '#181A1D',
          muted: '#52575E',
          subtle: '#7E8590',
          border: '#E4DFD7',
          borderLight: '#EEEAE3',
        },
        accent: {
          DEFAULT: '#2E6F40',      // Natural green accent
          hover: '#245933',
          light: '#EBF4EE',
          border: '#C2DEC8',
          dark: '#1C4627',
        },
        terracotta: {
          DEFAULT: '#C86D51',
          light: '#FAF0ED',
        },
        craft: {
          DEFAULT: '#C99E74',
          light: '#F8F4EE',
          dark: '#8B643E',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(34, 37, 42, 0.05), 0 1px 2px rgba(34, 37, 42, 0.03)',
        'card': '0 2px 6px rgba(34, 37, 42, 0.06), 0 1px 2px rgba(34, 37, 42, 0.04)',
        'hover': '0 6px 16px rgba(34, 37, 42, 0.08), 0 2px 4px rgba(34, 37, 42, 0.04)',
        'modal': '0 12px 32px rgba(34, 37, 42, 0.12), 0 4px 10px rgba(34, 37, 42, 0.06)',
      },
      borderRadius: {
        'DEFAULT': '8px',
        'sm': '6px',
        'md': '10px',
        'lg': '12px',
        'xl': '16px',
      }
    },
  },
  plugins: [],
}
