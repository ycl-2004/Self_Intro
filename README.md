# Yi-Chen Lin Profile Website

Bilingual (EN/中文) personal profile + resume website built with React and Vite.

## Uncodixify

This repo includes local Uncodixify rules to avoid repetitive AI-style UI patterns:

- `Uncodixfy.md`
- `SKILL.md`

Use these rules when editing UI so the site stays clean, practical, and typography-first.

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

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=ycl-2004/Self_Intro&type=Date)](https://star-history.com/#ycl-2004/Self_Intro&Date)
