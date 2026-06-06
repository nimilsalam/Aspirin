// Clinical classification based on widely published numeric cutoffs.
// Sources of the numeric thresholds (facts, not copyrighted text):
// - BMI for Asian/Indian population (WHO Asia-Pacific / Indian consensus)
// - Diabetes: ADA / WHO fasting plasma glucose and HbA1c cutoffs
// - Blood pressure: JNC / WHO classification
// - Lipids: NCEP ATP III

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

export function getBmi(heightCm, weightKg) {
  const heightM = toNumber(heightCm) / 100;
  const weight = toNumber(weightKg);
  if (!heightM || heightM <= 0 || !weight || weight <= 0) {
    return null;
  }
  return Number((weight / (heightM * heightM)).toFixed(1));
}

// Asian/Indian BMI cutoffs.
export function classifyBmi(bmi) {
  if (bmi === null) return { category: "unknown", risk: 0 };
  if (bmi < 18.5) return { category: "underweight", risk: 1 };
  if (bmi < 23) return { category: "normal", risk: 0 };
  if (bmi < 25) return { category: "overweight", risk: 1 };
  return { category: "obese", risk: 2 };
}

// Diabetes status using fasting plasma glucose (mg/dL) and/or HbA1c (%).
export function classifyDiabetes({ fastingGlucose, hba1c, diagnosed } = {}) {
  const fpg = toNumber(fastingGlucose);
  const a1c = toNumber(hba1c);

  let category = "unknown";
  let risk = 0;

  const fpgCategory =
    fpg === null ? null : fpg >= 126 ? "diabetes" : fpg >= 100 ? "prediabetes" : "normal";
  const a1cCategory =
    a1c === null ? null : a1c >= 6.5 ? "diabetes" : a1c >= 5.7 ? "prediabetes" : "normal";

  const order = { normal: 0, prediabetes: 1, diabetes: 2 };
  const candidates = [fpgCategory, a1cCategory].filter(Boolean);
  if (candidates.length) {
    category = candidates.reduce((worst, c) => (order[c] > order[worst] ? c : worst));
    risk = order[category];
  }

  if (diagnosed && order[category] < 2) {
    category = "diabetes";
    risk = 2;
  }

  return { category, risk };
}

// Blood pressure classification using systolic/diastolic in mmHg.
export function classifyBloodPressure({ systolic, diastolic, diagnosed } = {}) {
  const sbp = toNumber(systolic);
  const dbp = toNumber(diastolic);

  let category = "unknown";
  let risk = 0;

  if (sbp !== null || dbp !== null) {
    const s = sbp ?? 0;
    const d = dbp ?? 0;
    if (s >= 140 || d >= 90) {
      category = "hypertension";
      risk = 2;
    } else if (s >= 120 || d >= 80) {
      category = "elevated";
      risk = 1;
    } else {
      category = "normal";
      risk = 0;
    }
  }

  if (diagnosed && risk < 2) {
    category = "hypertension";
    risk = 2;
  }

  return { category, risk };
}

// Dyslipidemia using NCEP ATP III cutoffs (mg/dL).
export function classifyLipids({
  totalCholesterol,
  ldl,
  hdl,
  triglycerides,
  sex
} = {}) {
  const tc = toNumber(totalCholesterol);
  const ldlVal = toNumber(ldl);
  const hdlVal = toNumber(hdl);
  const tg = toNumber(triglycerides);

  const lowHdlThreshold = sex === "female" ? 50 : 40;
  let risk = 0;
  const flags = [];

  if (tc !== null) {
    if (tc >= 240) {
      risk = Math.max(risk, 2);
      flags.push("highTotalCholesterol");
    } else if (tc >= 200) {
      risk = Math.max(risk, 1);
      flags.push("borderlineTotalCholesterol");
    }
  }

  if (ldlVal !== null) {
    if (ldlVal >= 160) {
      risk = Math.max(risk, 2);
      flags.push("highLdl");
    } else if (ldlVal >= 130) {
      risk = Math.max(risk, 1);
      flags.push("borderlineLdl");
    }
  }

  if (hdlVal !== null && hdlVal < lowHdlThreshold) {
    risk = Math.max(risk, 1);
    flags.push("lowHdl");
  }

  if (tg !== null) {
    if (tg >= 200) {
      risk = Math.max(risk, 2);
      flags.push("highTriglycerides");
    } else if (tg >= 150) {
      risk = Math.max(risk, 1);
      flags.push("borderlineTriglycerides");
    }
  }

  const anyValueProvided = [tc, ldlVal, hdlVal, tg].some((v) => v !== null);
  let category = "unknown";
  if (anyValueProvided) {
    category = risk >= 2 ? "dyslipidemia" : risk === 1 ? "borderline" : "normal";
  }

  return { category, risk, flags };
}

