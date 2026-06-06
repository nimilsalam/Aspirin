// Lifestyle factors: physical activity, diet, tobacco, alcohol.
// Targets from WHO / Park: ≥150 min/wk moderate activity, ≥5 fruit&veg servings,
// salt <5 g/day, no tobacco, alcohol within limits.

import type { AssessmentInput, ConditionResult, RiskBand, Severity } from '../types';

export function scoreActivity(input: AssessmentInput): ConditionResult {
  let band: RiskBand;
  let severity: Severity;
  switch (input.activity) {
    case 'vigorous':
    case 'moderate':
      band = 'adequate';
      severity = 'good';
      break;
    case 'mild':
      band = 'insufficient';
      severity = 'warn';
      break;
    case 'sedentary':
      band = 'sedentary';
      severity = 'danger';
      break;
  }
  return { key: 'physicalActivity', band, severity };
}

export function scoreDiet(input: AssessmentInput): ConditionResult {
  // Combine the self-reported pattern with salt & fruit/veg flags.
  let band: RiskBand;
  if (input.diet === 'poor' || input.highSaltDiet) {
    band = input.diet === 'poor' ? 'poor' : 'needsImprovement';
  } else if (input.diet === 'mixed' || !input.fruitVegDaily) {
    band = 'needsImprovement';
  } else {
    band = 'healthy';
  }

  let severity: Severity = 'good';
  if (band === 'needsImprovement') severity = 'warn';
  if (band === 'poor') severity = 'danger';

  return { key: 'diet', band, severity };
}

export function scoreTobacco(input: AssessmentInput): ConditionResult {
  const band: RiskBand = input.tobacco;
  let severity: Severity = 'good';
  if (input.tobacco === 'former') severity = 'info';
  if (input.tobacco === 'current') severity = 'danger';
  return { key: 'tobacco', band, severity };
}

export function scoreAlcohol(input: AssessmentInput): ConditionResult {
  const band: RiskBand = input.alcohol;
  let severity: Severity = 'good';
  if (input.alcohol === 'within') severity = 'info';
  if (input.alcohol === 'harmful') severity = 'danger';
  return { key: 'alcohol', band, severity };
}
