/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0f1117',
          light: '#1a1d27',
          lighter: '#252836',
        },
        accent: {
          emerald: '#34d399',
          cyan: '#22d3ee',
        },
        danger: {
          DEFAULT: '#ef4444',
          subtle: '#7f1d1d',
          border: '#991b1b',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
