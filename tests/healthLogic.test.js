import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateDailyHealthScore,
  calculateInitialHealthProfile,
  getBmi
} from "../src/healthLogic.js";

test("getBmi computes BMI with one decimal", () => {
  assert.equal(getBmi(170, 70), 24.2);
});

test("initial profile reduces score for risk factors", () => {
  const result = calculateInitialHealthProfile({
    age: 50,
    heightCm: 160,
    weightKg: 85,
    hasDiabetes: true,
    hasHypertension: true,
    usesTobacco: true,
    frequentAlcohol: false
  });

  assert.equal(result.score, 15);
  assert.equal(result.risks.diabetesRisk, true);
  assert.equal(result.risks.hypertensionRisk, true);
});

test("daily score increases with healthy habits", () => {
  const score = calculateDailyHealthScore({
    walked30Minutes: true,
    ateVegetablesAndFiber: true,
    avoidedSugaryDrinks: true,
    lowSaltMeals: true,
    tookMedicinesOnTime: true,
    drinkWaterAdequately: true,
    slept7Hours: true,
    didStressRelief: true
  });

  assert.equal(score, 100);
});
