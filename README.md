# Jacob Bellotti

Personal site for Jacob Bellotti, built with [Astro](https://astro.build) and deployed to GitHub Pages.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages

1. Create a GitHub repo and push this project to `main`.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. If this is a **project site** (`username.github.io/repo-name/`), update `astro.config.mjs`:

```js
site: "https://<username>.github.io",
base: "/<repo-name>",
```

For a user/org site or a custom domain at the root, keep `base: "/"`.
