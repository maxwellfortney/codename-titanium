/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx,jsx}"],
  theme: {
    extend: {
      colors: {
        "primary": "#05040a",
        "secondary": "#26262e",
        "primary-border": "#34323b",
        "primary-text": "#ffffff",
        "secondary-text": "#9D9D9E",
        "primary-shimmer": "#2B2A31",
        "secondary-shimmer": "#41404870",
        "error": "#F5424F",
        "success": "#15e166"
      },
      animation: {
        "scale-and-fade-in": `fade-in 400ms, scale-in 400ms`,
        'fade-in': 'fade-in 200ms ease-in-out',
        'scale-in': 'scale-in 400ms ease-in-out',
        'shake': 'shake 400ms ease-in-out',
      },
      keyframes: {
        "scale-in": {
          '0%': { transform: 'scale(80%)' },
          '100%': { transform: 'scale(100%)' },
        },
        "fade-in": {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        }
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
