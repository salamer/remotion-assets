import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: { outDir: "dist/workbench", rollupOptions: { input: "index.html" } },
  server: { port: 5173 },
  resolve: { dedupe: ["react", "react-dom"] },
});
