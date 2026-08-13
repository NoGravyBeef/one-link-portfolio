import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: false,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173/one-link-portfolio/",
    browserName: "chromium",
    colorScheme: "light",
    locale: "ko-KR",
  },
});
