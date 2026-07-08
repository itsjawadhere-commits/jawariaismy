import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'site-bg': '#030303',
        'site-text': '#f5f5f5',
        'gold': '#cfaa6e',
      },
      fontFamily: {
        'cormorant': ['"Cormorant Garamond"', 'serif'],
        'mono-space': ['"Space Mono"', 'monospace'],
        'urdu': ['"Noto Nastaliq Urdu"', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
