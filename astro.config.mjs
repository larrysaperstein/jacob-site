import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://jacobbellotti.com",
  base: "/",
  build: {
    // Emits about/index.html so URLs resolve as /about/
    format: "directory",
  },
  integrations: [sitemap()],
});
