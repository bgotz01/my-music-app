// tailwind.config.js
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
      },
      
      textColor: {
        light: '#000000', // Light mode text color
        dark: '#ffffff',  // Dark mode text color
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      
    },
  },
  darkMode: 'class', // Add this line to enable class-based dark mode
  plugins: [],
};

export default config;
