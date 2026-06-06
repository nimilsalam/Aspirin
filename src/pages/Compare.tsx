import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getAll } from '../lib/storage';
import { SEVERITY_RANK, DOMAIN_ORDER } from '../lib/feedback/rules';
import { TrendChart } from '../components/TrendChart';
import { BottomNav } from '../components/BottomNav';
import { CONDITION_ICON, formatDate } from '../lib/ui';
import type { AssessmentRecord, ConditionResult } from '../lib/types';

export function Compare() {
  const { t, i18n } = useTranslation();
  const records = useMemo(() => getAll(), []);

  if (records.length < 2) {
    return (
      <div className="app-shell">
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <span className="mb-3 text-4xl" aria-hidden>
            📈
          </span>
          <p className="text-ink-soft">{t('compare.needMore')}</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  // records are newest-first; chart wants oldest-first.
  const chronological = [...records].reverse();
  const points = chronological.map((r) => ({
    label: formatDate(r.date, i18n.language).split(' ').slice(0, 2).join(' '),
    score: r.result.score,
  }));

  const latest = records[0];
  const previous = records[1];
  const scoreDelta = latest.result.score - previous.result.score;

  return (
    <div className="app-shell">
      <div className="flex-1 px-5 py-6">
        <h1 className="mb-4 text-2xl font-bold text-ink">{t('compare.title')}</h1>

        <div className="card">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-faint">
            {t('compare.scoreOverTime')}
          </h2>
          <TrendChart points={points} />
        </div>

        <div className="card mt-4 flex items-center gap-3">
          <span className="text-3xl font-bold" style={{ color: scoreDelta >= 0 ? '#1a9d6b' : '#e05a4d' }}>
            {scoreDelta > 0 ? '+' : ''}
            {scoreDelta}
          </span>
          <p className="flex-1 text-sm text-ink-soft">
            {scoreDelta > 0
              ? t('compare.scoreUp', { points: scoreDelta })
              : scoreDelta < 0
                ? t('compare.scoreDown', { points: Math.abs(scoreDelta) })
                : t('compare.scoreSame')}
          </p>
        </div>

        <h2 className="mb-3 mt-7 text-lg font-bold text-ink">
          {t('compare.changeSince', { date: formatDate(previous.date, i18n.language) })}
        </h2>
        <div className="flex flex-col gap-2.5">
          {DOMAIN_ORDER.map((key) => {
            const now = findCondition(latest, key);
            const before = findCondition(previous, key);
            if (!now || !before) return null;
            const delta = SEVERITY_RANK[before.severity] - SEVERITY_RANK[now.severity];
            const status = delta > 0 ? 'improved' : delta < 0 ? 'worse' : 'same';
            const color = status === 'improved' ? '#1a9d6b' : status === 'worse' ? '#e05a4d' : '#8a9690';
            return (
              <div key={key} className="card flex items-center gap-3 py-3">
                <span className="text-xl" aria-hidden>
                  {CONDITION_ICON[key]}
                </span>
                <span className="flex-1 text-base font-medium text-ink">{t(`conditions.${key}`)}</span>
                <span className="text-sm font-semibold" style={{ color }}>
                  {status === 'improved' ? '↑' : status === 'worse' ? '↓' : '–'} {t(`compare.${status}`)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function findCondition(record: AssessmentRecord, key: string): ConditionResult | undefined {
  return record.result.conditions.find((c) => c.key === key);
}
