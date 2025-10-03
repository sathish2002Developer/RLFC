
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'refex-blue': '#2879b6',
          'refex-green': '#7dc244',
          'refex-orange': '#ee6a31',
          'refex-blue-light': '#4a90c2',
          'refex-blue-dark': '#1e5f8c',
        },
        fontFamily: {
          'montserrat': ['Montserrat', 'sans-serif'],
          'inter': ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }
