import { defineConfig } from "astro/config";

// For a GitHub project site (username.github.io/repo-name/), set:
//   site: "https://<username>.github.io"
//   base: "/<repo-name>"
// For a user/org site or custom domain at the root, keep base as "/".
export default defineConfig({
  site: "https://example.github.io",
  base: "/",
  build: {
    // Keep about.html, work.html, etc. so existing relative links + menu JS stay identical.
    format: "file",
  },
});
