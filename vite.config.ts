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
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) return 'mui';
            if (id.includes('recharts')) return 'charts';
            if (id.includes('@react-pdf')) return 'pdf';
            return 'vendor';
          }
        }
      }
    }
  }
})