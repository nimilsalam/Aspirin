// Shared UI helpers: map severity / tier / condition to colors and icons.

import type { ConditionKey, ScoreTier, Severity } from './types';

export const SEVERITY_COLOR: Record<Severity, string> = {
  good: 'text-risk-low',
  info: 'text-ink-soft',
  warn: 'text-risk-moderate',
  danger: 'text-risk-high',
};

export const SEVERITY_DOT: Record<Severity, string> = {
  good: 'bg-risk-low',
  info: 'bg-ink-faint',
  warn: 'bg-risk-moderate',
  danger: 'bg-risk-high',
};

export const SEVERITY_RING: Record<Severity, string> = {
  good: '#1a9d6b',
  info: '#8a9690',
  warn: '#e8a33d',
  danger: '#e05a4d',
};

export const TIER_COLOR: Record<ScoreTier, string> = {
  excellent: '#1a9d6b',
  good: '#5bb98c',
  fair: '#e8a33d',
  poor: '#e05a4d',
};

/** Simple emoji icons keep the bundle tiny and read well on low-end phones. */
export const CONDITION_ICON: Record<ConditionKey, string> = {
  diabetesRisk: '🩸',
  bloodPressure: '❤️',
  lipids: '🧈',
  weight: '⚖️',
  physicalActivity: '🚶',
  diet: '🥗',
  tobacco: '🚭',
  alcohol: '🍺',
  metabolicSyndrome: '⚠️',
  highCvdRisk: '🫀',
};

export function formatDate(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(locale === 'ml' ? 'ml-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso.slice(0, 10);
  }
}
