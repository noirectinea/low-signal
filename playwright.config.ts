import { defineConfig } from "@playwright/test";

export default defineConfig({
  expect: {
    timeout: 8_000,
  },
  fullyParallel: false,
  reporter: "line",
  testDir: "./tests/e2e",
  timeout: 30_000,
  workers: 1,
  use: {
    baseURL: "http://localhost:3005",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --port 3005",
    reuseExistingServer: true,
    timeout: 120_000,
    url: "http://localhost:3005",
  },
});
