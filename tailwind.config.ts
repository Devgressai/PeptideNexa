import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./content/**/*.{md,mdx}"],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", md: "2rem" },
      screens: { "2xl": "1240px" },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "hsl(var(--ink))",
          strong: "hsl(var(--ink-strong))",
          muted: "hsl(var(--ink-muted))",
          subtle: "hsl(var(--ink-subtle))",
          faint: "hsl(var(--ink-faint))",
          inverse: "hsl(var(--ink-inverse))",
        },
        paper: {
          DEFAULT: "hsl(var(--paper))",
          raised: "hsl(var(--paper-raised))",
          sunken: "hsl(var(--paper-sunken))",
          inverse: "hsl(var(--paper-inverse))",
        },
        line: {
          DEFAULT: "hsl(var(--line))",
          strong: "hsl(var(--line-strong))",
          inverse: "hsl(var(--line-inverse))",
        },
        brand: {
          DEFAULT: "hsl(var(--brand))",
          deep: "hsl(var(--brand-deep))",
          soft: "hsl(var(--brand-soft))",
          muted: "hsl(var(--brand-muted))",
          contrast: "hsl(var(--brand-contrast))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          soft: "hsl(var(--accent-soft))",
        },
        signal: {
          DEFAULT: "hsl(var(--signal))",
          muted: "hsl(var(--signal-muted))",
          soft: "hsl(var(--signal-soft))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        danger: "hsl(var(--danger))",
        info: "hsl(var(--info))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Newsreader", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 5vw, 4.75rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        "display-lg": ["clamp(2.25rem, 3.6vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.75rem, 2.4vw, 2.25rem)", { lineHeight: "1.12", letterSpacing: "-0.015em" }],
        lede: ["1.125rem", { lineHeight: "1.55", letterSpacing: "-0.005em" }],
        meta: ["0.8125rem", { lineHeight: "1.4" }],
      },
      letterSpacing: {
        label: "0.14em",
      },
      maxWidth: {
        prose: "42rem",
        tight: "56rem",
        wide: "86rem",
        readable: "76ch",
      },
      boxShadow: {
        e1: "var(--shadow-1)",
        e2: "var(--shadow-2)",
        e3: "var(--shadow-3)",
        e4: "var(--shadow-4)",
        "inset-hair": "var(--shadow-inset)",
        // back-compat aliases
        card: "var(--shadow-1)",
        raised: "var(--shadow-2)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
        emphasized: "var(--ease-emphasized)",
      },
      transitionDuration: {
        xs: "var(--dur-xs)",
        sm: "var(--dur-sm)",
        md: "var(--dur-md)",
        lg: "var(--dur-lg)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 260ms var(--ease-standard)",
      },
    },
  },
  plugins: [animate],
};

export default config;
