/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}', './example/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        nim: {
          orange: '#FF6D00',
          cream: '#F1EDE7',
          blue: '#9BC1F3',
          black: '#231F18',
          brown: '#492610',
          green: '#188A31',
          grey: '#736C64',
          beige: '#9E8C78',
          'light-beige': '#ABA89F',
        },
      },
      fontFamily: {
        display: ['ABC Marist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        body: ['Helvetica Monospaced Pro', 'SF Mono', 'Monaco', 'Courier New', 'monospace'],
        mono: ['Helvetica Monospaced Pro', 'SF Mono', 'Monaco', 'Courier New', 'monospace'],
      },
      borderRadius: {
        bubble: '16px',
      },
      maxWidth: {
        bubble: '85%',
      },
      letterSpacing: {
        wide: '0.6px',
      },
    },
  },
  plugins: [],
};
