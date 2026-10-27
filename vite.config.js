import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    // Tailwind v4: "@import \"tailwindcss\"" is processed natively by Vite.
    // The "@theme static" block wires colours; "@apply" resolves them.
    // No PostCSS or plugin config required.
  },
});
