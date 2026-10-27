import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      css: {
        // Tailwind v4 uses postcss for parsing; provide it here so
        // @theme static and @apply rules resolve correctly.
        plugins: [tailwindcss, autoprefixer],
      },
    },
  },
});
