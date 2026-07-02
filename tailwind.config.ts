import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // LOW SIGNAL palette - refined from dark but not pure black
        'low': {
          'bg': '#14141f',           // deep charcoal (not pure black)
          'surface': '#1a1a2e',      // slightly lighter for depth
          'charcoal': '#2a2a3e',     // medium charcoal for elements
          'gray': {
            'dark': '#3d3d52',       // dark grey
            'medium': '#5a5a75',     // medium grey
            'light': '#8a8a9e',      // light grey
          },
          'text': '#e8e8ec',         // off-white (very slight blue tint for warmth)
          'text-muted': '#a0a0b0',   // muted text
          'accent-beige': '#7a7063', // deep beige
          'accent-grey': '#6b7280',  // washed grey
        },
      },
      fontFamily: {
        'sans': ['var(--font-inter)', 'sans-serif'],
        'serif': ['var(--font-garamond)', 'serif'],
        'editorial': ['var(--font-garamond)', 'serif'],
      },
      fontSize: {
        'xs': ['11px', { lineHeight: '16px', letterSpacing: '0.05em' }],
        'sm': ['13px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['28px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
        '5xl': ['48px', { lineHeight: '48px' }],
        '6xl': ['64px', { lineHeight: '64px' }],
        '7xl': ['72px', { lineHeight: '72px' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      opacity: {
        '2': '0.02',
        '3': '0.03',
      },
    },
  },
  plugins: [],
};

export default config;
