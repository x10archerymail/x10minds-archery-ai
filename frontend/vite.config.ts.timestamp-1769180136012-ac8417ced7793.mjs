// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/X10Minds%20AI/node_modules/vite/dist/node/index.js";
import react from "file:///D:/X10Minds%20AI/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY for the Gemini SDK
      "process.env.API_KEY": JSON.stringify(env.API_KEY || process.env.API_KEY)
    },
    server: {
      port: 3e3
    },
    base: "./",
    build: {
      outDir: "dist"
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxYMTBNaW5kcyBBSVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcWDEwTWluZHMgQUlcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1gxME1pbmRzJTIwQUkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IHJlc29sdmUgYXMgcGF0aFJlc29sdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCAocHJvY2VzcyBhcyBhbnkpLmN3ZCgpLCAnJyk7XG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW3JlYWN0KCldLFxuICAgIGRlZmluZToge1xuICAgICAgLy8gUG9seWZpbGwgcHJvY2Vzcy5lbnYuQVBJX0tFWSBmb3IgdGhlIEdlbWluaSBTREtcbiAgICAgICdwcm9jZXNzLmVudi5BUElfS0VZJzogSlNPTi5zdHJpbmdpZnkoZW52LkFQSV9LRVkgfHwgcHJvY2Vzcy5lbnYuQVBJX0tFWSlcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogMzAwMFxuICAgIH0sXG4gICAgYmFzZTogJy4vJyxcbiAgICBidWlsZDoge1xuICAgICAgb3V0RGlyOiAnZGlzdCdcbiAgICB9XG4gIH07XG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQWtPLFNBQVMsY0FBYyxlQUFlO0FBRXhRLE9BQU8sV0FBVztBQUVsQixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxRQUFNLE1BQU0sUUFBUSxNQUFPLFFBQWdCLElBQUksR0FBRyxFQUFFO0FBQ3BELFNBQU87QUFBQSxJQUNMLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxJQUNqQixRQUFRO0FBQUE7QUFBQSxNQUVOLHVCQUF1QixLQUFLLFVBQVUsSUFBSSxXQUFXLFFBQVEsSUFBSSxPQUFPO0FBQUEsSUFDMUU7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
