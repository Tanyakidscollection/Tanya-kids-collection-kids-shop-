# Tanya Kids Collection

Static website for Tanya Kids Collection (ethnic wear for the whole family).

## Structure

- `index.html` — main page markup
- `style.css` — all styles
- `script.js` — all interactive behavior (language switcher, story viewer, image lightbox, product filtering, WhatsApp order links)
- `assets/images/` — product and story images (extracted from the original file)

## Local preview

No build step needed — it's a plain static site.

```bash
npx serve .
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to https://vercel.com/new and import the repo.
3. Framework preset: **Other** (static site) — no build command needed, output directory is the project root.
4. Deploy.
