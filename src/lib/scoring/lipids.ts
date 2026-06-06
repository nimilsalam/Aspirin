// Dyslipidemia assessment. Uses lab values when available; otherwise estimates a
// risk band from lifestyle risk factors (diet, obesity, inactivity).

import type { AssessmentInput, ConditionResult, RiskBand, Severity } from '../types';
import { bmiBand, calcBmi, hasAbdominalObesity } from './bmi';

function bandFromLabs(input: AssessmentInput): RiskBand {
  const { totalCholesterol, ldl, hdl, triglycerides, sex } = input;
  const tcHigh = totalCholesterol != null && totalCholesterol >= 240;
  const tcBorderline = totalCholesterol != null && totalCholesterol >= 200;
  const ldlHigh = ldl != null && ldl >= 160;
  const ldlBorderline = ldl != null && ldl >= 130;
  const hdlLow = hdl != null && hdl < (sex === 'male' ? 40 : 50);
  const tgHigh = triglycerides != null && triglycerides >= 200;
  const tgBorderline = triglycerides != null && triglycerides >= 150;

  if (tcHigh || ldlHigh || tgHigh) return 'high';
  if (tcBorderline || ldlBorderline || tgBorderline || hdlLow) return 'borderline';
  return 'normal';
}

/** Rough estimate when no labs are available — count lifestyle risk factors. */
function estimateBand(input: AssessmentInput): RiskBand {
  let factors = 0;
  const bmi = calcBmi(input.heightCm, input.weightKg);
  if (bmiBand(bmi) === 'obese') factors++;
  if (hasAbdominalObesity(input)) factors++;
  if (input.diet === 'poor') factors++;
  if (input.activity === 'sedentary' || input.activity === 'mild') factors++;
  if (input.tobacco === 'current') factors++;
  if (factors >= 3) return 'borderline';
  return 'unknown';
}

export function scoreLipids(input: AssessmentInput): ConditionResult {
  const hasLabs =
    input.totalCholesterol != null ||
    input.ldl != null ||
    input.hdl != null ||
    input.triglycerides != null;

  const band = hasLabs ? bandFromLabs(input) : estimateBand(input);

  let severity: Severity = 'good';
  if (band === 'unknown') severity = 'info';
  if (band === 'borderline') severity = 'warn';
  if (band === 'high') severity = 'danger';

  const valueLabel = hasLabs
    ? input.totalCholesterol != null
      ? `Total ${input.totalCholesterol} mg/dL`
      : 'Lab values entered'
    : 'No lab values';

  return { key: 'lipids', band, valueLabel, severity };
}
