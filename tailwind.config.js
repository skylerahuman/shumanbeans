/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'kairos': {
          'charcoal': '#121416',
          'gunmetal': '#1F262E',
          'silver': '#C0C5CE',
          'cool-gray': '#8A9199',
          'trust-blue': '#3B82F6',
          'responsible-green': '#22C55E',
          'warm-amber': '#FBBF24',
          'coral-red': '#F87171'
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #3B82F6' },
          '100%': { boxShadow: '0 0 20px #3B82F6, 0 0 30px #3B82F6' }
        }
      }
    }
  },
  plugins: []
}; 