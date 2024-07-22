module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
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
        },
        highlight: {
          light: "#7E251B",
          DEFAULT: "#7E251B",
          dark: "#7E251B",
        }        
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
