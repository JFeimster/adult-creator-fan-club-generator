# Fan Club Name Lab — AdultCreators AI

A free, standalone, static creator-branding generator. No backend, paid APIs, accounts, or third-party scripts.

## Run locally

Requires Node.js 20+ only for local preview and tests (the deployed site is plain static HTML/CSS/JS).

```powershell
cd "C:\Users\jason\OneDrive\Desktop\Brands\AdultCreator AI\fan-club-name-generator"
npm run dev
```

Open http://localhost:4173. Stop with Ctrl+C.

## Tests

```powershell
npm test
```

## Deploy

Import the GitHub repository into Vercel as an **Other** framework / static site, without a build command. The site is served from the repository root. No environment variables are required.

## Architecture

- `index.html`: one-page UX
- `assets/css/`: visual system and effects
- `assets/js/generator.js`: pure naming logic
- `assets/js/brand-kit.js`: VIP tiers, slogans, messaging and merch copy
- `assets/js/favorites.js`: browser-only persistence
- `assets/js/share.js`: native share and clipboard
- `assets/js/card-renderer.js`: PNG card preview and download
- `data/`: editable source-of-truth naming dictionaries and templates
- `tests/`: dependency-free Node tests

All creator input stays in the browser. Names are suggestions, not trademark or handle availability checks. Platform names are descriptive and imply no official affiliation.