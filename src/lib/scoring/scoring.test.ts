// Clinical-accuracy regression tests for the scoring cutoffs.
// Sources: MDRF Indian Diabetes Risk Score (IDRS); WHO Asia-Pacific / Indian BMI
// and waist cutoffs; JNC blood-pressure classification (Park's Textbook);
// NCEP ATP III lipid bands; 2009 harmonized metabolic-syndrome criteria (South Asian).

import { describe, expect, it } from 'vitest';
import type { AssessmentInput } from '../types';
import { calcIdrs, idrsBand, scoreDiabetes } from './idrs';
import { bmiBand, hasAbdominalObesity } from './bmi';
import { bpBand, scoreBloodPressure } from './bloodPressure';
import { scoreLipids } from './lipids';
import { computeResult } from './overall';

const base = (o: Partial<AssessmentInput> = {}): AssessmentInput => ({
  age: 30,
  sex: 'male',
  heightCm: 170,
  weightKg: 70,
  waistCm: 85,
  knownDiabetes: false,
  knownHypertension: false,
  bpKnown: false,
  activity: 'vigorous',
  diet: 'mixed',
  fruitVegDaily: true,
  highSaltDiet: false,
  tobacco: 'never',
  alcohol: 'none',
  sleepHours: 7,
  highStress: false,
  diabetesFamilyHistory: 'none',
  ...o,
});

describe('IDRS — age points', () => {
  it.each([
    [34, 0],
    [35, 20],
    [49, 20],
    [50, 30],
  ])('age %i -> %i', (age, pts) => {
    expect(calcIdrs(base({ age }))).toBe(pts);
  });
});

describe('IDRS — physical activity points (0/10/20/30)', () => {
  it.each([
    ['vigorous', 0],
    ['moderate', 10],
    ['mild', 20],
    ['sedentary', 30],
  ] as const)('%s -> %i', (activity, pts) => {
    expect(calcIdrs(base({ activity }))).toBe(pts);
  });
});

describe('IDRS — waist points', () => {
  it.each([
    ['male', 89, 0],
    ['male', 90, 10],
    ['male', 99, 10],
    ['male', 100, 20],
    ['female', 79, 0],
    ['female', 80, 10],
    ['female', 89, 10],
    ['female', 90, 20],
  ] as const)('%s waist %i -> %i', (sex, waistCm, pts) => {
    expect(calcIdrs(base({ sex, waistCm }))).toBe(pts);
  });
});

describe('IDRS — family history & total', () => {
  it('one parent = 10, both = 20', () => {
    expect(calcIdrs(base({ diabetesFamilyHistory: 'one' }))).toBe(10);
    expect(calcIdrs(base({ diabetesFamilyHistory: 'both' }))).toBe(20);
  });
  it('maximum score is 100', () => {
    expect(
      calcIdrs(
        base({ age: 50, sex: 'male', waistCm: 100, activity: 'sedentary', diabetesFamilyHistory: 'both' }),
      ),
    ).toBe(100);
  });
});

describe('IDRS — risk bands (<30 low, 30–50 moderate, ≥60 high)', () => {
  it.each([
    [20, 'low'],
    [30, 'moderate'],
    [50, 'moderate'],
    [60, 'high'],
    [100, 'high'],
  ] as const)('%i -> %s', (score, band) => {
    expect(idrsBand(score)).toBe(band);
  });
});

describe('Diabetes — fasting glucose overrides risk band', () => {
  it('FPG 99 does not escalate', () => {
    expect(scoreDiabetes(base({ fastingGlucose: 99 })).band).toBe('low');
  });
  it('FPG 100–125 (prediabetes) escalates low -> moderate', () => {
    expect(scoreDiabetes(base({ fastingGlucose: 110 })).band).toBe('moderate');
  });
  it('FPG ≥126 -> high', () => {
    expect(scoreDiabetes(base({ fastingGlucose: 126 })).band).toBe('high');
  });
});

describe('BMI — Asian/Indian cutoffs', () => {
  it.each([
    [18.4, 'underweight'],
    [18.5, 'normal'],
    [22.9, 'normal'],
    [23, 'overweight'],
    [24.9, 'overweight'],
    [25, 'obese'],
  ] as const)('BMI %d -> %s', (bmi, band) => {
    expect(bmiBand(bmi)).toBe(band);
  });
});

