/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a73e8',
        'primary-hover': '#1765cc',
        secondary: '#f1f3f4',
        'secondary-hover': '#e8eaed',
        'border-main': '#dadce0',
        'text-main': '#202124',
        'text-secondary': '#5f6368',
      }
    },
  },
  plugins: [],
}
