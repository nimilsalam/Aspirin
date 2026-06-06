# Aspirin

Mobile-friendly browser health coach for lifestyle-disorder awareness in the Indian context, with an emphasis on **diabetes, hypertension, and dyslipidemia**.

Open the link (or scan a QR code) on a phone, pick a language, enter the values you know, and instantly see your current status plus simple steps to improve. You can reopen the link anytime to update your values.

## Features

- **Language selection first**: English or Malayalam (മലയാളം).
- **Grouped, collapsible data entry**: inputs are split into *About you*, *Blood sugar*, *Blood pressure*, *Cholesterol*, and *Lifestyle* sections, each skippable, with per-field helper text and inline out-of-range validation.
- **Instant status update**: enter BMI inputs, fasting glucose / HbA1c, blood pressure, and lipid values.
- **Condition classification** using widely published numeric clinical cutoffs:
  - BMI — Asian/Indian consensus cutoffs (normal `<23`, overweight `23–24.9`, obese `≥25`).
  - Diabetes — fasting plasma glucose and HbA1c (ADA/WHO).
  - Blood pressure — systolic/diastolic (JNC/WHO).
  - Dyslipidemia — total cholesterol, LDL, HDL, triglycerides (NCEP ATP III).
- **Overall health score** with a plain-language verdict, a colour matching the worst risk, and a single "Focus on" priority area.
- **Tappable result rows** revealing condition-specific tips and the numeric cutoff context, plus **prevention recommendations** in the chosen language.
- **Accessible & adaptive**: visible focus styles, text-plus-colour risk badges, an accessible score label, dark-mode support, and reduced-motion handling.
- Values are stored locally in the browser (with an "as of" date) so the link shows the latest status on reopen.

> The numeric thresholds used are standard published clinical reference values. The app does not reproduce any copyrighted textbook text.

## Project structure

- `index.html` — mobile-first UI (language screen + data entry + results).
- `styles.css` — Fitbit/Google Health-style styling.
- `src/clinical.js` — BMI/diabetes/BP/lipid classification and scoring.
- `src/i18n.js` — English and Malayalam translations.
- `src/app.js` — UI wiring (language, form, results).
- `tests/` — unit tests for clinical logic and i18n.

## Run locally

Serve the folder with any static server and open it in a browser, e.g.:

```bash
cd /path/to/Aspirin
python -m http.server 4173
# then open http://127.0.0.1:4173/index.html
```

## Test

```bash
npm test
```

## Deploy (Vercel)

The app is a static site (HTML, CSS, and ES modules) with no build step, hosted on **Vercel**. The included `vercel.json` configures Vercel to serve the repository root as static files.

- **Git integration**: import the repository at [vercel.com/new](https://vercel.com/new). No build command or framework preset is needed — Vercel serves the static files directly.
- **CLI**: from the project root, run `npx vercel` (preview) or `npx vercel --prod` (production).
