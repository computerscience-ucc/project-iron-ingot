const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'button-color': '#a50000',
        'button-texts-color': '#ffffff',
        'header-color': '#fd0101'
      }
      
    },
  },
  plugins: [],
});
