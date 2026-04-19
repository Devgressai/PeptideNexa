import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./content/**/*.{md,mdx}"],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", md: "2rem" },
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "hsl(var(--ink))",
          muted: "hsl(var(--ink-muted))",
          subtle: "hsl(var(--ink-subtle))",
        },
        paper: {
          DEFAULT: "hsl(var(--paper))",
          raised: "hsl(var(--paper-raised))",
          sunken: "hsl(var(--paper-sunken))",
        },
        line: "hsl(var(--line))",
        brand: {
          DEFAULT: "hsl(var(--brand))",
          muted: "hsl(var(--brand-muted))",
          contrast: "hsl(var(--brand-contrast))",
        },
        signal: {
          DEFAULT: "hsl(var(--signal))",
          muted: "hsl(var(--signal-muted))",
        },
        danger: "hsl(var(--danger))",
        success: "hsl(var(--success))",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Newsreader", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 5vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 4vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      maxWidth: {
        prose: "68ch",
        readable: "76ch",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11, 18, 32, 0.04), 0 1px 1px rgba(11, 18, 32, 0.03)",
        raised: "0 4px 14px rgba(11, 18, 32, 0.06), 0 2px 4px rgba(11, 18, 32, 0.04)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 250ms ease-out",
      },
    },
  },
  plugins: [animate],
};

export default config;
