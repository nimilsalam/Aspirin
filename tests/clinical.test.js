import test from "node:test";
import assert from "node:assert/strict";
import {
  getBmi,
  classifyBmi,
  classifyDiabetes,
  classifyBloodPressure,
  classifyLipids,
  assessHealth,
  getRecommendationKeys
} from "../src/clinical.js";

test("getBmi computes BMI with one decimal", () => {
  assert.equal(getBmi(170, 70), 24.2);
});

test("classifyBmi uses Asian/Indian cutoffs", () => {
  assert.equal(classifyBmi(17).category, "underweight");
  assert.equal(classifyBmi(22).category, "normal");
  assert.equal(classifyBmi(24).category, "overweight");
  assert.equal(classifyBmi(27).category, "obese");
});

test("classifyDiabetes uses FPG and HbA1c cutoffs and takes worst", () => {
  assert.equal(classifyDiabetes({ fastingGlucose: 90 }).category, "normal");
  assert.equal(classifyDiabetes({ fastingGlucose: 110 }).category, "prediabetes");
  assert.equal(classifyDiabetes({ fastingGlucose: 130 }).category, "diabetes");
  assert.equal(classifyDiabetes({ hba1c: 6.0 }).category, "prediabetes");
  assert.equal(
    classifyDiabetes({ fastingGlucose: 90, hba1c: 6.8 }).category,
    "diabetes"
  );
  assert.equal(classifyDiabetes({ fastingGlucose: 90, diagnosed: true }).category, "diabetes");
});

test("classifyBloodPressure uses JNC/WHO cutoffs", () => {
  assert.equal(classifyBloodPressure({ systolic: 118, diastolic: 76 }).category, "normal");
  assert.equal(classifyBloodPressure({ systolic: 125, diastolic: 82 }).category, "elevated");
  assert.equal(classifyBloodPressure({ systolic: 150, diastolic: 95 }).category, "hypertension");
  assert.equal(classifyBloodPressure({ diastolic: 92 }).category, "hypertension");
});

test("classifyLipids flags high values and low HDL by sex", () => {
  assert.equal(classifyLipids({ totalCholesterol: 180 }).category, "normal");
  assert.equal(classifyLipids({ totalCholesterol: 210 }).category, "borderline");
  assert.equal(classifyLipids({ ldl: 170 }).category, "dyslipidemia");
  assert.equal(classifyLipids({ hdl: 45, sex: "female" }).flags.includes("lowHdl"), true);
  assert.equal(classifyLipids({ hdl: 45, sex: "male" }).flags.includes("lowHdl"), false);
});

test("assessHealth returns an overall score in 0..100", () => {
  const healthy = assessHealth({
    heightCm: 170,
    weightKg: 65,
    fastingGlucose: 90,
    systolic: 118,
    diastolic: 76,
    totalCholesterol: 180,
    hdl: 55,
    triglycerides: 120
  });
  assert.equal(healthy.overallScore, 100);

  const atRisk = assessHealth({
    heightCm: 165,
    weightKg: 90,
    fastingGlucose: 140,
    systolic: 150,
    diastolic: 95,
    totalCholesterol: 250,
    triglycerides: 220
  });
  assert.ok(atRisk.overallScore < healthy.overallScore);
  assert.ok(atRisk.overallScore >= 0 && atRisk.overallScore <= 100);
});

test("getRecommendationKeys adds condition-specific guidance", () => {
  const assessment = assessHealth({
    heightCm: 165,
    weightKg: 90,
    fastingGlucose: 140,
    systolic: 150,
    diastolic: 95,
    totalCholesterol: 250
  });
  const keys = getRecommendationKeys(assessment);
  assert.ok(keys.includes("recDiabetes"));
  assert.ok(keys.includes("recHypertension"));
  assert.ok(keys.includes("recDyslipidemia"));
  assert.ok(keys.includes("recWeight"));
});
