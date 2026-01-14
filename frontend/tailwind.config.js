/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f6f6',
          100: '#e8ecec',
          200: '#d1d9da',
          300: '#a8b5b7',
          400: '#778a8d',
          500: '#2c3e40', // Main color #2c3e40
          600: '#263537',
          700: '#1f2c2e',
          800: '#192325',
          900: '#131a1c',
          950: '#0d1213',
        },
        accent: {
          50: '#eefbf4',
          100: '#d6f5e3',
          200: '#b0eacc',
          300: '#7dd9ad',
          400: '#48c089',
          500: '#26a66d',
          600: '#188556',
          700: '#156b47',
          800: '#14553a',
          900: '#124631',
        },
        surface: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.05)',
        'elevated': '0 10px 40px -10px rgba(0,0,0,0.15)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
