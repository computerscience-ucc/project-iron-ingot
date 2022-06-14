module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        customTheme: {
          ...require('daisyui/src/colors/themes')['[data-theme=luxury]'],
          'neutral-content': '#F0F3F6',
          'base-content': '#F0F3F6',
          primary: '#DCA54C',
          'primary-focus': '#DCA12C',
          'primary-content': '#09090B',
        },
      },
    ],
  },
};
