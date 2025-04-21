
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
        // Palette inspirée du screenshot (Bleu et gris)
        skyblue: "#33C3F0",        // bleu vif
        blue: "#1EAEDB",           // bleu principal
        white: "#FFFFFF",
        gray: "#C8C8C9",           // gris très clair (fond)
        "gray-silver": "#9F9EA1",  // gris pour les contours
        "gray-dark": "#36373b",    // foncé pour le texte
        "main-bg": "#F4F7FB",      // pour le fond général (très clair)
        border: "#E4E4E7",
        // Thème principal (remplace peach, olive, etc)
        primary: {
          DEFAULT: "#1EAEDB",        // bleu principal
          foreground: "#fff"
        },
        secondary: {
          DEFAULT: "#33C3F0",        // bleu clair
          foreground: "#fff"
        },
        muted: {
          DEFAULT: "#F4F7FB",      // gris bleuté fond
          foreground: "#9F9EA1"
        },
        accent: {
          DEFAULT: "#33C3F0",
          foreground: "#fff"
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
