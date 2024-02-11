const withMT = require('@material-tailwind/react/utils/withMT');
const { addDynamicIconSelectors } = require('@iconify/tailwind');

module.exports = withMT({
  mode: 'jit',
  content: [
    './src/**/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom-purple':
          '0 10px 110px 10px rgba(148, 111, 242, 0.25), inset 0 0px 40px 2px rgba(184, 158, 222,255)',
      },
      backgroundImage: {
        'custom-gradient':
          'radial-gradient(ellipse at center, rgba(47,40,91,255) 0%, rgba(138, 92, 255, 0.3) 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      container: {
        center: true,
        padding: '1rem',
      },
      colors: {
        'light-purple': 'rgba(138, 92, 255, 0.5)',
        'lighter-purple': 'rgba(138, 92, 255, 1)',
        'text-primary': '#a3a3a3',
        'text-dark': '#525252',
        'text-light': '#d4d4d4',
        'browser-background': '#1f2020',
        'browser-light': '#3c3c3c',
        'browser-finder': '#282828',
      },
    },
  },
  plugins: [addDynamicIconSelectors()],
});
