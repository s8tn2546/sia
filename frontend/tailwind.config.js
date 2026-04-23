/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Green (Main Brand Color)
        primary: {
          DEFAULT: '#34A853',
          hover: '#2D9147',
        },
        // Soft Green Background
        'soft-green': '#E6F4EA',
        // Accent Green
        'accent-green': '#81C995',
        // Dark Green
        'dark-green': '#1E7A3E',
        // Background Colors
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F8FAF9',
        // Text Colors
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        // Border Color
        border: '#E5E7EB',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'large': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 20px rgba(52, 168, 83, 0.3)',
      },
      fontFamily: {
        sans: ['Google Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Google Sans Display', 'Google Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'headline': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'title': ['1.5rem', { lineHeight: '1.3' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'caption': ['0.875rem', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
}
