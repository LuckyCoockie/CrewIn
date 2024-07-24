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
        primary: {
          light: "#2B2F40",
          DEFAULT: "#2B2F40",
          dark: "#2B2F40",
          50: "#F4F4F5",  
          100: "#EAEBEC",
          200: "#D5D5D9",
          300: "#C0C1C6",
          400: "#AAAC83",
          500: "#94969F",
          600: "#80828C",
          700: "#6B6E7A",
          800: "#555966",
          900: "#414454",
          1000: "#2B2F40",
        },
        highlight: {
          light: "#7E251B",
          DEFAULT: "#7E251B",
          dark: "#7E251B",
        }        
      },
      screens: {
        'xs': '450px',
        'sm': '640px',
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
};
