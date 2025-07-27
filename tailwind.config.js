/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Retro Web 1.0 Color Palette
        'retro': {
          'dark-green': '#003300',
          'matrix-green': '#00FF00',
          'lime-green': '#32CD32',
          'electric-blue': '#0080FF',
          'neon-cyan': '#00FFFF',
          'hot-pink': '#FF1493',
          'bright-yellow': '#FFFF00',
          'orange-red': '#FF4500',
          'purple': '#800080',
          'silver': '#C0C0C0',
          'black': '#000000',
          'white': '#FFFFFF',
          'gray': '#808080',
          'maroon': '#800000'
        },
        // Coffee bean inspired colors
        'coffee': {
          'bean': '#3C2414',
          'roast': '#5D4037',
          'espresso': '#2F1B14',
          'cream': '#F5F5DC',
          'latte': '#D2B48C',
          'dark': '#2D1810',
          'medium': '#6F4E37',
          'light': '#F5E6D3'
        }
      },
      fontFamily: {
        // Monospaced fonts for that retro feel
        'mono': ['Courier New', 'Monaco', 'Lucida Console', 'Liberation Mono', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Courier', 'monospace'],
        'retro': ['Arial', 'Helvetica', 'sans-serif'],
        'system': ['Times New Roman', 'Times', 'serif']
      },
      animation: {
        'marquee': 'marquee 15s linear infinite',
        'marquee-reverse': 'marquee-reverse 15s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'flicker': 'flicker 0.15s infinite linear',
        'scan-lines': 'scan-lines 0.1s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' }
        },
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '0.99',
            filter: 'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 101, 101)) drop-shadow(0 0 1px rgba(252, 211, 77))'
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4',
            filter: 'none'
          }
        },
        'scan-lines': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        'glow-pulse': {
          '0%': { 
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
            filter: 'brightness(1)'
          },
          '100%': { 
            textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
            filter: 'brightness(1.2)'
          }
        }
      },
      backgroundImage: {
        'retro-dots': 'radial-gradient(circle, #00FF00 1px, transparent 1px)',
        'scan-lines': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)',
        'crt-flicker': 'linear-gradient(90deg, transparent 50%, rgba(0, 255, 0, 0.02) 50%)',
        'coffee-texture': 'radial-gradient(circle at 25% 25%, #3C2414 0%, #2F1B14 50%, #5D4037 100%)'
      },
      backdropFilter: {
        'retro': 'contrast(1.2) brightness(1.1) saturate(1.3)'
      }
    }
  },
  plugins: []
};
