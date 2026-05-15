import type { Config } from "tailwindcss";

// Tailwind v4: most configuration lives in globals.css @theme block.
// This file is kept for any plugin or content path overrides.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
};

export default config;
