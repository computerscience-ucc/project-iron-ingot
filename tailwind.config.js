module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    ({ addVariant }) => {
      addVariant('child', '& > *');
    },
  ],
  daisyui: {
    themes: [
      {
        customTheme: {
          ...require('daisyui/src/colors/themes')['[data-theme=luxury]'],
          'neutral-content': '#F0F3F6',
          'base-content': '#F0F3F6',
          primary: '#F3A72D',
          'primary-focus': '#F4B145',
          'primary-content': '#09090B',
        },
      },
    ],
  },
};
