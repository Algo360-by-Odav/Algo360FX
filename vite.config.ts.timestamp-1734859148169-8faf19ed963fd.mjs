// vite.config.ts
import { defineConfig, loadEnv } from "file:///C:/Users/FVMY/Desktop/Algo360FX/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/FVMY/Desktop/Algo360FX/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
var __vite_injected_original_import_meta_url = "file:///c:/Users/FVMY/Desktop/Algo360FX/vite.config.ts";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: "/",
    plugins: [
      react({
        babel: {
          plugins: [
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            ["@babel/plugin-proposal-class-properties", { loose: true }]
          ]
        }
      })
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "@components": resolve(__dirname, "./src/components"),
        "@pages": resolve(__dirname, "./src/pages"),
        "@stores": resolve(__dirname, "./src/stores"),
        "@theme": resolve(__dirname, "./src/theme"),
        "@utils": resolve(__dirname, "./src/utils")
      }
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: true,
      minify: "terser",
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            mui: ["@mui/material", "@mui/icons-material"],
            charts: ["lightweight-charts", "recharts"]
          }
        }
      }
    },
    server: {
      port: 5173,
      host: true,
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false
        },
        "/ws": {
          target: "ws://localhost:5000",
          ws: true
        }
      }
    },
    preview: {
      port: 5173,
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false
        },
        "/ws": {
          target: "ws://localhost:5000",
          ws: true
        }
      }
    },
    define: {
      __API_URL__: JSON.stringify(env.VITE_API_URL || "http://localhost:5000/api"),
      __WS_URL__: JSON.stringify(env.VITE_WS_URL || "ws://localhost:5000/ws")
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJjOlxcXFxVc2Vyc1xcXFxGVk1ZXFxcXERlc2t0b3BcXFxcQWxnbzM2MEZYXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJjOlxcXFxVc2Vyc1xcXFxGVk1ZXFxcXERlc2t0b3BcXFxcQWxnbzM2MEZYXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9jOi9Vc2Vycy9GVk1ZL0Rlc2t0b3AvQWxnbzM2MEZYL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XG5pbXBvcnQgeyBkaXJuYW1lLCByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5cbmNvbnN0IF9fZmlsZW5hbWUgPSBmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCk7XG5jb25zdCBfX2Rpcm5hbWUgPSBkaXJuYW1lKF9fZmlsZW5hbWUpO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUgfSkgPT4ge1xuICAvLyBMb2FkIGVudiBmaWxlIGJhc2VkIG9uIGBtb2RlYCBpbiB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS5cbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XG4gIFxuICByZXR1cm4ge1xuICAgIGJhc2U6ICcvJyxcbiAgICBwbHVnaW5zOiBbXG4gICAgICByZWFjdCh7XG4gICAgICAgIGJhYmVsOiB7XG4gICAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgWydAYmFiZWwvcGx1Z2luLXByb3Bvc2FsLWRlY29yYXRvcnMnLCB7IGxlZ2FjeTogdHJ1ZSB9XSxcbiAgICAgICAgICAgIFsnQGJhYmVsL3BsdWdpbi1wcm9wb3NhbC1jbGFzcy1wcm9wZXJ0aWVzJywgeyBsb29zZTogdHJ1ZSB9XVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICBdLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgICAnQGNvbXBvbmVudHMnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvbXBvbmVudHMnKSxcbiAgICAgICAgJ0BwYWdlcyc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvcGFnZXMnKSxcbiAgICAgICAgJ0BzdG9yZXMnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3N0b3JlcycpLFxuICAgICAgICAnQHRoZW1lJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy90aGVtZScpLFxuICAgICAgICAnQHV0aWxzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy91dGlscycpXG4gICAgICB9XG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgICBhc3NldHNEaXI6ICdhc3NldHMnLFxuICAgICAgc291cmNlbWFwOiB0cnVlLFxuICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgICB2ZW5kb3I6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICAgIG11aTogWydAbXVpL21hdGVyaWFsJywgJ0BtdWkvaWNvbnMtbWF0ZXJpYWwnXSxcbiAgICAgICAgICAgIGNoYXJ0czogWydsaWdodHdlaWdodC1jaGFydHMnLCAncmVjaGFydHMnXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiA1MTczLFxuICAgICAgaG9zdDogdHJ1ZSxcbiAgICAgIHByb3h5OiB7XG4gICAgICAgICcvYXBpJzoge1xuICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTAwMCcsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHNlY3VyZTogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgJy93cyc6IHtcbiAgICAgICAgICB0YXJnZXQ6ICd3czovL2xvY2FsaG9zdDo1MDAwJyxcbiAgICAgICAgICB3czogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBwcmV2aWV3OiB7XG4gICAgICBwb3J0OiA1MTczLFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgJy9hcGknOiB7XG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo1MDAwJyxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgc2VjdXJlOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICAnL3dzJzoge1xuICAgICAgICAgIHRhcmdldDogJ3dzOi8vbG9jYWxob3N0OjUwMDAnLFxuICAgICAgICAgIHdzOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGRlZmluZToge1xuICAgICAgX19BUElfVVJMX186IEpTT04uc3RyaW5naWZ5KGVudi5WSVRFX0FQSV9VUkwgfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6NTAwMC9hcGknKSxcbiAgICAgIF9fV1NfVVJMX186IEpTT04uc3RyaW5naWZ5KGVudi5WSVRFX1dTX1VSTCB8fCAnd3M6Ly9sb2NhbGhvc3Q6NTAwMC93cycpXG4gICAgfVxu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
