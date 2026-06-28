import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "#d8dee9",
        ink: "#18212f",
        muted: "#687386",
        panel: "#ffffff",
        surface: "#f5f7fb",
        surfaceStrong: "#eef2f8",
        accent: "#2563eb",
        accentSoft: "#dbeafe",
        success: "#16875b",
        warning: "#b26a00",
        danger: "#c2414b",
      },
      boxShadow: {
        soft: "0 12px 30px rgba(24, 33, 47, 0.08)",
        focus: "0 0 0 4px rgba(37, 99, 235, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;
