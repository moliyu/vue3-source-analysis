import { defineConfig } from 'vite'
import { resolve, fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(import.meta.url)

export default defineConfig({
  server: {
    port: 3002
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src')
      }
    ]
  }
})