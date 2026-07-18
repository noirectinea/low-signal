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
    launchOptions: {
      executablePath:
        process.env.PLAYWRIGHT_EXECUTABLE_PATH ??
        "/tmp/pw/chromium_headless_shell-1187/chrome-mac/headless_shell",
    },
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
