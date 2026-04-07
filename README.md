# Beautiful Emotions

A wellness mobile-first web app mapping doTERRA essential oils to emotional states.  
In partnership with doTERRA® | Built with React + Vite

---

## Project Structure

```
beautiful-emotions/
├── src/
│   ├── data/
│   │   ├── oils.json         ← All oil data (add new oils here)
│   │   ├── emotions.json     ← All emotion data (add new emotions here)
│   │   └── affirmations.json ← Standalone affirmations
│   ├── components/
│   │   ├── ui/index.jsx      ← Shared UI components
│   │   ├── botanical/index.jsx ← SVG nature illustrations
│   │   └── layout/index.jsx  ← Background + BottomNav
│   ├── screens/
│   │   ├── HomeScreen.jsx
│   │   └── Screens.jsx       ← All other screens
│   ├── theme.js              ← Colours, zones, moods
│   ├── styles.css            ← Global CSS + animations
│   ├── App.jsx               ← Root router
│   └── main.jsx              ← Entry point
├── index.html
├── vite.config.js
├── package.json
└── netlify.toml              ← Deploy config
```

---

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## Deploy to Netlify

### Option A — Drag & drop (fastest)
1. Run `npm run build`
2. Drag the `dist/` folder to https://app.netlify.com/drop

### Option B — GitHub + Auto-deploy (recommended)
1. Push this folder to a GitHub repo
2. Go to https://app.netlify.com → New site from Git
3. Choose your repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click Deploy

The `netlify.toml` handles all SPA routing automatically.

---

## Adding New Oils

Open `src/data/oils.json` and add a new entry following this schema:

```json
{
  "id": "unique-id",
  "name": "Oil Name",
  "latin": "Latin name",
  "family": "floral|citrus|herbal|earthy|wood|resin|spice",
  "size": "15ml",
  "retail": 00.00,
  "wholesale": 00.00,
  "tagline": "Short evocative tagline",
  "colour": "#HEXCODE",
  "props": ["Property 1", "Property 2", "Property 3"],
  "apps": ["Topical", "Aromatic", "Internal"],
  "affirmation": "I ...",
  "pairs": ["oil-id-1", "oil-id-2", "oil-id-3"],
  "emotions": ["emotion-id-1", "emotion-id-2"],
  "safetyNote": "Safety note or null"
}
```

No code changes needed — the UI picks up new entries automatically.

---

## Adding New Emotions

Open `src/data/emotions.json` and add a new entry:

```json
{
  "id": "unique-id",
  "name": "Emotion Name",
  "zone": "joy|serenity|love|courage|clarity|peace",
  "desc": "2-3 sentence description",
  "affirmation": "I ...",
  "oils": ["oil-id-1", "oil-id-2", "oil-id-3"],
  "colour": "#HEXCODE"
}
```

---

## Pricing

Oil prices in `oils.json` reflect doTERRA UK wholesale/retail as of February 2026.  
Update the `retail` and `wholesale` fields when new price lists are issued.

---

## Tech Stack

- React 18 + Vite
- React Router v6
- No UI library (all components hand-built)
- localStorage for Journal persistence
- Google Fonts: Cormorant Garamond + DM Sans
- Deployed via Netlify
