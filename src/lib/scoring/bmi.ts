// BMI & abdominal obesity using WHO Asia-Pacific / Indian cutoffs (Park's Textbook).

import type { AssessmentInput, ConditionResult, RiskBand, Severity } from '../types';

export function calcBmi(heightCm: number, weightKg: number): number {
  if (!heightCm || !weightKg) return 0;
  const m = heightCm / 100;
  return weightKg / (m * m);
}

/** Asian/Indian BMI bands. */
export function bmiBand(bmi: number): RiskBand {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 23) return 'normal';
  if (bmi < 25) return 'overweight';
  return 'obese';
}

/** Indian abdominal-obesity cutoffs: waist ≥90cm (men) / ≥80cm (women). */
export function hasAbdominalObesity(input: AssessmentInput): boolean {
  if (!input.waistCm) return false;
  return input.sex === 'male' ? input.waistCm >= 90 : input.waistCm >= 80;
}

export function scoreWeight(input: AssessmentInput): ConditionResult {
  const bmi = calcBmi(input.heightCm, input.weightKg);
  const band = bmiBand(bmi);
  const abdominal = hasAbdominalObesity(input);

  let severity: Severity = 'good';
  if (band === 'overweight' || band === 'underweight') severity = 'warn';
  if (band === 'obese') severity = 'danger';
  // Abdominal obesity escalates a "normal" BMI to at least info/warn.
  if (abdominal && severity === 'good') severity = 'warn';

  return {
    key: 'weight',
    band,
    value: Math.round(bmi * 10) / 10,
    valueLabel: `BMI ${(Math.round(bmi * 10) / 10).toFixed(1)}`,
    severity,
  };
}
