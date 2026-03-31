import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF7',
        surface: '#F0EAE0',
        primary: '#1A1816',
        muted: '#6B6560',
        accent: '#C4B5A0',
        dark: '#2C2420'
      },
      fontFamily: {
        serif: ['var(--font-heading)'],
        sans: ['var(--font-body)']
      }
    }
  },
  plugins: []
};

export default config;
