/** @type {import('tailwindcss').Config} */
const defaultConfig = require("shadcn/ui/tailwind.config")

module.exports = {
  ...defaultConfig,
  content: [
    ...defaultConfig.content,
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    ...defaultConfig.theme,
    extend: {
      ...defaultConfig.theme.extend,
      colors: {
        ...defaultConfig.theme.extend.colors,
        neon: {
          pink: "#ff99dd", // Sehr hell und knallig
          blue: "#66b3ff", // Hellblau für Text
          lightblue: "#99ccff", // Noch helleres Blau
          green: "#99ff99", // Sehr hell und knallig
          purple: "#cc99ff", // Sehr hell und knallig
          yellow: "#ffff99", // Sehr hell und knallig
          cyan: "#99ffff", // Sehr hell und knallig
          orange: "#ffcc99", // Neue helle Farbe
          lime: "#ccff99", // Neue helle Farbe
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundColor: {
        "light-gray": "#f0f0f0",
        "lighter-gray": "#f8f8f8",
      },
      boxShadow: {
        ...defaultConfig.theme.extend.boxShadow,
        "neon-pink": "0 0 40px #ff99dd, 0 0 80px #ff99dd",
        "neon-blue": "0 0 40px #99ccff, 0 0 80px #99ccff",
        "neon-green": "0 0 40px #99ff99, 0 0 80px #99ff99",
        "neon-purple": "0 0 40px #cc99ff, 0 0 80px #cc99ff",
        "neon-cyan": "0 0 40px #99ffff, 0 0 80px #99ffff",
        "neon-orange": "0 0 40px #ffcc99, 0 0 80px #ffcc99",
      },
    },
  },
  plugins: [...defaultConfig.plugins, require("tailwindcss-animate")],
}
