/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-space-grotesk)', 'sans-serif'],
      },
      colors: {
        'brand-background': '#0D0C1D',
        'brand-foreground': '#F0F2F5',
        'brand-purple': {
          DEFAULT: '#8A4FFF',
          'light': '#A076F9',
          'dark': '#5A18C9',
          '200': '#E0D6FF',
          '300': '#C6B2FF',
          '400': '#A98DFF',
          '500': '#8A4FFF',
          '600': '#6C1CE8',
          '900': '#1F1A3A'
        },
        'brand-pink': {
          DEFAULT: '#FF6AC1',
          'light': '#FF8BCD',
          'dark': '#D63C9A',
        },
        'brand-blue': {
          DEFAULT: '#00BFFF',
          'light': '#4DD3FF',
          'dark': '#008FBF',
          '900': '#18233A'
        },
        'brand-glass': 'rgba(255, 255, 255, 0.1)',
        'brand-glass-border': 'rgba(255, 255, 255, 0.2)',
      },
      backgroundImage: {
        'gradient-radial-glow': 'radial-gradient(circle at 50% 50%, rgba(120, 119, 198, 0.3), rgba(255, 255, 255, 0))',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
