const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function getBmi(heightCm, weightKg) {
  const heightM = Number(heightCm) / 100;
  if (!heightM || heightM <= 0 || !weightKg || weightKg <= 0) {
    return null;
  }
  return Number((Number(weightKg) / (heightM * heightM)).toFixed(1));
}

export function calculateInitialHealthProfile(profile) {
  const bmi = getBmi(profile.heightCm, profile.weightKg);
  const age = Number(profile.age) || 0;
  let score = 100;

  if (age >= 45) score -= 10;
  else if (age >= 30) score -= 5;

  if (profile.hasDiabetes) score -= 20;
  if (profile.hasHypertension) score -= 20;
  if (profile.usesTobacco) score -= 15;
  if (profile.frequentAlcohol) score -= 10;

  if (bmi !== null) {
    if (bmi >= 30) score -= 20;
    else if (bmi >= 25) score -= 10;
    else if (bmi < 18.5) score -= 8;
  }

  return {
    score: clamp(score, 0, 100),
    bmi,
    risks: getRiskFlags({ ...profile, age, bmi })
  };
}

export function calculateDailyHealthScore(dailyHabits) {
  let score = 35;
  if (dailyHabits.walked30Minutes) score += 15;
  if (dailyHabits.ateVegetablesAndFiber) score += 10;
  if (dailyHabits.avoidedSugaryDrinks) score += 12;
  if (dailyHabits.lowSaltMeals) score += 8;
  if (dailyHabits.tookMedicinesOnTime) score += 12;
  if (dailyHabits.drinkWaterAdequately) score += 8;
  if (dailyHabits.slept7Hours) score += 10;
  if (dailyHabits.didStressRelief) score += 10;
  return clamp(score, 0, 100);
}

export function getRecommendations(profileWithRisks) {
  const recs = [
    "Follow a balanced Indian plate: half vegetables, one quarter protein, one quarter whole grains.",
    "Stay active for at least 30 minutes daily with walking, cycling, or farming-friendly movement.",
    "Avoid tobacco in all forms and limit alcohol."
  ];

  if (profileWithRisks.diabetesRisk) {
    recs.push(
      "Prefer low glycemic foods (millets, dal, vegetables) and reduce sweets/sugary beverages."
    );
  }

  if (profileWithRisks.hypertensionRisk) {
    recs.push(
      "Reduce salt intake (aim under 5g/day), avoid packaged snacks, and monitor blood pressure regularly."
    );
  }

  if (profileWithRisks.highBmiRisk) {
    recs.push("Work toward gradual weight reduction through portion control and daily physical activity.");
  }

  if (profileWithRisks.ageRisk) {
    recs.push("Schedule regular checkups for blood sugar and blood pressure at nearby PHC/clinic.");
  }

  return recs;
}

function getRiskFlags(profile) {
  return {
    diabetesRisk: Boolean(profile.hasDiabetes || profile.bmi >= 25 || profile.age >= 35),
    hypertensionRisk: Boolean(profile.hasHypertension || profile.age >= 35),
    highBmiRisk: Boolean(profile.bmi >= 25),
    ageRisk: Boolean(profile.age >= 45)
  };
}
