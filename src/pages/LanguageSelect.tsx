import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import type { Language } from '../lib/types';

export function LanguageSelect() {
  const { t } = useTranslation();
  const { setLanguage } = useAssessment();
  const navigate = useNavigate();

  const choose = (lang: Language) => {
    setLanguage(lang);
    navigate('/welcome');
  };

  return (
    <div className="app-shell justify-center px-6 py-10">
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-500 text-4xl text-white shadow-card">
          ＋
        </div>
        <h1 className="text-2xl font-bold text-ink">{t('app.name')}</h1>
        <p className="mt-1 text-ink-soft">{t('app.tagline')}</p>
      </div>

      <h2 className="mb-1 text-center text-lg font-semibold text-ink">
        {t('language.title')}
      </h2>
      <p className="mb-6 text-center text-sm text-ink-soft">{t('language.subtitle')}</p>

      <div className="flex flex-col gap-4">
        <button type="button" className="btn-primary" onClick={() => choose('ml')}>
          {t('language.malayalam')}
        </button>
        <button type="button" className="btn-ghost" onClick={() => choose('en')}>
          {t('language.english')}
        </button>
      </div>
    </div>
  );
}
