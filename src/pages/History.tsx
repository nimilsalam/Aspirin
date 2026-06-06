import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { deleteAssessment, getAll } from '../lib/storage';
import { BottomNav } from '../components/BottomNav';
import { TIER_COLOR, formatDate } from '../lib/ui';

export function History() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [records, setRecords] = useState(() => getAll());

  const remove = (id: string) => {
    deleteAssessment(id);
    setRecords(getAll());
  };

  return (
    <div className="app-shell">
      <div className="flex-1 px-5 py-6">
        <h1 className="mb-4 text-2xl font-bold text-ink">{t('history.title')}</h1>

        {records.length === 0 ? (
          <p className="text-ink-soft">{t('history.empty')}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {records.map((r) => (
              <div key={r.id} className="card flex items-center gap-3">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{ backgroundColor: TIER_COLOR[r.result.tier] }}
                >
                  {r.result.score}
                </span>
                <button type="button" className="min-w-0 flex-1 text-left" onClick={() => navigate(`/report/${r.id}`)}>
                  <span className="block font-semibold text-ink">{formatDate(r.date, i18n.language)}</span>
                  <span className="text-sm text-ink-soft">{t(`report.tier${cap(r.result.tier)}`)}</span>
                </button>
                <button type="button" onClick={() => remove(r.id)} className="px-2 text-ink-faint" aria-label={t('history.delete')}>
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
