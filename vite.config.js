import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/one-link-portfolio/" : "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        verification: resolve(import.meta.dirname, "verification.html"),
      },
    },
  },
}));
