import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { getById, getLatest } from '../lib/storage';
import { buildOutcomes, topPriorities } from '../lib/feedback/engine';
import { DOMAIN_ORDER } from '../lib/feedback/rules';
import { ScoreRing } from '../components/ScoreRing';
import { PriorityList } from '../components/PriorityList';
import { DomainCard } from '../components/DomainCard';
import { QRShare } from '../components/QRShare';
import { QRModal } from '../components/QRModal';
import { BottomNav } from '../components/BottomNav';
import { TIER_COLOR, formatDate } from '../lib/ui';
import type { ConditionResult, Language } from '../lib/types';

export function Report() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [showQR, setShowQR] = useState(false);

  const record = useMemo(() => (id ? getById(id) : getLatest()), [id]);

  const outcomes = useMemo(
    () => (record ? buildOutcomes(record.result, (i18n.language as Language) ?? 'en') : []),
    [record, i18n.language],
  );
  const priorities = useMemo(() => topPriorities(outcomes, 3), [outcomes]);

  if (!record) {
    return (
      <div className="app-shell items-center justify-center p-6 text-center">
        <p className="text-ink-soft">{t('history.empty')}</p>
        <button type="button" className="btn-primary mt-6" onClick={() => navigate('/welcome')}>
          {t('welcome.start')}
        </button>
      </div>
    );
  }

  const { result } = record;
  const tierColor = TIER_COLOR[result.tier];

  // Primary domain cards in display order.
  const byKey: Record<string, ConditionResult> = {};
  for (const c of result.conditions) byKey[c.key] = c;
  const domainCards = DOMAIN_ORDER.map((k) => byKey[k]).filter(Boolean);

  const openDomain = (key: string) => navigate(`/report/${record.id}/${key}`);

  const share = async () => {
    const shareData = { title: t('app.name'), text: t('common.shareText'), url: window.location.origin };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard?.writeText(`${shareData.text} ${shareData.url}`);
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="app-shell">
      <div className="flex-1 px-5 py-6">
        {/* Score header */}
        <div className="card flex flex-col items-center text-center">
          <p className="text-sm text-ink-faint">{formatDate(record.date, i18n.language)}</p>
          <div className="my-3">
            <ScoreRing score={result.score} color={tierColor} label={t('report.scoreLabel')} />
          </div>
          <h1 className="text-xl font-bold text-ink">{t(`report.tier${cap(result.tier)}`)}</h1>
          <p className="mt-1 text-sm text-ink-soft">{t(`report.tier${cap(result.tier)}Sub`)}</p>
        </div>

        {/* Priorities */}
        <h2 className="mb-3 mt-7 text-lg font-bold text-ink">{t('report.priorities')}</h2>
        {priorities.length > 0 ? (
          <PriorityList outcomes={priorities} onSelect={openDomain} />
        ) : (
          <div className="card flex items-center gap-2 text-ink-soft">
            <span aria-hidden>🎉</span>
            <span>{t('report.noPriorities')}</span>
          </div>
        )}

        {/* All areas */}
        <h2 className="mb-3 mt-7 text-lg font-bold text-ink">{t('report.allAreas')}</h2>
        <div className="grid grid-cols-1 gap-3">
          {domainCards.map((c) => (
            <DomainCard
              key={c.key}
              result={c}
              name={t(`conditions.${c.key}`)}
              statusLabel=""
              onClick={() => openDomain(c.key)}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-col gap-3">
          <button type="button" className="btn-primary" onClick={share}>
            🔗 {t('common.share')}
          </button>
          <button type="button" className="btn-ghost" onClick={() => setShowQR(true)}>
            ▣ {t('common.showQr')}
          </button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/welcome')}>
            {t('common.retake')}
          </button>
        </div>

        {/* Scannable QR to share the link on screen */}
        <div className="mt-5">
          <QRShare />
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-ink-faint">
          {t('welcome.disclaimer')}
        </p>
      </div>

      {showQR && <QRModal url={window.location.origin} onClose={() => setShowQR(false)} />}

      <BottomNav />
    </div>
  );
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
