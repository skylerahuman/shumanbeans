/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"Courier New"', 'monospace']
      },
      colors: {
        coffee: {
          50: '#FAF7F0',
          100: '#F5E6D3',
          200: '#E8D5B8',
          300: '#D4B896',
          400: '#C19A73',
          500: '#A67C52',
          600: '#8B5D3B',
          700: '#6F4E37',
          800: '#5D4037',
          900: '#3C2414',
          950: '#2D1B10'
        },
        cream: {
          50: '#FEFCF8',
          100: '#FCF7EE',
          200: '#F7EDD5',
          300: '#F0DDB5',
          400: '#E6C896',
          500: '#DAB474',
          600: '#C69C56',
          700: '#9B7B44',
          800: '#7A6139',
          900: '#5C4932'
        },
        sepia: {
          100: '#F4F0E8',
          200: '#E8DFD0',
          300: '#D9C9B0',
          400: '#C7B08A',
          500: '#B5946D',
          600: '#9E7C57',
          700: '#7D6245',
          800: '#604C37',
          900: '#463629'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'grain': 'grain 8s steps(10) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' }
        }
      },
      backgroundImage: {
        'paper-grain': "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='17' cy='17' r='1'/%3E%3Ccircle cx='37' cy='17' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='17' cy='37' r='1'/%3E%3Ccircle cx='37' cy='37' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
