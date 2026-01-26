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
        },
      },
      fontFamily: {
        display: ['Marist', 'Georgia', 'serif'],
        body: ['Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        bubble: '16px',
      },
      maxWidth: {
        bubble: '85%',
      },
    },
  },
  plugins: [],
};
