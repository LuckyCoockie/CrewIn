const flowbite = require("flowbite-react/tailwind");
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    flowbite.content(),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Roboto",
          "system-ui",
          "Avenir",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        background: {
          DEFAULT: "var(--background)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          50: "var(--primary-50)",  
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
          1000: "var(--primary-1000)",
        },
        disable: {
          DEFAULT: "var(--disable)"
        },
        highlight: {
          DEFAULT: "var(--highlight)",
        },
        reverse: {
          DEFAULT: "var(--reverse)"
        }
      },
      screens: {
        'xs': '450px',
        'sm': '500px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
  },
  plugins: [
    flowbite.plugin(),
    require("@tailwindcss/aspect-ratio"),
    require("flowbite/plugin"),
  ],
  darkMode: " "
};
