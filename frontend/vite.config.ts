import { defineConfig, loadEnv } from 'vite';
import { resolve as pathResolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY for the Gemini SDK
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY)
    },
    server: {
      port: 3000
    },
    base: './',
    build: {
      outDir: 'dist'
    }
  };
});