import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { getById } from '../lib/storage';
import { buildOutcomes, outcomeFor } from '../lib/feedback/engine';
import { FeedbackCard } from '../components/FeedbackCard';
import type { Language } from '../lib/types';

export function DomainDetail() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id, key } = useParams();

  const record = useMemo(() => (id ? getById(id) : undefined), [id]);
  const outcome = useMemo(() => {
    if (!record || !key) return undefined;
    const outcomes = buildOutcomes(record.result, (i18n.language as Language) ?? 'en');
    return outcomeFor(outcomes, key);
  }, [record, key, i18n.language]);

  return (
    <div className="app-shell px-5 py-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-5 flex items-center gap-1 text-ink-soft"
        aria-label={t('common.back')}
      >
        <span className="text-2xl">‹</span>
        <span className="text-sm font-medium">{t('report.title')}</span>
      </button>

      {outcome ? (
        <FeedbackCard outcome={outcome} />
      ) : (
        <p className="text-ink-soft">{t('history.empty')}</p>
      )}
    </div>
  );
}
