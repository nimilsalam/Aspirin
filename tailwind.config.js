/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Calm, clinical, Google-Health-like palette
        brand: {
          50: '#e6f5f1',
          100: '#c2e8df',
          500: '#0b8a6f',
          600: '#097a62',
          700: '#066a54',
        },
        risk: {
          low: '#1a9d6b',
          moderate: '#e8a33d',
          high: '#e05a4d',
        },
        ink: {
          DEFAULT: '#1d2b27',
          soft: '#5a6b66',
          faint: '#8a9690',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f6f8f7',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans"', '"Noto Sans Malayalam"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        card: '0 1px 3px rgba(16, 40, 34, 0.06), 0 1px 2px rgba(16, 40, 34, 0.04)',
      },
    },
  },
  plugins: [],
};
