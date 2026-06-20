import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', 'system-ui', 'Segoe UI', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        ink: '#3a3836',
        line: '#e8e4df',
        surface: {
          DEFAULT: '#ffffff',
          soft: '#faf8f5',
          muted: '#f3f0eb',
        },
        cotta: {
          DEFAULT: '#a67b6f',
          light: '#f5ebe7',
          muted: '#c9a99e',
          dark: '#7d5c52',
        },
      },
      maxWidth: {
        site: '72rem',
      },
      borderRadius: {
        site: '0.875rem',
        'site-lg': '1.125rem',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(58, 56, 54, 0.04)',
        card: '0 8px 32px rgba(58, 56, 54, 0.06)',
        'card-hover': '0 12px 40px rgba(58, 56, 54, 0.08)',
        lift: '0 8px 30px rgba(58, 56, 54, 0.07)',
      },
      transitionDuration: {
        site: '480ms',
        soft: '720ms',
      },
      transitionTimingFunction: {
        site: 'cubic-bezier(0.22, 1, 0.36, 1)',
        soft: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'carousel-progress': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        'site-fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'site-spin': {
          to: { transform: 'rotate(360deg)' },
        },
        'home-ken-burns': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.015)' },
        },
        'home-cinema-zoom': {
          '0%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1.12)' },
        },
        'home-scroll-pulse': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.7' },
        },
        'home-marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'home-marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'carousel-progress': 'carousel-progress 7s linear forwards',
        'site-fade-in': 'site-fade-in 1.1s cubic-bezier(0.22, 1, 0.36, 1) both',
        'site-spin': 'site-spin 0.9s linear infinite',
        'home-ken-burns': 'home-ken-burns 18s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'home-cinema-zoom': 'home-cinema-zoom var(--cinema-zoom-duration, 7s) cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'home-scroll-pulse': 'home-scroll-pulse 4.5s cubic-bezier(0.45, 0, 0.55, 1) infinite',
        'home-marquee': 'home-marquee 60s linear infinite',
        'home-marquee-reverse': 'home-marquee-reverse 75s linear infinite',
      },
    },
  },
  plugins: [typography],
}
