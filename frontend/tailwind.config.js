/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#142019',
        forest: {
          50: '#EAF2EC',
          100: '#CFE3D6',
          400: '#2F9E68',
          600: '#1F4D3A',
          700: '#16302A',
          900: '#0D1F1A'
        },
        sand: '#F4F6F4',
        coral: '#D1495B',
        amber: '#E0A030'
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace']
      }
    }
  },
  plugins: []
};
