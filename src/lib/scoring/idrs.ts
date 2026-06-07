// Indian Diabetes Risk Score (IDRS) — Madras Diabetes Research Foundation (MDRF).
// Four parameters, max 100. Bands: <30 low, 30–50 moderate, ≥60 high.
// (Scores are multiples of 10, so no value falls between 51–59.)

import type { AssessmentInput, ConditionResult, RiskBand, Severity } from '../types';

function agePoints(age: number): number {
  if (age < 35) return 0;
  if (age < 50) return 20;
  return 30;
}

function waistPoints(input: AssessmentInput): number {
  const w = input.waistCm;
  if (w == null) return 0;
  if (input.sex === 'male') {
    if (w < 90) return 0;
    if (w < 100) return 10;
    return 20;
  }
  if (w < 80) return 0;
  if (w < 90) return 10;
  return 20;
}

// MDRF IDRS physical-activity categories: 0 / 10 / 20 / 30.
function activityPoints(input: AssessmentInput): number {
  switch (input.activity) {
    case 'vigorous': // vigorous exercise or strenuous manual work
      return 0;
    case 'moderate': // moderate exercise or moderate physical activity
      return 10;
    case 'mild': // mild exercise or mild physical activity
      return 20;
    case 'sedentary': // no exercise and sedentary
      return 30;
  }
}

function familyPoints(input: AssessmentInput): number {
  switch (input.diabetesFamilyHistory) {
    case 'none':
      return 0;
    case 'one':
      return 10;
    case 'both':
      return 20;
  }
}

export function calcIdrs(input: AssessmentInput): number {
  return (
    agePoints(input.age) +
    waistPoints(input) +
    activityPoints(input) +
    familyPoints(input)
  );
}

export function idrsBand(score: number): RiskBand {
  if (score < 30) return 'low';
  if (score < 60) return 'moderate';
  return 'high';
}

export function scoreDiabetes(input: AssessmentInput): ConditionResult {
  const score = calcIdrs(input);

  // Already diagnosed / on treatment: this is management, not screening.
  if (input.knownDiabetes) {
    return {
      key: 'diabetesRisk',
      band: 'present',
      value: score,
      valueLabel:
        input.fastingGlucose != null ? `${input.fastingGlucose} mg/dL` : 'Diagnosed',
      severity: 'danger',
    };
  }

  let band = idrsBand(score);

  // A measured fasting glucose overrides/escalates the risk-score band
  // (ADA: 100–125 mg/dL = prediabetes, ≥126 = diabetes range).
  const fpg = input.fastingGlucose;
  if (fpg != null) {
    if (fpg >= 126) band = 'high';
    else if (fpg >= 100 && band === 'low') band = 'moderate';
  }

  let severity: Severity = 'good';
  if (band === 'moderate') severity = 'warn';
  if (band === 'high') severity = 'danger';

  return {
    key: 'diabetesRisk',
    band,
    value: score,
    valueLabel: `IDRS ${score}`,
    severity,
  };
}
