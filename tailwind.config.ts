import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand ────────────────────────────────────────
        primary:   '#7C3AED',
        'primary-light': '#8B5CF6',
        'primary-dark':  '#4C1D95',
        secondary: '#06B6D4',
        'secondary-light': '#22D3EE',
        'secondary-dark':  '#0891B2',
        accent:    '#A855F7',

        // ── Semantic ──────────────────────────────────────
        success: '#10B981',
        warning: '#F59E0B',
        error:   '#EF4444',

        // ── Neutral scale ─────────────────────────────────
        n900: '#0A0A0A',
        n800: '#111111',
        n700: '#1C1C1E',
        n600: '#2A2A2E',
        n500: '#3A3A40',
        n400: '#52525B',
        n300: '#71717A',
        n200: '#A1A1AA',
        n100: '#F4F4F5',
      },
      fontFamily: {
        sans:    ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-geist-mono)', 'monospace'],
        display: ['var(--font-geist-sans)', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['clamp(2.5rem,6vw,4rem)',    { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '600' }],
        'display':    ['clamp(2rem,4.5vw,3rem)',     { lineHeight: '1.1',  letterSpacing: '-0.03em', fontWeight: '600' }],
        'h1':         ['clamp(1.75rem,3.5vw,2.25rem)', { lineHeight: '1.2',  letterSpacing: '-0.025em', fontWeight: '600' }],
        'h2':         ['clamp(1.25rem,2.5vw,1.5rem)', { lineHeight: '1.3',  letterSpacing: '-0.02em',  fontWeight: '600' }],
        'h3':         ['1.125rem',                   { lineHeight: '1.4',  letterSpacing: '-0.01em',  fontWeight: '500' }],
        'body-lg':    ['1.0625rem',                  { lineHeight: '1.7',  letterSpacing: '0' }],
        'body':       ['0.9375rem',                  { lineHeight: '1.6',  letterSpacing: '0' }],
        'sm':         ['0.875rem',                   { lineHeight: '1.5',  letterSpacing: '0' }],
        'caption':    ['0.75rem',                    { lineHeight: '1.4',  letterSpacing: '0.01em' }],
        'label':      ['0.6875rem',                  { lineHeight: '1',    letterSpacing: '0.08em' }],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #7C3AED, #4C1D95)',
        'gradient-glow':  'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-primary':   '0 0 32px rgba(124,58,237,0.25)',
        'glow-secondary': '0 0 24px rgba(6,182,212,0.2)',
        'glow-sm':        '0 0 16px rgba(124,58,237,0.15)',
        'card':           '0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
