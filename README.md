# Aspirin — Lifestyle Disease Health Coach

A mobile-first, single-link health coach that helps people in India check their risk
for lifestyle (non-communicable) diseases and get a simple, personal plan to improve.
Designed for a South Indian audience first, with **Malayalam** and **English**.

It works like a simplified Google Health: pick a language, answer a few easy questions,
and get a health score with plain-language, Park's-Textbook-based advice. Do it again on
another day and the app shows how much you have improved.

## Highlights

- **No login, no backend.** All data stays on the user's phone (`localStorage`). Works offline (PWA).
- **Bilingual** (Malayalam / English) via `react-i18next`.
- **Rule-based feedback engine** with clear clinical cutoffs — easy for a clinician to customize.
- **Plain, UpToDate-style patient education** language for rural readers.
- Lightweight (~92 kB gzipped) for low-bandwidth, low-end phones.

## Tech

React + Vite + TypeScript + Tailwind, installable PWA (`vite-plugin-pwa`).

## Develop

```bash
npm install
npm run dev      # start dev server
npm run build    # typecheck + production build
npm run preview  # serve the production build
```

## How it works

1. **Assessment** (`src/pages/Assessment.tsx`) — a short wizard collects profile, body
   measurements, blood pressure, daily habits, family history and optional lab values.
2. **Scoring** (`src/lib/scoring/`) — validated tools: Asian/Indian BMI cutoffs, the
   **Indian Diabetes Risk Score (IDRS)**, JNC blood-pressure bands, lipid bands, and a
   weighted 0–100 overall health score.
3. **Feedback engine** (`src/lib/feedback/`) — maps each `(condition, risk band)` to a
   content slot, ranks by severity, and surfaces the **top 3 things to do**. Cluster rules
   detect metabolic syndrome and high cardiovascular risk.
4. **Report** (`src/pages/Report.tsx`) — Google-Health-style dashboard: score ring,
   priorities, tappable condition cards, share + retake.
5. **History & Compare** — past reports and a trend chart so users see their progress.

## Customizing the advice (for clinicians)

All patient-facing advice lives in the content registry:

- `src/content/feedback/en.ts` (English)
- `src/content/feedback/ml.ts` (Malayalam)

For any condition + risk band, overwrite `doctorMessage` with your own script, add an
`audioUrl` to attach a voice recording, or adjust `actionSteps` / `dietPlan` /
`exercisePlan`. No app-logic changes are needed — the engine and report pick it up.

> **Disclaimer:** This app is for awareness and education only. It is not a diagnosis.
> Malayalam medical phrasing should be reviewed by a clinician before real-world use.
