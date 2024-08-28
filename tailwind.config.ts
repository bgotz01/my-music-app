// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        silver: '#f1f5f9',
        'very-dark-grey': '#0f172a',
        'custom-dark': '#262626',
        productContainerLight: '#f1f5f9',
        productContainerDark: '#171717',
        soundContainerLight: '#f1f5f9',
        soundContainerDark: '#171717',
        buttonBackground: '#262626',
        buttonText: '#ffffff',
        buttonHover: '#3a3a3a',
        light: '#ffffff', // Light mode background color
        dark: '#000000', // Dark mode background color
        
        // Custom gradient colors for h1
        h1GradientStart: '#e5e7eb', // Light gray
        h1GradientMiddle: '#9ca3af', // Medium gray
        h1GradientEnd: '#4b5563', // Dark gray
      },
      textColor: {
        light: '#000000', // Light mode text color
        dark: '#ffffff',  // Dark mode text color
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // Add gradient background for text
        'h1-gradient': 'linear-gradient(to bottom right, #e5e7eb, #9ca3af, #4b5563)',
      },
    },
  },
  darkMode: 'class', // Enable class-based dark mode
  plugins: [],
};

export default config;
