import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, 'src');

export default defineConfig(({ mode }) => ({
  plugins: [
    {
      name: 'treat-js-as-jsx',
      enforce: 'pre',
      async transform(code, id) {
        if (id.match(/src\/.*\.js$/)) {
          return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' });
        }
      },
    },
    react(),
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  resolve: {
    alias: {
      api: `${src}/api`,
      assets: `${src}/assets`,
      components: `${src}/components`,
      configs: `${src}/configs`,
      constants: `${src}/constants`,
      lang: `${src}/lang`,
      layouts: `${src}/layouts`,
      routes: `${src}/routes`,
      store: `${src}/store`,
      utils: `${src}/utils`,
      views: `${src}/views`,
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    'process.env.PUBLIC_URL': JSON.stringify(''),
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.js'],
  },
}));
