
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
      },
      colors: {
        // Palette inspirée du zellige marocain
        royalblue: "#1A4B94",     // bleu profond
        skyblue: "#4B9CD3",      // bleu ciel
        navy: "#16325C",         // bleu marine foncé
        gold: "#D4AF37",         // doré
        cream: "#F5F2E3",        // crème
        terracotta: "#A0522D",   // terre cuite
        white: "#FFFFFF",
        gray: "#C8C8C9",           
        "gray-silver": "#9F9EA1",  
        "gray-dark": "#36373b",    
        "main-bg": "#F4F7FB",      // fond général
        border: "#E4E4E7",
        // Thème principal
        primary: {
          DEFAULT: "#4B9CD3",      // bleu ciel
          foreground: "#fff"
        },
        secondary: {
          DEFAULT: "#1A4B94",      // bleu profond
          foreground: "#fff"
        },
        muted: {
          DEFAULT: "#F4F7FB",      
          foreground: "#9F9EA1"
        },
        accent: {
          DEFAULT: "#D4AF37",      // doré
          foreground: "#16325C"    // contraste avec bleu foncé
        },
        card: {
          DEFAULT: "#fff",
          foreground: "#36373b"
        },
      },
      borderRadius: {
        lg: "1.1rem",
        md: "0.85rem",
        sm: "0.5rem"
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
