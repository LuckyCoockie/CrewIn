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
        },
      },
    },
  },
  plugins: [
    flowbite.plugin(),
    require("@tailwindcss/aspect-ratio"),
    require("flowbite/plugin"),
  ],
};
