// vite.config.ts
import path from "path";
import react from "file:///Users/garga4/Desktop/MUGithub/Enigma/enigma-lander/node_modules/.pnpm/@vitejs+plugin-react@4.3.4_vite@5.4.14_@types+node@20.17.24_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import vercel from "file:///Users/garga4/Desktop/MUGithub/Enigma/enigma-lander/node_modules/.pnpm/vite-plugin-vercel@9.0.5_rollup@4.36.0_vite@5.4.14_@types+node@20.17.24_/node_modules/vite-plugin-vercel/dist/index.js";
import { defineConfig } from "file:///Users/garga4/Desktop/MUGithub/Enigma/enigma-lander/node_modules/.pnpm/vite@5.4.14_@types+node@20.17.24/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "/Users/garga4/Desktop/MUGithub/Enigma/enigma-lander";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    vercel({
      enableDevFunctions: true,
      // Add this to tell vite-plugin-vercel how to handle your API routes
      functionDirectory: "api",
      expiration: 60
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  server: {
    proxy: {
      // Proxy API requests to avoid the loader issue with email parameters
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path2) => path2,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ["@vercel/node"]
    // Exclude Vercel Node types from optimization
  },
  build: {
    rollupOptions: {
      // Exclude API routes from client build - using a more specific pattern
      external: [/^api\/.+\.ts$/]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZ2FyZ2E0L0Rlc2t0b3AvTVVHaXRodWIvRW5pZ21hL2VuaWdtYS1sYW5kZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9nYXJnYTQvRGVza3RvcC9NVUdpdGh1Yi9FbmlnbWEvZW5pZ21hLWxhbmRlci92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZ2FyZ2E0L0Rlc2t0b3AvTVVHaXRodWIvRW5pZ21hL2VuaWdtYS1sYW5kZXIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHZlcmNlbCBmcm9tIFwidml0ZS1wbHVnaW4tdmVyY2VsXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgdmVyY2VsKHtcbiAgICAgIGVuYWJsZURldkZ1bmN0aW9uczogdHJ1ZSxcbiAgICAgIC8vIEFkZCB0aGlzIHRvIHRlbGwgdml0ZS1wbHVnaW4tdmVyY2VsIGhvdyB0byBoYW5kbGUgeW91ciBBUEkgcm91dGVzXG4gICAgICBmdW5jdGlvbkRpcmVjdG9yeTogXCJhcGlcIixcbiAgICAgIGV4cGlyYXRpb246IDYwLFxuICAgIH0pLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHByb3h5OiB7XG4gICAgICAvLyBQcm94eSBBUEkgcmVxdWVzdHMgdG8gYXZvaWQgdGhlIGxvYWRlciBpc3N1ZSB3aXRoIGVtYWlsIHBhcmFtZXRlcnNcbiAgICAgIFwiL2FwaVwiOiB7XG4gICAgICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIixcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aCxcbiAgICAgICAgY29uZmlndXJlOiAocHJveHksIF9vcHRpb25zKSA9PiB7XG4gICAgICAgICAgcHJveHkub24oXCJlcnJvclwiLCAoZXJyLCBfcmVxLCBfcmVzKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInByb3h5IGVycm9yXCIsIGVycik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFtcIkB2ZXJjZWwvbm9kZVwiXSwgLy8gRXhjbHVkZSBWZXJjZWwgTm9kZSB0eXBlcyBmcm9tIG9wdGltaXphdGlvblxuICB9LFxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIC8vIEV4Y2x1ZGUgQVBJIHJvdXRlcyBmcm9tIGNsaWVudCBidWlsZCAtIHVzaW5nIGEgbW9yZSBzcGVjaWZpYyBwYXR0ZXJuXG4gICAgICBleHRlcm5hbDogWy9eYXBpXFwvLitcXC50cyQvXSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJVLE9BQU8sVUFBVTtBQUM1VixPQUFPLFdBQVc7QUFDbEIsT0FBTyxZQUFZO0FBQ25CLFNBQVMsb0JBQW9CO0FBSDdCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLG9CQUFvQjtBQUFBO0FBQUEsTUFFcEIsbUJBQW1CO0FBQUEsTUFDbkIsWUFBWTtBQUFBLElBQ2QsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQTtBQUFBLE1BRUwsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDQSxVQUFTQTtBQUFBLFFBQ25CLFdBQVcsQ0FBQyxPQUFPLGFBQWE7QUFDOUIsZ0JBQU0sR0FBRyxTQUFTLENBQUMsS0FBSyxNQUFNLFNBQVM7QUFDckMsb0JBQVEsSUFBSSxlQUFlLEdBQUc7QUFBQSxVQUNoQyxDQUFDO0FBQUEsUUFDSDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQTtBQUFBLEVBQzFCO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUE7QUFBQSxNQUViLFVBQVUsQ0FBQyxlQUFlO0FBQUEsSUFDNUI7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
