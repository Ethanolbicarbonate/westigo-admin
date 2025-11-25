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
          '"Inter"', 
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        // iOS System Colors
        ios: {
          bg: '#F2F2F7',       // systemGroupedBackground (Light)
          card: '#FFFFFF',     // secondarySystemGroupedBackground (Light)
          blue: '#007AFF',     // System Blue
          red: '#FF3B30',      // System Red
          green: '#34C759',    // System Green
          indigo: '#5856D6',   // System Indigo
          orange: '#FF9500',   // System Orange
          yellow: '#FFCC00',   // System Yellow
          teal: '#5AC8FA',     // System Teal
          gray: '#8E8E93',     // System Gray
          gray2: '#AEAEB2',    // System Gray 2
          gray3: '#C7C7CC',    // System Gray 3
          gray4: '#D1D1D6',    // System Gray 4
          gray5: '#E5E5EA',    // System Gray 5
          gray6: '#F2F2F7',    // System Gray 6
          separator: '#C6C6C8', // Separator
          label: '#000000',    // Label Color
          secondaryLabel: '#3C3C4399', // Label Color (60% opacity approx)
          tertiaryLabel: '#3C3C434D', // Label Color (30% opacity approx)
        },
        // Westigo Brand Colors (mapped to iOS feel)
        westigo: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          500: '#007AFF', // Using iOS Blue as primary for consistency
          600: '#005BB8',
          900: '#003570',
        }
      },
      boxShadow: {
        'ios-sm': '0 1px 2px rgba(0,0,0,0.04)',
        'ios': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'ios-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
        'ios-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        'float': '0 8px 30px rgba(0,0,0,0.12)', // High elevation
      },
      borderRadius: {
        'ios': '10px',      // Standard small elements
        'ios-lg': '14px',   // Cards/Modals
        'ios-xl': '22px',   // Sheets
      },
      animation: {
        'enter': 'enter 0.2s ease-out',
        'leave': 'leave 0.15s ease-in forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        enter: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        leave: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}