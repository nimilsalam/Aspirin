// Core domain types for the Aspirin health-coach assessment.

export type Language = 'en' | 'ml';

export type Sex = 'male' | 'female';

/** Physical-activity self-report (maps to IDRS + lifestyle scoring). */
export type ActivityLevel =
  | 'vigorous' // regular exercise AND/OR strenuous work
  | 'moderate' // some exercise or moderate work
  | 'mild' // light activity only
  | 'sedentary'; // little to no activity

export type DietPattern = 'healthy' | 'mixed' | 'poor';

export type TobaccoUse = 'never' | 'former' | 'current';

export type AlcoholUse = 'none' | 'within' | 'harmful';

export type FamilyHistory = 'none' | 'one' | 'both';

export type YesNoUnknown = 'yes' | 'no' | 'unknown';

/** Everything the user enters during the wizard. */
export interface AssessmentInput {
  // Profile
  age: number;
  sex: Sex;
  // Body
  heightCm: number;
  weightKg: number;
  waistCm?: number;
  // Known diagnoses (already told by a doctor / on treatment)
  knownDiabetes: boolean;
  knownHypertension: boolean;
  // Blood pressure (optional measured values)
  bpKnown: boolean;
  systolic?: number;
  diastolic?: number;
  // Lifestyle
  activity: ActivityLevel;
  diet: DietPattern;
  fruitVegDaily: boolean; // ≥5 servings / day
  highSaltDiet: boolean;
  tobacco: TobaccoUse;
  alcohol: AlcoholUse;
  sleepHours: number;
  highStress: boolean;
  // Family history (of diabetes)
  diabetesFamilyHistory: FamilyHistory;
  // Optional labs
  fastingGlucose?: number; // mg/dL
  totalCholesterol?: number; // mg/dL
  hdl?: number; // mg/dL
  ldl?: number; // mg/dL
  triglycerides?: number; // mg/dL
}

// ---- Conditions & bands -----------------------------------------------------

export type ConditionKey =
  | 'weight'
  | 'diabetesRisk'
  | 'bloodPressure'
  | 'lipids'
  | 'physicalActivity'
  | 'diet'
  | 'tobacco'
  | 'alcohol'
  | 'metabolicSyndrome'
  | 'highCvdRisk';

/** Generic risk band used across conditions (not every band applies to every condition). */
export type RiskBand =
  | 'underweight'
  | 'normal'
  | 'overweight'
  | 'obese'
  | 'low'
  | 'moderate'
  | 'high'
  | 'elevated'
  | 'prehypertension'
  | 'stage1'
  | 'stage2'
  | 'borderline'
  | 'unknown'
  | 'adequate'
  | 'insufficient'
  | 'sedentary'
  | 'healthy'
  | 'needsImprovement'
  | 'poor'
  | 'never'
  | 'former'
  | 'current'
  | 'none'
  | 'within'
  | 'harmful'
  | 'present';

export type Severity = 'good' | 'info' | 'warn' | 'danger';

/** Result of scoring a single condition. */
export interface ConditionResult {
  key: ConditionKey;
  band: RiskBand;
  /** Optional numeric value to display (e.g. BMI 27.4, IDRS 60). */
  value?: number;
  /** Optional human label for the value (e.g. "140/90 mmHg"). */
  valueLabel?: string;
  severity: Severity;
}

/** The full computed result for one assessment. */
export interface AssessmentResult {
  /** Overall 0–100 health score (higher = healthier). */
  score: number;
  tier: ScoreTier;
  conditions: ConditionResult[];
}

export type ScoreTier = 'excellent' | 'good' | 'fair' | 'poor';

// ---- Feedback content & engine ---------------------------------------------

/** A structured weekly plan (diet or exercise) shown as a list. */
export interface PlanContent {
  heading: string;
  items: string[];
}

/**
 * A single feedback slot — the unit a clinician customizes.
 * Authored per (conditionKey, band) in the content registry.
 */
export interface FeedbackSlot {
  title: string;
  whatThisMeans: string;
  /** The clinician's tailor-made, spoken-style advice. Overwrite this freely. */
  doctorMessage: string;
  actionSteps: string[];
  dietPlan?: PlanContent;
  exercisePlan?: PlanContent;
  seeDoctor?: boolean;
  /** Optional link to the clinician's own voice recording for this case. */
  audioUrl?: string;
}

/** Content registry: registry[conditionKey][band] = FeedbackSlot. */
export type FeedbackRegistry = Partial<
  Record<ConditionKey, Partial<Record<RiskBand, FeedbackSlot>>>
>;

/** One fired feedback module, ready to render. */
export interface Outcome {
  key: ConditionKey;
  band: RiskBand;
  severity: Severity;
  /** Numeric rank used for ordering (higher = more urgent). */
  rank: number;
  result: ConditionResult;
  content: FeedbackSlot;
}

/** A persisted assessment record (one per completed assessment). */
export interface AssessmentRecord {
  id: string;
  /** ISO timestamp. */
  date: string;
  language: Language;
  input: AssessmentInput;
  result: AssessmentResult;
}
