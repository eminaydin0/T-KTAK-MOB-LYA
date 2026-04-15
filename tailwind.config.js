/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        /** Ana metin — Montserrat (soft / şık vitrin) */
        sans: ['"Montserrat"', 'system-ui', 'sans-serif'],
        /** Başlık & fiyat — serif */
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#ffffff',
          soft: '#f9f9f9',
          muted: '#f5f5f5',
        },
        /** Terrakota vurgu (hurst tarzı) */
        cotta: {
          DEFAULT: '#c17a6b',
          light: '#e8d4d0',
          muted: '#d4a59a',
          dark: '#9a5a4e',
        },
        warm: {
          50: '#faf8f5',
          100: '#f3efe8',
          200: '#e8e0d4',
          300: '#d4c9b8',
          400: '#b5a896',
          800: '#3d3429',
          900: '#2a2319',
          950: '#1a1612',
        },
        brand: {
          gold: '#c9a227',
          bronze: '#8b6914',
        },
      },
      maxWidth: {
        /** Vitrin ana içerik — dar, editoryal hizalama */
        site: '72rem',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0,0,0,0.06)',
        card: '0 2px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 28px rgba(0,0,0,0.08)',
      },
      keyframes: {
        'carousel-ken': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
        'carousel-progress': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'carousel-ken': 'carousel-ken 6.5s ease-out forwards',
        'carousel-progress': 'carousel-progress 6.5s linear forwards',
      },
    },
  },
  plugins: [],
}
