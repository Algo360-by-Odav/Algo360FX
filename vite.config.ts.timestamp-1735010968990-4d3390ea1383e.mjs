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
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false
        },
        "/ws": {
          target: "ws://localhost:5000",
          ws: true,
          secure: false
        }
      }
    },
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
        "@utils": resolve(__dirname, "./src/utils"),
        "@config": resolve(__dirname, "./src/config"),
        "@websocket": resolve(__dirname, "./src/websocket"),
        "@sentry/tracing": resolve(__dirname, "node_modules/@sentry/tracing"),
        "@sentry/react": resolve(__dirname, "node_modules/@sentry/react")
      }
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [
              "react",
              "react-dom",
              "react-router-dom",
              "@mui/material",
              "@mui/icons-material",
              "mobx",
              "mobx-react-lite"
            ]
          },
          assetFileNames: (assetInfo) => {
            let extType = assetInfo.name.split(".").at(1);
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = "img";
            } else if (/woff|woff2/.test(extType)) {
              extType = "fonts";
            }
            return `assets/${extType}/[name]-[hash][extname]`;
          },
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js"
        }
      },
      chunkSizeWarningLimit: 1600
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "@mui/material",
        "@mui/icons-material",
        "mobx",
        "mobx-react-lite"
      ]
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJjOlxcXFxVc2Vyc1xcXFxGVk1ZXFxcXERlc2t0b3BcXFxcQWxnbzM2MEZYXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJjOlxcXFxVc2Vyc1xcXFxGVk1ZXFxcXERlc2t0b3BcXFxcQWxnbzM2MEZYXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9jOi9Vc2Vycy9GVk1ZL0Rlc2t0b3AvQWxnbzM2MEZYL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XG5pbXBvcnQgeyBkaXJuYW1lLCByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5cbmNvbnN0IF9fZmlsZW5hbWUgPSBmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCk7XG5jb25zdCBfX2Rpcm5hbWUgPSBkaXJuYW1lKF9fZmlsZW5hbWUpO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUgfSkgPT4ge1xuICAvLyBMb2FkIGVudiBmaWxlIGJhc2VkIG9uIGBtb2RlYCBpbiB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS5cbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XG4gIFxuICByZXR1cm4ge1xuICAgIGJhc2U6ICcvJyxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHBvcnQ6IDUxNzMsXG4gICAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgJy9hcGknOiB7XG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo1MDAwJyxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgc2VjdXJlOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICAnL3dzJzoge1xuICAgICAgICAgIHRhcmdldDogJ3dzOi8vbG9jYWxob3N0OjUwMDAnLFxuICAgICAgICAgIHdzOiB0cnVlLFxuICAgICAgICAgIHNlY3VyZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgcmVhY3Qoe1xuICAgICAgICBiYWJlbDoge1xuICAgICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAgIFsnQGJhYmVsL3BsdWdpbi1wcm9wb3NhbC1kZWNvcmF0b3JzJywgeyBsZWdhY3k6IHRydWUgfV0sXG4gICAgICAgICAgICBbJ0BiYWJlbC9wbHVnaW4tcHJvcG9zYWwtY2xhc3MtcHJvcGVydGllcycsIHsgbG9vc2U6IHRydWUgfV1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgICAgJ0Bjb21wb25lbnRzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb21wb25lbnRzJyksXG4gICAgICAgICdAcGFnZXMnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3BhZ2VzJyksXG4gICAgICAgICdAc3RvcmVzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9zdG9yZXMnKSxcbiAgICAgICAgJ0B0aGVtZSc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdGhlbWUnKSxcbiAgICAgICAgJ0B1dGlscyc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdXRpbHMnKSxcbiAgICAgICAgJ0Bjb25maWcnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvbmZpZycpLFxuICAgICAgICAnQHdlYnNvY2tldCc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvd2Vic29ja2V0JyksXG4gICAgICAgICdAc2VudHJ5L3RyYWNpbmcnOiByZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy9Ac2VudHJ5L3RyYWNpbmcnKSxcbiAgICAgICAgJ0BzZW50cnkvcmVhY3QnOiByZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy9Ac2VudHJ5L3JlYWN0JylcbiAgICAgIH1cbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBvdXREaXI6ICdkaXN0JyxcbiAgICAgIGFzc2V0c0RpcjogJ2Fzc2V0cycsXG4gICAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgICAgdmVuZG9yOiBbXG4gICAgICAgICAgICAgICdyZWFjdCcsXG4gICAgICAgICAgICAgICdyZWFjdC1kb20nLFxuICAgICAgICAgICAgICAncmVhY3Qtcm91dGVyLWRvbScsXG4gICAgICAgICAgICAgICdAbXVpL21hdGVyaWFsJyxcbiAgICAgICAgICAgICAgJ0BtdWkvaWNvbnMtbWF0ZXJpYWwnLFxuICAgICAgICAgICAgICAnbW9ieCcsXG4gICAgICAgICAgICAgICdtb2J4LXJlYWN0LWxpdGUnXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhc3NldEZpbGVOYW1lczogKGFzc2V0SW5mbykgPT4ge1xuICAgICAgICAgICAgbGV0IGV4dFR5cGUgPSBhc3NldEluZm8ubmFtZS5zcGxpdCgnLicpLmF0KDEpO1xuICAgICAgICAgICAgaWYgKC9wbmd8anBlP2d8c3ZnfGdpZnx0aWZmfGJtcHxpY28vaS50ZXN0KGV4dFR5cGUpKSB7XG4gICAgICAgICAgICAgIGV4dFR5cGUgPSAnaW1nJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoL3dvZmZ8d29mZjIvLnRlc3QoZXh0VHlwZSkpIHtcbiAgICAgICAgICAgICAgZXh0VHlwZSA9ICdmb250cyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYGFzc2V0cy8ke2V4dFR5cGV9L1tuYW1lXS1baGFzaF1bZXh0bmFtZV1gO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDE2MDAsXG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgJ3JlYWN0JyxcbiAgICAgICAgJ3JlYWN0LWRvbScsXG4gICAgICAgICdyZWFjdC1yb3V0ZXItZG9tJyxcbiAgICAgICAgJ0BtdWkvbWF0ZXJpYWwnLFxuICAgICAgICAnQG11aS9pY29ucy1tYXRlcmlhbCcsXG4gICAgICAgICdtb2J4JyxcbiAgICAgICAgJ21vYngtcmVhY3QtbGl0ZSdcbiAgICAgIF1cbiAgICB9XG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVIsU0FBUyxjQUFjLGVBQWU7QUFDL1QsT0FBTyxXQUFXO0FBQ2xCLFNBQVMscUJBQXFCO0FBQzlCLFNBQVMsU0FBUyxlQUFlO0FBSDhJLElBQU0sMkNBQTJDO0FBS2hPLElBQU0sYUFBYSxjQUFjLHdDQUFlO0FBQ2hELElBQU0sWUFBWSxRQUFRLFVBQVU7QUFHcEMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxTQUFTLEtBQUssTUFBTTtBQUVqRCxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFFM0MsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sWUFBWTtBQUFBLE1BQ1osT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFVBQ04sUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxRQUNBLE9BQU87QUFBQSxVQUNMLFFBQVE7QUFBQSxVQUNSLElBQUk7QUFBQSxVQUNKLFFBQVE7QUFBQSxRQUNWO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxRQUNKLE9BQU87QUFBQSxVQUNMLFNBQVM7QUFBQSxZQUNQLENBQUMscUNBQXFDLEVBQUUsUUFBUSxLQUFLLENBQUM7QUFBQSxZQUN0RCxDQUFDLDJDQUEyQyxFQUFFLE9BQU8sS0FBSyxDQUFDO0FBQUEsVUFDN0Q7QUFBQSxRQUNGO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxRQUFRLFdBQVcsT0FBTztBQUFBLFFBQy9CLGVBQWUsUUFBUSxXQUFXLGtCQUFrQjtBQUFBLFFBQ3BELFVBQVUsUUFBUSxXQUFXLGFBQWE7QUFBQSxRQUMxQyxXQUFXLFFBQVEsV0FBVyxjQUFjO0FBQUEsUUFDNUMsVUFBVSxRQUFRLFdBQVcsYUFBYTtBQUFBLFFBQzFDLFVBQVUsUUFBUSxXQUFXLGFBQWE7QUFBQSxRQUMxQyxXQUFXLFFBQVEsV0FBVyxjQUFjO0FBQUEsUUFDNUMsY0FBYyxRQUFRLFdBQVcsaUJBQWlCO0FBQUEsUUFDbEQsbUJBQW1CLFFBQVEsV0FBVyw4QkFBOEI7QUFBQSxRQUNwRSxpQkFBaUIsUUFBUSxXQUFXLDRCQUE0QjtBQUFBLE1BQ2xFO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLE1BQ1IsV0FBVztBQUFBLE1BQ1gsV0FBVztBQUFBLE1BQ1gsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBLFVBQ04sY0FBYztBQUFBLFlBQ1osUUFBUTtBQUFBLGNBQ047QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFVBQ0EsZ0JBQWdCLENBQUMsY0FBYztBQUM3QixnQkFBSSxVQUFVLFVBQVUsS0FBSyxNQUFNLEdBQUcsRUFBRSxHQUFHLENBQUM7QUFDNUMsZ0JBQUksa0NBQWtDLEtBQUssT0FBTyxHQUFHO0FBQ25ELHdCQUFVO0FBQUEsWUFDWixXQUFXLGFBQWEsS0FBSyxPQUFPLEdBQUc7QUFDckMsd0JBQVU7QUFBQSxZQUNaO0FBQ0EsbUJBQU8sVUFBVSxPQUFPO0FBQUEsVUFDMUI7QUFBQSxVQUNBLGdCQUFnQjtBQUFBLFVBQ2hCLGdCQUFnQjtBQUFBLFFBQ2xCO0FBQUEsTUFDRjtBQUFBLE1BQ0EsdUJBQXVCO0FBQUEsSUFDekI7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
