import { fileURLToPath, resolve } from "node:url"
import { UserConfig, defineConfig } from "vitest/config"

const __dirname = fileURLToPath(import.meta.url)

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
  },
}) as UserConfig