describe('Abdominal obesity — waist ≥90 (M) / ≥80 (F)', () => {
  it.each([
    ['male', 89, false],
    ['male', 90, true],
    ['female', 79, false],
    ['female', 80, true],
  ] as const)('%s %i -> %s', (sex, waistCm, expected) => {
    expect(hasAbdominalObesity(base({ sex, waistCm }))).toBe(expected);
  });
});

describe('Blood pressure — ACC/AHA 2017 classification', () => {
  it.each([
    [119, 79, 'normal'],
    [120, 79, 'elevated'], // 120–129 AND <80
    [129, 79, 'elevated'],
    [120, 80, 'stage1'], // diastolic ≥80 -> stage 1
    [130, 79, 'stage1'], // systolic ≥130
    [139, 89, 'stage1'],
    [140, 89, 'stage2'], // systolic ≥140
    [139, 90, 'stage2'], // diastolic ≥90
    [160, 100, 'stage2'],
  ] as const)('%i/%i -> %s', (sys, dia, band) => {
    expect(bpBand(sys, dia)).toBe(band);
  });
});

describe('Known-patient handling (already diagnosed / on treatment)', () => {
  it('known diabetes -> band present, danger', () => {
    const r = scoreDiabetes(base({ knownDiabetes: true }));
    expect(r.band).toBe('present');
    expect(r.severity).toBe('danger');
  });
  it('known hypertension with no reading -> present, warn', () => {
    const r = scoreBloodPressure(base({ knownHypertension: true }));
    expect(r.band).toBe('present');
    expect(r.severity).toBe('warn');
  });
  it('known hypertension but uncontrolled reading -> present, danger', () => {
    const r = scoreBloodPressure(
      base({ knownHypertension: true, bpKnown: true, systolic: 150, diastolic: 95 }),
    );
    expect(r.band).toBe('present');
    expect(r.severity).toBe('danger');
  });
  it('known hypertension, controlled reading -> present, warn', () => {
    const r = scoreBloodPressure(
      base({ knownHypertension: true, bpKnown: true, systolic: 118, diastolic: 76 }),
    );
    expect(r.band).toBe('present');
    expect(r.severity).toBe('warn');
  });
  it('treated diabetes + treated hypertension + abdominal obesity -> metabolic syndrome', () => {
    const r = computeResult(
      base({ sex: 'male', waistCm: 100, knownDiabetes: true, knownHypertension: true }),
    );
    expect(r.conditions.some((c) => c.key === 'metabolicSyndrome')).toBe(true);
  });
});

describe('Lipids — NCEP ATP III bands', () => {
  const lip = (o: Partial<AssessmentInput>) => scoreLipids(base(o)).band;
  it('total cholesterol', () => {
    expect(lip({ totalCholesterol: 199 })).toBe('normal');
    expect(lip({ totalCholesterol: 200 })).toBe('borderline');
    expect(lip({ totalCholesterol: 240 })).toBe('high');
  });
  it('LDL', () => {
    expect(lip({ ldl: 130 })).toBe('borderline');
    expect(lip({ ldl: 160 })).toBe('high');
  });
  it('low HDL (sex-specific)', () => {
    expect(lip({ hdl: 39 })).toBe('borderline');
    expect(lip({ sex: 'female', hdl: 49 })).toBe('borderline');
  });
  it('triglycerides', () => {
    expect(lip({ triglycerides: 150 })).toBe('borderline');
    expect(lip({ triglycerides: 200 })).toBe('high');
  });
  it('no labs -> unknown', () => {
    expect(lip({})).toBe('unknown');
  });
});

describe('Metabolic syndrome — harmonized South Asian (≥3 of 5)', () => {
  it('fires with abdominal obesity + raised BP + high glucose', () => {
    const r = computeResult(
      base({
        sex: 'male',
        waistCm: 100, // abdominal obesity
        bpKnown: true,
        systolic: 135,
        diastolic: 88, // ≥130/85
        fastingGlucose: 110, // ≥100
      }),
    );
    expect(r.conditions.some((c) => c.key === 'metabolicSyndrome')).toBe(true);
  });
  it('does NOT fire with only 2 components', () => {
    const r = computeResult(
      base({ sex: 'male', waistCm: 100, bpKnown: true, systolic: 135, diastolic: 88 }),
    );
    expect(r.conditions.some((c) => c.key === 'metabolicSyndrome')).toBe(false);
  });
});
