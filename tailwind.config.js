const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "button-color": "var(--color-button, #a50000)",
        "nav-color": "var(--color-nav, #ffffff)",
        "button-texts-color": "var(--color-button-text, #ffffff)",
        "header-color": "var(--color-header, #fe4c4c)",
      }

    },
  },
  plugins: [],
});
