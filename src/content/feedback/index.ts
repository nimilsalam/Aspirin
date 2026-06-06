import type { FeedbackRegistry, Language } from '../../lib/types';
import { en } from './en';
import { ml } from './ml';

const REGISTRIES: Record<Language, FeedbackRegistry> = { en, ml };

/** Returns the feedback content registry for a language (falls back to English). */
export function getRegistry(language: Language): FeedbackRegistry {
  return REGISTRIES[language] ?? en;
}
