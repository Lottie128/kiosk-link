/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stem: {
          light: '#00f2fe',
          dark: '#4facfe',
          accent: '#7b61ff',
        }
      },
      aspectRatio: {
        'kiosk': '9/16',
      }
    },
  },
  plugins: [],
}
