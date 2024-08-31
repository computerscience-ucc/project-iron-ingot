const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'button-color': '#ef233c',
        'button-texts-color': '#ffffff',
        'header-color': 'red'
      }
      
    },
  },
  plugins: [],
});
