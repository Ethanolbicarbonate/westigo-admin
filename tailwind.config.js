/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system', 
          'BlinkMacSystemFont', 
          '"Segoe UI"', 
          'Roboto', 
          '"Helvetica Neue"', 
          'Arial', 
          'sans-serif'
        ],
      },
      colors: {
        westigo: {
          blue: '#0D47A1', // Primary Brand Color
          50: '#E3F2FD',
          100: '#BBDEFB',
          500: '#2196F3',
          900: '#0D47A1',
        },
        cupertino: {
          bg: '#F2F2F7',
          card: '#FFFFFF',
          text: '#000000',
          subtext: '#8E8E93',
          border: '#C6C6C8',
        }
      },
      boxShadow: {
        'cupertino': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'float': '0 10px 40px -10px rgba(0,0,0,0.15)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}