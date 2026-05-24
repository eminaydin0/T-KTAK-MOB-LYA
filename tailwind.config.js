/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', 'system-ui', 'Segoe UI', 'sans-serif'],
        display: ['"Source Sans 3"', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        ink: '#2a2a2a',
        line: '#ebebeb',
        surface: {
          DEFAULT: '#ffffff',
          soft: '#fafaf9',
          muted: '#f4f4f3',
        },
        cotta: {
          DEFAULT: '#b87263',
          light: '#f0e6e3',
          muted: '#d4a59a',
          dark: '#8f5a4e',
        },
      },
      maxWidth: {
        site: '76rem',
      },
      borderRadius: {
        site: '1rem',
        'site-lg': '1.25rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0, 0, 0, 0.04)',
        card: '0 4px 24px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 12px 40px rgba(0, 0, 0, 0.08)',
        lift: '0 8px 30px rgba(0, 0, 0, 0.07)',
      },
      transitionDuration: {
        site: '280ms',
      },
      transitionTimingFunction: {
        site: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'carousel-progress': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        'site-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'site-spin': {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'carousel-progress': 'carousel-progress 7s linear forwards',
        'site-fade-in': 'site-fade-in 0.5s ease-site ease-out both',
        'site-spin': 'site-spin 0.7s linear infinite',
      },
    },
  },
  plugins: [],
}
