/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-inter)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
        surface: {
          900: '#080A0C',
          800: '#0D1117',
          700: '#161B22',
          600: '#1C2128',
          500: '#21262D',
        },
        red: {
          500: '#F85149',
        },
        green: {
          400: '#3FB950',
        }
      },
    },
  },
  plugins: [],
}
