// Blood-pressure classification (JNC bands, as presented in Park's Textbook).

import type { AssessmentInput, ConditionResult, RiskBand, Severity } from '../types';

export function bpBand(systolic: number, diastolic: number): RiskBand {
  if (systolic >= 160 || diastolic >= 100) return 'stage2';
  if (systolic >= 140 || diastolic >= 90) return 'stage1';
  if (systolic >= 120 || diastolic >= 80) return 'prehypertension';
  return 'normal';
}

export function scoreBloodPressure(input: AssessmentInput): ConditionResult {
  if (!input.bpKnown || input.systolic == null || input.diastolic == null) {
    return {
      key: 'bloodPressure',
      band: 'unknown',
      valueLabel: 'Not measured',
      severity: 'info',
    };
  }

  const band = bpBand(input.systolic, input.diastolic);
  let severity: Severity = 'good';
  if (band === 'prehypertension') severity = 'warn';
  if (band === 'stage1') severity = 'warn';
  if (band === 'stage2') severity = 'danger';

  return {
    key: 'bloodPressure',
    band,
    valueLabel: `${input.systolic}/${input.diastolic} mmHg`,
    severity,
  };
}
