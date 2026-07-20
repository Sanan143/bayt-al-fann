import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom for DOM simulation
    environment: "jsdom",
    // Run setup file before each test
    setupFiles: ["./src/__tests__/setup.ts"],
    // Include test files
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Global test utilities available without importing
    globals: true,
    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/__tests__/**",
        "src/**/*.d.ts",
        "src/components/ui/**", // shadcn/radix generated components
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
