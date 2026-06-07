import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { ProgressBar } from '../components/ProgressBar';
import { ChoiceGroup, NumberField, YesNo } from '../components/inputs';
import type { AssessmentInput } from '../lib/types';

export function Assessment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { draft, updateDraft, submit } = useAssessment();
  const [step, setStep] = useState(0);

  const d = draft;
  const set = (patch: Partial<AssessmentInput>) => updateDraft(patch);

  // Each step: title, content, and whether the user can proceed.
  const steps: { title: string; content: ReactNode; valid: boolean }[] = [
    {
      title: t('steps.profile'),
      valid: !!d.age && !!d.sex,
      content: (
        <div className="flex flex-col gap-6">
          <NumberField label={t('fields.age')} value={d.age} onChange={(v) => set({ age: v })} min={1} max={120} />
          <ChoiceGroup
            label={t('fields.sex')}
            value={d.sex}
            onChange={(v) => set({ sex: v })}
            options={[
              { value: 'male', label: t('fields.male') },
              { value: 'female', label: t('fields.female') },
            ]}
          />
        </div>
      ),
    },
    {
      title: t('steps.body'),
      valid: !!d.heightCm && !!d.weightKg,
      content: (
        <div className="flex flex-col gap-6">
          <NumberField label={t('fields.height')} value={d.heightCm} onChange={(v) => set({ heightCm: v })} min={50} max={250} />
          <NumberField label={t('fields.weight')} value={d.weightKg} onChange={(v) => set({ weightKg: v })} min={10} max={300} />
          <NumberField
            label={`${t('fields.waist')} (${t('common.optional')})`}
            value={d.waistCm}
            onChange={(v) => set({ waistCm: v })}
            help={t('fields.waistHelp')}
            min={30}
            max={200}
          />
        </div>
      ),
    },
    {
      title: t('steps.bp'),
      valid: !d.bpKnown || (!!d.systolic && !!d.diastolic),
      content: (
        <div className="flex flex-col gap-6">
          <YesNo
            label={t('fields.knownHypertension')}
            value={d.knownHypertension}
            onChange={(v) => set({ knownHypertension: v })}
            yesLabel={t('common.yes')}
            noLabel={t('common.no')}
          />
          <YesNo
            label={t('fields.bpKnown')}
            value={d.bpKnown}
            onChange={(v) => set({ bpKnown: v })}
            yesLabel={t('common.yes')}
            noLabel={t('common.dontKnow')}
          />
          {d.bpKnown && (
            <div className="flex gap-3">
              <div className="flex-1">
                <NumberField label={t('fields.systolic')} value={d.systolic} onChange={(v) => set({ systolic: v })} min={70} max={260} />
              </div>
              <div className="flex-1">
                <NumberField label={t('fields.diastolic')} value={d.diastolic} onChange={(v) => set({ diastolic: v })} min={40} max={160} />
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('steps.lifestyle'),
      valid: true,
      content: (
        <div className="flex flex-col gap-6">
          <ChoiceGroup
            label={t('fields.activity')}
            value={d.activity}
            onChange={(v) => set({ activity: v })}
            options={[
              { value: 'vigorous', label: t('fields.activityVigorous') },
              { value: 'moderate', label: t('fields.activityModerate') },
              { value: 'mild', label: t('fields.activityMild') },
              { value: 'sedentary', label: t('fields.activitySedentary') },
            ]}
          />
          <ChoiceGroup
            label={t('fields.diet')}
            value={d.diet}
            onChange={(v) => set({ diet: v })}
            options={[
              { value: 'healthy', label: t('fields.dietHealthy') },
              { value: 'mixed', label: t('fields.dietMixed') },
              { value: 'poor', label: t('fields.dietPoor') },
            ]}
          />
          <YesNo label={t('fields.fruitVeg')} value={d.fruitVegDaily} onChange={(v) => set({ fruitVegDaily: v })} yesLabel={t('common.yes')} noLabel={t('common.no')} />
          <YesNo label={t('fields.highSalt')} value={d.highSaltDiet} onChange={(v) => set({ highSaltDiet: v })} yesLabel={t('common.yes')} noLabel={t('common.no')} />
        </div>
      ),
    },
    {
      title: t('steps.lifestyle'),
      valid: true,
      content: (
        <div className="flex flex-col gap-6">
          <ChoiceGroup
            label={t('fields.tobacco')}
            value={d.tobacco}
            onChange={(v) => set({ tobacco: v })}
            options={[
              { value: 'never', label: t('fields.tobaccoNever') },
              { value: 'former', label: t('fields.tobaccoFormer') },
              { value: 'current', label: t('fields.tobaccoCurrent') },
            ]}
          />
          <ChoiceGroup
            label={t('fields.alcohol')}
            value={d.alcohol}
            onChange={(v) => set({ alcohol: v })}
            options={[
              { value: 'none', label: t('fields.alcoholNone') },
              { value: 'within', label: t('fields.alcoholWithin') },
              { value: 'harmful', label: t('fields.alcoholHarmful') },
            ]}
          />
          <NumberField label={t('fields.sleep')} value={d.sleepHours} onChange={(v) => set({ sleepHours: v })} min={0} max={16} />
          <YesNo label={t('fields.stress')} value={d.highStress} onChange={(v) => set({ highStress: v })} yesLabel={t('common.yes')} noLabel={t('common.no')} />
        </div>
      ),
    },
    {
      title: t('steps.family'),
      valid: true,
      content: (
        <div className="flex flex-col gap-6">
          <YesNo
            label={t('fields.knownDiabetes')}
            value={d.knownDiabetes}
            onChange={(v) => set({ knownDiabetes: v })}
            yesLabel={t('common.yes')}
            noLabel={t('common.no')}
          />
          <ChoiceGroup
            label={t('fields.familyDiabetes')}
            value={d.diabetesFamilyHistory}
            onChange={(v) => set({ diabetesFamilyHistory: v })}
            options={[
              { value: 'none', label: t('fields.familyNone') },
              { value: 'one', label: t('fields.familyOne') },
              { value: 'both', label: t('fields.familyBoth') },
            ]}
          />
        </div>
      ),
    },
    {
      title: t('steps.labs'),
      valid: true,
      content: (
        <div className="flex flex-col gap-6">
          <p className="text-sm text-ink-soft">{t('fields.labsIntro')}</p>
          <NumberField label={t('fields.glucose')} value={d.fastingGlucose} onChange={(v) => set({ fastingGlucose: v })} />
          <NumberField label={t('fields.totalChol')} value={d.totalCholesterol} onChange={(v) => set({ totalCholesterol: v })} />
          <NumberField label={t('fields.hdl')} value={d.hdl} onChange={(v) => set({ hdl: v })} />
          <NumberField label={t('fields.ldl')} value={d.ldl} onChange={(v) => set({ ldl: v })} />
          <NumberField label={t('fields.tg')} value={d.triglycerides} onChange={(v) => set({ triglycerides: v })} />
        </div>
      ),
    },
  ];

  const total = steps.length;
  const isLast = step === total - 1;
  const current = steps[step];

  const goNext = () => {
    if (isLast) {
      const id = submit();
      navigate(`/report/${id}`, { replace: true });
      return;
    }
    setStep((s) => Math.min(s + 1, total - 1));
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (step === 0) {
      navigate('/welcome');
      return;
    }
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-shell px-6 py-6">
      <div className="mb-6 flex items-center gap-3">
        <button type="button" onClick={goBack} className="text-2xl text-ink-soft" aria-label={t('common.back')}>
          ‹
        </button>
        <div className="flex-1">
          <ProgressBar current={step + 1} total={total} />
        </div>
        <span className="text-sm text-ink-faint">
          {step + 1} {t('common.of')} {total}
        </span>
      </div>

      <h1 className="mb-6 text-2xl font-bold text-ink">{current.title}</h1>

      <div className="flex-1">{current.content}</div>

      <div className="sticky bottom-0 -mx-6 mt-8 bg-surface-muted px-6 pb-2 pt-3">
        <button type="button" className="btn-primary" onClick={goNext} disabled={!current.valid}>
          {isLast ? t('common.finish') : t('common.next')}
        </button>
      </div>
    </div>
  );
}
