// Combines all condition scores into a 0–100 overall health score + tier,
// and derives the cluster conditions (metabolic syndrome, high CVD risk).

import type {
  AssessmentInput,
  AssessmentResult,
  ConditionResult,
  ScoreTier,
  Severity,
} from '../types';
import { scoreWeight, hasAbdominalObesity } from './bmi';
import { scoreDiabetes } from './idrs';
import { scoreBloodPressure } from './bloodPressure';
import { scoreLipids } from './lipids';
import {
  scoreActivity,
  scoreAlcohol,
  scoreDiet,
  scoreTobacco,
} from './lifestyle';

// Emphasis weights (Park priority: diabetes > hypertension > dyslipidemia > obesity).
const WEIGHTS: Record<string, number> = {
  diabetesRisk: 1.0,
  bloodPressure: 0.9,
  tobacco: 0.7,
  lipids: 0.7,
  weight: 0.6,
  physicalActivity: 0.5,
  diet: 0.5,
  alcohol: 0.4,
};

const SEVERITY_PENALTY: Record<Severity, number> = {
  good: 0,
  info: 4,
  warn: 10,
  danger: 20,
};

function tierFor(score: number): ScoreTier {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

/** Derived cluster conditions, built from the primary condition results. */
function deriveClusters(
  input: AssessmentInput,
  byKey: Record<string, ConditionResult>,
): ConditionResult[] {
  const clusters: ConditionResult[] = [];

  // Metabolic-syndrome components use measured values (not the IDRS risk score)
  // to avoid over-diagnosis: BP ≥130/85, fasting glucose ≥100. Per the harmonized
  // criteria, drug treatment for raised BP / glucose also satisfies the component.
  const raisedBp =
    input.knownHypertension ||
    (input.systolic != null && input.systolic >= 130) ||
    (input.diastolic != null && input.diastolic >= 85);
  const raisedGlucose =
    input.knownDiabetes || (input.fastingGlucose != null && input.fastingGlucose >= 100);
  const lowHdl =
    input.hdl != null && input.hdl < (input.sex === 'male' ? 40 : 50);
  const highTg = input.triglycerides != null && input.triglycerides >= 150;

  // Metabolic syndrome: ≥3 of the five components.
  const components = [
    hasAbdominalObesity(input),
    raisedBp,
    raisedGlucose,
    lowHdl,
    highTg,
  ].filter(Boolean).length;
  if (components >= 3) {
    clusters.push({
      key: 'metabolicSyndrome',
      band: 'present',
      severity: 'danger',
    });
  }

  // High CVD risk: current smoker + hypertension + (high/known diabetes OR high lipids).
  const hypertension =
    input.knownHypertension ||
    byKey.bloodPressure?.band === 'stage1' ||
    byKey.bloodPressure?.band === 'stage2';
  const diabetes =
    input.knownDiabetes || byKey.diabetesRisk?.band === 'high';
  if (
    input.tobacco === 'current' &&
    hypertension &&
    (diabetes || byKey.lipids?.band === 'high')
  ) {
    clusters.push({ key: 'highCvdRisk', band: 'present', severity: 'danger' });
  }

  return clusters;
}

export function computeResult(input: AssessmentInput): AssessmentResult {
  const primary: ConditionResult[] = [
    scoreDiabetes(input),
    scoreBloodPressure(input),
    scoreLipids(input),
    scoreWeight(input),
    scoreActivity(input),
    scoreDiet(input),
    scoreTobacco(input),
    scoreAlcohol(input),
  ];

  const byKey: Record<string, ConditionResult> = {};
  for (const c of primary) byKey[c.key] = c;

  // Score from primary conditions only (clusters would double-count their parts).
  let penalty = 0;
  for (const c of primary) {
    const weight = WEIGHTS[c.key] ?? 0.5;
    penalty += weight * SEVERITY_PENALTY[c.severity];
  }
  const score = Math.max(0, Math.min(100, Math.round(100 - penalty)));

  const clusters = deriveClusters(input, byKey);

  return {
    score,
    tier: tierFor(score),
    conditions: [...primary, ...clusters],
  };
}
