# Fivelementals — Ghoul Kids Club

Landing page + XP-based fact quiz app for the Five Elements Crew.

## Structure

- `src/pages/Landing.jsx` — marketing landing page (`/`)
- `src/pages/QuizApp.jsx` — the crew quiz app (`/quiz`)
- `src/data/characters.js` — shared character + sidekick roster (art, colors, blurbs)
- `src/data/quizBank.json` — all quiz questions (solo facts per character/sidekick + combo questions)
- `src/assets/characters/` — real character artwork (badge + pose PNGs per character/sidekick)

## Develop

```
npm install
npm run dev
```

## Build

```
npm run build
```

Outputs a static site to `dist/`, deployable to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages) and pointed at your Squarespace-purchased domain via DNS.

## Editing quiz content

All quiz questions live in `src/data/quizBank.json` (used directly by the app — no duplicated data to keep in sync). Character info, colors, and art references live in `src/data/characters.js`.