// Convert a 0..2 risk to a 0..100 sub-score (higher is healthier).
function riskToScore(risk) {
  if (risk <= 0) return 100;
  if (risk === 1) return 60;
  return 25;
}

export function assessHealth(input = {}) {
  const bmi = getBmi(input.heightCm, input.weightKg);
  const bmiResult = classifyBmi(bmi);
  const diabetes = classifyDiabetes({
    fastingGlucose: input.fastingGlucose,
    hba1c: input.hba1c,
    diagnosed: input.hasDiabetes
  });
  const bloodPressure = classifyBloodPressure({
    systolic: input.systolic,
    diastolic: input.diastolic,
    diagnosed: input.hasHypertension
  });
  const lipids = classifyLipids({
    totalCholesterol: input.totalCholesterol,
    ldl: input.ldl,
    hdl: input.hdl,
    triglycerides: input.triglycerides,
    sex: input.sex
  });

  const overallScore = Math.round(
    riskToScore(diabetes.risk) * 0.3 +
      riskToScore(bloodPressure.risk) * 0.3 +
      riskToScore(lipids.risk) * 0.25 +
      riskToScore(bmiResult.risk) * 0.15
  );

  return {
    bmi,
    bmiCategory: bmiResult.category,
    diabetes,
    bloodPressure,
    lipids,
    overallScore,
    dataEntered:
      bmiResult.category !== "unknown" ||
      diabetes.category !== "unknown" ||
      bloodPressure.category !== "unknown" ||
      lipids.category !== "unknown"
  };
}

// Maps the overall score to a plain-language verdict translation key.
export function getVerdictKey(assessment) {
  if (!assessment || assessment.dataEntered === false) return "verdictUnknown";
  const score = assessment.overallScore;
  if (score >= 85) return "verdictGood";
  if (score >= 60) return "verdictFair";
  return "verdictPoor";
}

// Returns the highest-risk condition so the UI can surface a single focus area.
// Ties are broken by clinical weighting: diabetes > blood pressure > lipids > BMI.
export function getTopPriority(assessment) {
  const conditions = [
    { key: "diabetesLabel", risk: assessment.diabetes.risk },
    { key: "bloodPressureLabel", risk: assessment.bloodPressure.risk },
    { key: "lipidsLabel", risk: assessment.lipids.risk },
    { key: "bmiLabel", risk: classifyBmi(assessment.bmi).risk }
  ];
  const worst = conditions.reduce((a, b) => (b.risk > a.risk ? b : a));
  return worst.risk >= 1 ? worst.key : null;
}

// Returns translation keys (resolved to text in the UI layer) so that
// the same recommendation logic works for English and Malayalam.
export function getRecommendationKeys(assessment) {
  const keys = ["recBalancedPlate", "recActivity", "recAvoidTobacco"];

  if (assessment.diabetes.risk >= 1) keys.push("recDiabetes");
  if (assessment.bloodPressure.risk >= 1) keys.push("recHypertension");
  if (assessment.lipids.risk >= 1) keys.push("recDyslipidemia");
  if (assessment.bmiCategory === "overweight" || assessment.bmiCategory === "obese") {
    keys.push("recWeight");
  }

  return keys;
}
