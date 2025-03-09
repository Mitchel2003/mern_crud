import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  /* shadcn/ui */
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '#': path.resolve(__dirname, './src/components')
    }
  },

  /**
   * This configures the build process to split the code into smaller chunks.
   * This is done to improve the performance of the application.
   */
  build: {
    minify: 'terser',
    terserOptions: { compress: { drop_console: true, drop_debugger: true } },
    rollupOptions: { output: { manualChunks(id) { if (id.includes('node_modules')) return id.split('node_modules/')[1].split('/')[0] } } }
  }
})