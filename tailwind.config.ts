import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        khora: {
          bg: '#090909',
          secondary: '#111111',
          panel: '#151515',
          border: '#292929',
          accent: '#FFD400',
          accentHover: '#FFE45C',
          text: '#F5F5F5',
          muted: '#A3A3A3',
          success: '#36D399',
          error: '#FF4D4F',
          warning: '#FFB020',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;