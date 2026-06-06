// localStorage-backed persistence for assessment history. No backend, fully offline.

import type { AssessmentRecord, Language } from './types';

const RECORDS_KEY = 'aspirin.assessments';
const LANG_KEY = 'aspirin.language';

function readRecords(): AssessmentRecord[] {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AssessmentRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRecords(records: AssessmentRecord[]): void {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch {
    // Storage full or unavailable (private mode) — fail silently; app still works in-session.
  }
}

/** Returns all records, newest first. */
export function getAll(): AssessmentRecord[] {
  return readRecords().sort((a, b) => b.date.localeCompare(a.date));
}

export function getById(id: string): AssessmentRecord | undefined {
  return readRecords().find((r) => r.id === id);
}

/** Most recent record, if any. */
export function getLatest(): AssessmentRecord | undefined {
  return getAll()[0];
}

/** The record immediately before the given one (by date), for comparison. */
export function getPrevious(beforeId: string): AssessmentRecord | undefined {
  const all = getAll();
  const idx = all.findIndex((r) => r.id === beforeId);
  if (idx === -1) return undefined;
  return all[idx + 1];
}

export function saveAssessment(record: AssessmentRecord): void {
  const records = readRecords();
  records.push(record);
  writeRecords(records);
}

export function deleteAssessment(id: string): void {
  writeRecords(readRecords().filter((r) => r.id !== id));
}

export function clearAll(): void {
  writeRecords([]);
}

export function getStoredLanguage(): Language | null {
  const v = localStorage.getItem(LANG_KEY);
  return v === 'en' || v === 'ml' ? v : null;
}

export function setStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* ignore */
  }
}

/** Small unique-id helper (no external dep). */
export function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
