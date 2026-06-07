// Blood-pressure classification — ACC/AHA 2017 categories:
//   Normal:    < 120 AND < 80
//   Elevated:  120–129 AND < 80
//   Stage 1:   130–139 OR 80–89
//   Stage 2:   ≥ 140 OR ≥ 90

import type { AssessmentInput, ConditionResult, RiskBand, Severity } from '../types';

export function bpBand(systolic: number, diastolic: number): RiskBand {
  if (systolic >= 140 || diastolic >= 90) return 'stage2';
  if (systolic >= 130 || diastolic >= 80) return 'stage1';
  if (systolic >= 120) return 'elevated'; // diastolic < 80 here (≥80 caught above)
  return 'normal';
}

export function scoreBloodPressure(input: AssessmentInput): ConditionResult {
  const hasReading = input.bpKnown && input.systolic != null && input.diastolic != null;
  const measuredBand = hasReading ? bpBand(input.systolic!, input.diastolic!) : undefined;
  const valueLabel = hasReading
    ? `${input.systolic}/${input.diastolic} mmHg`
    : undefined;

  // Already diagnosed / on treatment: focus on control, not screening.
  if (input.knownHypertension) {
    // Uncontrolled (stage 1/2 despite diagnosis) is more urgent than controlled.
    const uncontrolled = measuredBand === 'stage1' || measuredBand === 'stage2';
    return {
      key: 'bloodPressure',
      band: 'present',
      valueLabel: valueLabel ?? 'Diagnosed',
      severity: uncontrolled ? 'danger' : 'warn',
    };
  }

  if (!hasReading) {
    return {
      key: 'bloodPressure',
      band: 'unknown',
      valueLabel: 'Not measured',
      severity: 'info',
    };
  }

  const band = measuredBand!;
  let severity: Severity = 'good';
  if (band === 'elevated') severity = 'warn';
  if (band === 'stage1') severity = 'warn';
  if (band === 'stage2') severity = 'danger';

  return { key: 'bloodPressure', band, valueLabel, severity };
}
