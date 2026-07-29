import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://jacobbellotti.com",
  base: "/",
  build: {
    // Keep about.html, work.html, etc. so existing relative links + menu JS stay identical.
    format: "file",
  },
});
