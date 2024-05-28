/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#703903',
        primaryDark: ' #481B01',
        primaryLight: '#A1794F',
        primary200: '#D7C5B4',
        accent: '#FC4300'
      }
    },
  },
  plugins: [],
  prefix: 'tw-',
  corePlugins: {
    preflight: false
  }
}

