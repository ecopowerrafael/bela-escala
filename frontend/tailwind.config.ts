import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        piano: "#0A0A0A",
        platinum: "#E0E0E0",
        goldStart: "#D4AF37",
        goldEnd: "#F2D47E"
      },
      backgroundImage: {
        gold: "linear-gradient(135deg, #D4AF37 0%, #F2D47E 100%)",
        glass: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))"
      },
      boxShadow: {
        glow: "0 0 25px rgba(212,175,55,0.35)",
        glass: "0 10px 40px rgba(0,0,0,0.45)"
      },
      borderRadius: {
        xl2: "1.4rem"
      }
    }
  },
  plugins: []
} satisfies Config;
