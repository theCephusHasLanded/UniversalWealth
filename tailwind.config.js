/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sophisticated color palette for Soho House-inspired design
        'navy': {
          DEFAULT: '#0F1A2A',
          50: '#E6EBF0',
          100: '#C1D0E0',
          200: '#7A97B8',
          300: '#455E82',
          400: '#233650',
          500: '#0F1A2A',
          600: '#0B1420',
          700: '#080F17',
          800: '#040A0F',
          900: '#020508',
        },
        'gold': {
          DEFAULT: '#C9A861',
          50: '#F9F5EA',
          100: '#F1E8CA',
          200: '#E5D6A5',
          300: '#D8C280',
          400: '#C9A861',
          500: '#B48F3D',
          600: '#8A6D2F',
          700: '#604B21',
          800: '#362A13',
          900: '#0C0905',
        },
        'neutral': {
          DEFAULT: '#D8D3C8',
          50: '#FFFFFF',
          100: '#F9F8F6',
          200: '#EEEAE3',
          300: '#E3DED6',
          400: '#D8D3C8',
          500: '#BFB7A5',
          600: '#A69B81',
          700: '#8B7F62',
          800: '#6B624B',
          900: '#4A4334',
        },
        'charcoal': {
          DEFAULT: '#2C2C2C',
          50: '#DADADA',
          100: '#AEAEAE',
          200: '#858585',
          300: '#636363',
          400: '#474747',
          500: '#2C2C2C',
          600: '#262626',
          700: '#1F1F1F',
          800: '#191919',
          900: '#0F0F0F',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'serif': ['Cormorant Garamond', 'ui-serif', 'Georgia'],
        'display': ['Montserrat', 'ui-sans-serif', 'system-ui'],
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slow-pulse': 'slowPulse 4s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    // As of Tailwind CSS v3.3, the line-clamp plugin is included by default
  ],
}
