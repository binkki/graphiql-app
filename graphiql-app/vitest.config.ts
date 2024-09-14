/// <reference types="vitest/config" />

import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./app/test/vitest.setup.ts"],
    coverage: {
      provider: "v8",
      include: ["app/**/*.{js,jsx,ts,tsx}"],
      exclude: [
        "node_modules",
        "coverage",
        "husky",
        "dist",
        "cypress",
        "idea",
        "git",
        "cache",
        "output",
        "temp",
        "vite",
        "vitest",
        "jest",
        "ava",
        "babel",
        "nyc",
        "cypress",
        "tsup",
        "build",
        "eslint",
        "prettier",
      ],
    },
  },
});
