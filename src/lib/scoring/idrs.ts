// Indian Diabetes Risk Score (IDRS) — Madras Diabetes Research Foundation (MDRF).
// Four parameters, max 100. Bands: <30 low, 30–59 moderate, ≥60 high.

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

function activityPoints(input: AssessmentInput): number {
  switch (input.activity) {
    case 'vigorous':
      return 0;
    case 'moderate':
      return 20;
    case 'mild':
      return 30;
    case 'sedentary':
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
  const band = idrsBand(score);

  // Known diabetes (high fasting glucose) is always high severity.
  const knownHigh = input.fastingGlucose != null && input.fastingGlucose >= 126;

  let severity: Severity = 'good';
  if (band === 'moderate') severity = 'warn';
  if (band === 'high' || knownHigh) severity = 'danger';

  return {
    key: 'diabetesRisk',
    band: knownHigh ? 'high' : band,
    value: score,
    valueLabel: `IDRS ${score}`,
    severity,
  };
}
