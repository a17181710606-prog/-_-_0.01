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
        bg: '#FAFAF8',
        ink: '#1C1B19',
        'ink-2': '#44423D',
        'ink-3': '#76746E',
        'ink-4': '#9C9A93',
        'ink-5': '#A6A49C',
        'ink-6': '#B6B4AC',
        border: '#E9E8E4',
        'border-2': '#E4E3DE',
        accent: '#2F5AC7',
        'accent-bg': '#EEF2FD',
        'accent-sel': '#D9E2FA',
      },
      fontFamily: {
        sans: ['var(--font-noto)', '-apple-system', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        panel: '14px',
      },
      boxShadow: {
        card: '0 8px 24px rgba(20,20,18,.08)',
        panel: '-20px 0 60px rgba(20,20,18,.18)',
        menu: '0 12px 30px rgba(20,20,18,.16)',
      },
    },
  },
  plugins: [],
}

export default config
