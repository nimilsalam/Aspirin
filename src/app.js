import {
  calculateDailyHealthScore,
  calculateInitialHealthProfile,
  getRecommendations
} from "./healthLogic.js";

const signupForm = document.getElementById("signup-form");
const dailyForm = document.getElementById("daily-form");
const initialResult = document.getElementById("initial-result");
const dailyResult = document.getElementById("daily-result");
const recommendationsList = document.getElementById("recommendations-list");
const qrcodeImg = document.getElementById("qrcode-img");
const aiForm = document.getElementById("ai-form");
const aiResponse = document.getElementById("ai-response");

renderQrCode();

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const profile = {
    age: Number(signupForm.age.value),
    heightCm: Number(signupForm.heightCm.value),
    weightKg: Number(signupForm.weightKg.value),
    hasDiabetes: signupForm.hasDiabetes.checked,
    hasHypertension: signupForm.hasHypertension.checked,
    usesTobacco: signupForm.usesTobacco.checked,
    frequentAlcohol: signupForm.frequentAlcohol.checked
  };

  const result = calculateInitialHealthProfile(profile);
  const recommendations = getRecommendations(result.risks);
  localStorage.setItem("aspirinProfile", JSON.stringify(result));
  localStorage.setItem("aspirinRecommendations", JSON.stringify(recommendations));
  renderInitialResult(result, recommendations);
});

dailyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const dailyHabits = {
    walked30Minutes: dailyForm.walked30Minutes.checked,
    ateVegetablesAndFiber: dailyForm.ateVegetablesAndFiber.checked,
    avoidedSugaryDrinks: dailyForm.avoidedSugaryDrinks.checked,
    lowSaltMeals: dailyForm.lowSaltMeals.checked,
    tookMedicinesOnTime: dailyForm.tookMedicinesOnTime.checked,
    drinkWaterAdequately: dailyForm.drinkWaterAdequately.checked,
    slept7Hours: dailyForm.slept7Hours.checked,
    didStressRelief: dailyForm.didStressRelief.checked
  };

  const score = calculateDailyHealthScore(dailyHabits);
  dailyResult.textContent = `Today's healthy habits score: ${score}/100`;
});

aiForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  aiResponse.textContent = "Fetching response...";

  const endpoint = aiForm.endpoint.value.trim();
  const apiKey = aiForm.apiKey.value.trim();
  const question = aiForm.question.value.trim();

  if (!endpoint || !question) {
    aiResponse.textContent = "Add API endpoint and question to use a free AI API.";
    return;
  }

  try {
    const headers = {
      "Content-Type": "application/json"
    };
    if (apiKey) headers["X-API-Key"] = apiKey;

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        prompt: `You are a rural India health coach. Give practical awareness for diabetes, hypertension and prevention. Question: ${question}`
      })
    });

    if (!response.ok) throw new Error(`Request failed (${response.status})`);

    const data = await response.json();
    aiResponse.textContent =
      data.response || data.text || JSON.stringify(data, null, 2).slice(0, 600);
  } catch (error) {
    aiResponse.textContent = `Could not fetch AI guidance: ${error.message}`;
  }
});

function renderInitialResult(result, recommendations) {
  initialResult.textContent = `Initial health score: ${result.score}/100${
    result.bmi ? ` (BMI: ${result.bmi})` : ""
  }`;

  recommendationsList.innerHTML = "";
  recommendations.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    recommendationsList.appendChild(li);
  });
}

function renderQrCode() {
  const data = encodeURIComponent(window.location.href);
  qrcodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data}`;
  qrcodeImg.alt = "QR code for this health coach page";
}
