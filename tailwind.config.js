/** @type {import('tailwindcss').Config} */

// Tailwind existe SOLO para el website público (src/website). El sistema de
// gestión sigue con su CSS plano de src/styles y no debe verse afectado:
//   - `content` apunta únicamente a src/website, así no se generan utilidades
//     para clases que aparezcan en el resto de la app.
//   - `important: '.enerlogic-site'` antepone ese selector a cada utilidad, de
//     modo que sólo aplican dentro del contenedor raíz del website.
//   - `preflight` va apagado: el reset global de Tailwind pisaría botones,
//     títulos y listas del sistema. El website trae su propio reset acotado
//     en src/website/website.css.
module.exports = {
  content: ["./src/website/**/*.{js,jsx}"],
  important: ".enerlogic-site",
  corePlugins: {
    preflight: false,
    // `container` es el único core plugin al que `important` no le antepone el
    // selector; se define a mano y acotado en website.css.
    container: false,
  },
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        solar: {
          light: "#fef3c7",
          DEFAULT: "#fbbf24",
          dark: "#d97706",
        },
        enerlogic: {
          DEFAULT: "#047857",
          soft: "#ecfdf5",
          dark: "#065f46",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.18)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
