import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://jacobbellotti.com",
  base: "/",
  build: {
    // Keep about.html, work.html, etc. so existing relative links + menu JS stay identical.
    format: "file",
  },
  integrations: [
    sitemap({
      serialize(item) {
        const url = item.url.replace(/\/$/, "");
        if (url === "https://jacobbellotti.com") {
          item.url = "https://jacobbellotti.com/";
          return item;
        }
        if (!url.endsWith(".html")) {
          item.url = `${url}.html`;
        }
        return item;
      },
    }),
  ],
});
