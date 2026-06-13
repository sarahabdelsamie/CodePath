/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3F51D2',      // Deep purple/blue
          primaryHover: '#2E3EB8', // Darker primary
          accent: '#EF705B',       // Coral/salmon
          accentHover: '#DE5F48',  // Darker coral
          darkBg: '#09252A',       // Dark teal/green for register sidebar
          darkBgEnd: '#04161A',    // Darker gradient end
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
