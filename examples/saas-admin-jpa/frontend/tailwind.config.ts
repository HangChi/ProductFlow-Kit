import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "#d6d9e0",
        ink: "#111827",
        muted: "#64748b",
        panel: "#ffffff",
        surface: "#f7f7f2",
        accent: "#0f766e",
        gold: "#b7791f",
        danger: "#b91c1c",
      },
      boxShadow: {
        soft: "0 14px 40px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
