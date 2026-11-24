/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '32px',
        sm: '32px',
        md: '32px',
        lg: '32px',
        xl: '32px',
        '2xl': '32px',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1680px',
      },
    },
    extend: {
      maxWidth: {
        container: '1680px',
        site: '1680px',
      },
      colors: {
        primary: {
          DEFAULT: '#FFE11A',
          hover: '#ebd015',
          light: '#FFF9D2',
        },
        ink: {
          DEFAULT: '#121212',
          soft: '#1F1F1F',
          dark: '#0A0A0A',
        },
        accent: {
          DEFAULT: '#FF5A1F',
          hover: '#E54C14',
        },
        surface: {
          DEFAULT: '#F4F4F4',
          subtle: '#FAFAFA',
          dark: '#181818',
          card: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#6B6B6B',
          light: '#8E8E8E',
          dark: '#4A4A4A',
        },
        border: {
          DEFAULT: '#E5E5E5',
          dark: '#2A2A2A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Kirgina', 'Impact', 'Haettenschweiler', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        normal: '0',
        wide: '0.04em',
        widest: '0.12em',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0, 0, 0, 0.04)',
        card: '0 12px 32px rgba(0, 0, 0, 0.06)',
        lift: '0 20px 40px rgba(0, 0, 0, 0.08)',
        glow: '0 0 24px rgba(255, 225, 26, 0.4)',
      },
    },
  },
  plugins: [],
};