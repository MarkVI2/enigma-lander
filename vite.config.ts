import path from "path";
import react from "@vitejs/plugin-react";
import vercel from "vite-plugin-vercel";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vercel({
      enableDevFunctions: true,
      // Add this to tell vite-plugin-vercel how to handle your API routes
      functionDirectory: "api",
      expiration: 60,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
  optimizeDeps: {
    exclude: ["@vercel/node"], // Exclude Vercel Node types from optimization
  },
  build: {
    rollupOptions: {
      // Exclude API routes from client build - using a more specific pattern
      external: [/^api\/.+\.ts$/],
    },
  },
});
