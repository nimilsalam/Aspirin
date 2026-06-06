import { useTranslation } from 'react-i18next';
import type { Outcome } from '../lib/types';
import { CONDITION_ICON, SEVERITY_COLOR } from '../lib/ui';

interface FeedbackCardProps {
  outcome: Outcome;
}

/** Full detail for one condition: what it means, the clinician's advice, and steps. */
export function FeedbackCard({ outcome }: FeedbackCardProps) {
  const { t } = useTranslation();
  const { content, result } = outcome;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden>
          {CONDITION_ICON[outcome.key]}
        </span>
        <div>
          <h2 className="text-xl font-bold text-ink">{content.title}</h2>
          {result.valueLabel && (
            <p className={`text-sm font-medium ${SEVERITY_COLOR[result.severity]}`}>
              {result.valueLabel}
            </p>
          )}
        </div>
      </div>

      {content.seeDoctor && (
        <div className="flex items-center gap-2 rounded-2xl bg-risk-high/10 px-4 py-3 text-risk-high">
          <span aria-hidden>🩺</span>
          <span className="text-sm font-semibold">{t('common.seeDoctor')}</span>
        </div>
      )}

      <section className="card">
        <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-ink-faint">
          {t('common.whatThisMeans')}
        </h3>
        <p className="text-base leading-relaxed text-ink">{content.whatThisMeans}</p>
      </section>

      <section className="card border-l-4 border-brand-500">
        <p className="text-base leading-relaxed text-ink">{content.doctorMessage}</p>
        {content.audioUrl && (
          <audio controls src={content.audioUrl} className="mt-3 w-full">
            {t('common.listen')}
          </audio>
        )}
      </section>

      <section className="card">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-faint">
          {t('common.whatToDo')}
        </h3>
        <ul className="flex flex-col gap-2.5">
          {content.actionSteps.map((step, i) => (
            <li key={i} className="flex gap-2.5 text-base leading-snug text-ink">
              <span className="mt-0.5 text-brand-500" aria-hidden>
                ✓
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </section>

      {content.dietPlan && <PlanSection heading={content.dietPlan.heading} items={content.dietPlan.items} />}
      {content.exercisePlan && (
        <PlanSection heading={content.exercisePlan.heading} items={content.exercisePlan.items} />
      )}
    </div>
  );
}

function PlanSection({ heading, items }: { heading: string; items: string[] }) {
  return (
    <section className="card bg-brand-50/60">
      <h3 className="mb-3 text-base font-semibold text-brand-700">{heading}</h3>
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-base leading-snug text-ink">
            <span className="mt-0.5 text-brand-500" aria-hidden>
              •
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
