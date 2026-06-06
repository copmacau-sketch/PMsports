import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto'],
        mono: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
      colors: {
        bg:        'rgb(13 17 23)',
        panel:     'rgb(22 27 34)',
        border:    'rgb(48 54 61)',
        muted:     'rgb(125 133 144)',
        accent:    'rgb(99 102 241)',
        positive:  'rgb(74 222 128)',
        negative:  'rgb(248 113 113)',
        warning:   'rgb(250 204 21)',
      },
    },
  },
  plugins: [],
};

export default config;
