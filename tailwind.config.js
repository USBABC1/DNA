/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Adicionando as cores do novo design
      colors: {
        'brand-dark': '#0D1117', // Fundo principal escuro
        'brand-dark-secondary': '#161B22', // Fundo do "card"
        'brand-green': '#2ECC71', // Verde principal para o botão
        'brand-green-bright': '#39FF14', // Verde brilhante para o visualizador e texto
        'brand-red': '#E74C3C', // Vermelho para o estado de gravação
        'brand-light-text': '#E6EDF3', // Cor do texto principal
        'brand-subtle-text': '#8B949E', // Cor do texto secundário
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
