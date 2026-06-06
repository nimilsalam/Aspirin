import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import type { AssessmentInput, AssessmentRecord, Language } from '../lib/types';
import { computeResult } from '../lib/scoring/overall';
import { makeId, saveAssessment, setStoredLanguage } from '../lib/storage';

/** Sensible starting values for the wizard draft. */
const emptyDraft: Partial<AssessmentInput> = {
  sex: 'male',
  bpKnown: false,
  activity: 'moderate',
  diet: 'mixed',
  fruitVegDaily: true,
  highSaltDiet: false,
  tobacco: 'never',
  alcohol: 'none',
  sleepHours: 7,
  highStress: false,
  diabetesFamilyHistory: 'none',
};

interface AssessmentContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  draft: Partial<AssessmentInput>;
  updateDraft: (patch: Partial<AssessmentInput>) => void;
  resetDraft: () => void;
  /** Finalize the draft into a saved record; returns the new record id. */
  submit: () => string;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [draft, setDraft] = useState<Partial<AssessmentInput>>(emptyDraft);

  const language = (i18n.language === 'ml' ? 'ml' : 'en') as Language;

  const setLanguage = useCallback(
    (lang: Language) => {
      i18n.changeLanguage(lang);
      setStoredLanguage(lang);
    },
    [i18n],
  );

  const updateDraft = useCallback((patch: Partial<AssessmentInput>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDraft = useCallback(() => setDraft(emptyDraft), []);

  const submit = useCallback((): string => {
    const input = draft as AssessmentInput;
    const result = computeResult(input);
    const record: AssessmentRecord = {
      id: makeId(),
      date: new Date().toISOString(),
      language,
      input,
      result,
    };
    saveAssessment(record);
    return record.id;
  }, [draft, language]);

  const value = useMemo(
    () => ({ language, setLanguage, draft, updateDraft, resetDraft, submit }),
    [language, setLanguage, draft, updateDraft, resetDraft, submit],
  );

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment(): AssessmentContextValue {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error('useAssessment must be used within AssessmentProvider');
  return ctx;
}
