import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'terminal': {
          'green': '#00ff00',
          'green-dark': '#00cc00',
          'green-muted': '#008800',
          'amber': '#ffaa00',
          'red': '#ff0000',
          'yellow': '#ffff00',
          'cyan': '#00ffff',
          'bg': '#000000',
          'bg-alt': '#0a0a0a',
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'blink': 'blink 1s infinite',
        'scanline': 'scanline 8s linear infinite',
        'matrix-rain': 'matrix-rain 20s linear infinite',
        'terminal-scan': 'terminal-scan 3s linear infinite',
        'glitch': 'glitch 2s infinite',
        'fadeIn': 'fadeIn 0.5s ease-in',
      },
    },
  },
  plugins: [],
};
export default config;
