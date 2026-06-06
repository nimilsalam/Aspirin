// Feedback engine: turns a scored AssessmentResult into ordered, renderable
// feedback modules by composing per-(condition, band) content slots.

import type {
  AssessmentResult,
  ConditionResult,
  FeedbackRegistry,
  Language,
  Outcome,
} from '../types';
import { getRegistry } from '../../content/feedback';
import { CLUSTER_KEYS, SEVERITY_RANK, isActionable } from './rules';

function lookupSlot(registry: FeedbackRegistry, c: ConditionResult) {
  return registry[c.key]?.[c.band];
}

/**
 * Compose all fired feedback modules for a result, sorted by urgency (desc).
 * Conditions without authored content for their band are skipped.
 */
export function buildOutcomes(
  result: AssessmentResult,
  language: Language,
): Outcome[] {
  const registry = getRegistry(language);
  const outcomes: Outcome[] = [];

  for (const c of result.conditions) {
    const content = lookupSlot(registry, c);
    if (!content) continue;
    outcomes.push({
      key: c.key,
      band: c.band,
      severity: c.severity,
      rank: SEVERITY_RANK[c.severity],
      result: c,
      content,
    });
  }

  // Sort by severity rank desc; clusters bubble above equal-rank primaries.
  outcomes.sort((a, b) => {
    if (b.rank !== a.rank) return b.rank - a.rank;
    const aCluster = CLUSTER_KEYS.includes(a.key) ? 1 : 0;
    const bCluster = CLUSTER_KEYS.includes(b.key) ? 1 : 0;
    return bCluster - aCluster;
  });

  return outcomes;
}

/** The top N actionable outcomes — the campaign hook ("your top 3 things to do"). */
export function topPriorities(outcomes: Outcome[], n = 3): Outcome[] {
  return outcomes
    .filter((o) => isActionable(o.band, o.severity))
    .slice(0, n);
}

/** Look up a single outcome by condition key (for the domain detail page). */
export function outcomeFor(
  outcomes: Outcome[],
  key: string,
): Outcome | undefined {
  return outcomes.find((o) => o.key === key);
}
