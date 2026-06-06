// Display metadata & severity ranking for the feedback engine.
// The *scoring* (which band a user falls into) lives in lib/scoring.
// These rules govern how outcomes are ranked and which are "actionable".

import type { ConditionKey, RiskBand, Severity } from '../types';

/** Numeric urgency rank by severity (higher = surfaced first). */
export const SEVERITY_RANK: Record<Severity, number> = {
  danger: 3,
  warn: 2,
  info: 1,
  good: 0,
};

/**
 * Bands that are reassuring (no action needed). These still render a card,
 * but never appear in the "top things to do" priority list.
 */
const HEALTHY_BANDS: ReadonlySet<RiskBand> = new Set<RiskBand>([
  'normal',
  'low',
  'adequate',
  'healthy',
  'never',
  'none',
  'within',
]);

export function isActionable(band: RiskBand, severity: Severity): boolean {
  if (HEALTHY_BANDS.has(band)) return false;
  return severity === 'warn' || severity === 'danger';
}

/**
 * Primary domains shown as tappable cards on the report dashboard,
 * in display order. Clusters are surfaced via the priority list, not as cards.
 */
export const DOMAIN_ORDER: ConditionKey[] = [
  'diabetesRisk',
  'bloodPressure',
  'lipids',
  'weight',
  'physicalActivity',
  'diet',
  'tobacco',
  'alcohol',
];

export const CLUSTER_KEYS: ConditionKey[] = ['metabolicSyndrome', 'highCvdRisk'];
