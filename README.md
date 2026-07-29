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

Deployed via GitHub Actions to **https://jacobbellotti.com**.

Custom domain file: `public/CNAME` → `jacobbellotti.com`

### Squarespace DNS

At the apex (`@` / `jacobbellotti.com`), use GitHub Pages **A** records:

| Type | Host | Value |
|------|------|--------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

For `www`:

| Type | Host | Value |
|------|------|--------|
| CNAME | `www` | `larrysaperstein.github.io` |

Then in the repo: **Settings → Pages → Custom domain** → `jacobbellotti.com` → enable **Enforce HTTPS** once DNS checks pass.
