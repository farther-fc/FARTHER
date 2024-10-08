const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "selector",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1200px",
      "2xl": "1200px",
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "white",
        ring: "hsl(var(--ring))",
        "background-200": "hsl(var(--background-200))",
        "background-300": "hsl(var(--background-300))",
        "background-400": "hsl(var(--background-400))",
        background: "hsl(var(--background-500))",
        "background-600": "hsl(var(--background-600))",
        "background-700": "hsl(var(--background-700))",
        "background-800": "hsl(var(--background-800))",
        "background-900": "hsl(var(--background-900))",
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
        ghost: {
          DEFAULT: "hsl(var(--ghost))",
          light: "hsl(var(--ghost-light))",
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
        link: {
          DEFAULT: "hsl(var(--amber-300))",
          hover: "hsl(var(--amber-200))",
        },
        farcaster: {
          DEFAULT: "#8a63d2",
          hover: "#7c3aed",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      zIndex: {
        "modal-overlay": 100,
        "modal-content": 101,
        toast: 110,
      },
      width: {
        tableButton: "100px",
        tableButtonWide: "150px",
        dropdownTrigger: "var(--radix-dropdown-menu-trigger-width)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

export default config;
