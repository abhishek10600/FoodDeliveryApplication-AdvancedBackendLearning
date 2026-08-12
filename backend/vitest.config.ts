import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: [
      "./tests/setup.ts"
    ],
    include: [
      "tests/**/*.test.ts"
    ],
    exclude: [
      "node_modules",
      "dist",
      "generated"
    ],
    clearMocks: true,
    restoreMocks: true,
    testTimeout: 30_000,
    hookTimeout: 30_000
  },
})
