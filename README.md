# Aspirin

Mobile-friendly browser health coach for lifestyle-disorder awareness in the Indian context, with an emphasis on **diabetes, hypertension, and dyslipidemia**.

Open the link (or scan a QR code) on a phone, pick a language, enter the values you know, and instantly see your current status plus simple steps to improve. You can reopen the link anytime to update your values.

## Features

- **Language selection first**: English or Malayalam (മലയാളം).
- **Instant status update**: enter BMI inputs, fasting glucose / HbA1c, blood pressure, and lipid values.
- **Condition classification** using widely published numeric clinical cutoffs:
  - BMI — Asian/Indian consensus cutoffs (normal `<23`, overweight `23–24.9`, obese `≥25`).
  - Diabetes — fasting plasma glucose and HbA1c (ADA/WHO).
  - Blood pressure — systolic/diastolic (JNC/WHO).
  - Dyslipidemia — total cholesterol, LDL, HDL, triglycerides (NCEP ATP III).
- **Overall health score** and **prevention recommendations** in the chosen language.
- Values are stored locally in the browser so the link shows the latest status on reopen.

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
