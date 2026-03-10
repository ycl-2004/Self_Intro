# Yi-Chen Lin Profile Website

Bilingual (EN/中文) personal profile + resume website built with React and Vite.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Content source of truth

Update all profile data in:

- `src/data/profile.ts`

## Style system

Warm and soft visual tokens live in:

- `src/styles/tokens.css`

Component styles consume token values from:

- `src/styles/base.css`
- `src/styles/app.css`

## GitHub Pages deployment

Deployment workflow:

- `.github/workflows/deploy.yml`

The workflow sets `VITE_BASE_PATH` to `/<repo-name>/` automatically for project-site hosting.
