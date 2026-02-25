import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src/", import.meta.url)),
    },
  },
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["vue", "vue-router", "pinia", "axios"],
          charts: ["chart.js", "vue-chartjs"],
          utils: ["lodash", "html2canvas", "jspdf"],
        },
      },
    },
  },
});
