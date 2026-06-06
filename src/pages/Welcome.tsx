import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { getLatest } from '../lib/storage';

export function Welcome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resetDraft } = useAssessment();
  const hasHistory = Boolean(getLatest());

  const start = () => {
    resetDraft();
    navigate('/assessment');
  };

  return (
    <div className="app-shell justify-between px-6 py-10">
      <div>
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 text-3xl text-white shadow-card">
          ＋
        </div>
        <h1 className="text-3xl font-bold leading-tight text-ink">{t('welcome.title')}</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">{t('welcome.body')}</p>

        <div className="mt-6 flex items-start gap-2 rounded-2xl bg-brand-50 px-4 py-3">
          <span aria-hidden>🔒</span>
          <p className="text-sm text-brand-700">{t('welcome.privacy')}</p>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <button type="button" className="btn-primary" onClick={start}>
          {t('welcome.start')}
        </button>
        {hasHistory && (
          <button type="button" className="btn-ghost" onClick={() => navigate('/history')}>
            {t('welcome.viewHistory')}
          </button>
        )}
        <p className="mt-2 text-center text-xs leading-relaxed text-ink-faint">
          {t('welcome.disclaimer')}
        </p>
      </div>
    </div>
  );
}
