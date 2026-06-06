import { assessHealth, getRecommendationKeys } from "./clinical.js";
import { LANGUAGES, t, categoryKey } from "./i18n.js";

const STORAGE_LANG = "aspirinLang";
const STORAGE_VALUES = "aspirinValues";

const screenLanguage = document.getElementById("screen-language");
const screenForm = document.getElementById("screen-form");
const form = document.getElementById("health-form");
const results = document.getElementById("results");
const metricsList = document.getElementById("metrics");
const recommendationsList = document.getElementById("recommendations-list");
const overallScoreEl = document.getElementById("overall-score");
const changeLanguageBtn = document.getElementById("change-language");

let currentLang = "en";

init();

function init() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => selectLanguage(btn.dataset.lang));
  });

  changeLanguageBtn.addEventListener("click", () => {
    showScreen("language");
  });

  form.addEventListener("submit", onSubmit);

  const savedLang = localStorage.getItem(STORAGE_LANG);
  if (savedLang && LANGUAGES.includes(savedLang)) {
    selectLanguage(savedLang);
  }
}

function selectLanguage(lang) {
  currentLang = LANGUAGES.includes(lang) ? lang : "en";
  localStorage.setItem(STORAGE_LANG, currentLang);
  document.documentElement.lang = currentLang;
  applyTranslations();
  restoreValues();
  showScreen("form");
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(currentLang, el.dataset.i18n);
  });
}

function showScreen(name) {
  const isLanguage = name === "language";
  screenLanguage.classList.toggle("active", isLanguage);
  screenForm.classList.toggle("active", !isLanguage);
  window.scrollTo(0, 0);
}

function readForm() {
  const data = Object.fromEntries(new FormData(form).entries());
  return {
    age: data.age,
    sex: data.sex,
    heightCm: data.heightCm,
    weightKg: data.weightKg,
    fastingGlucose: data.fastingGlucose,
    hba1c: data.hba1c,
    systolic: data.systolic,
    diastolic: data.diastolic,
    totalCholesterol: data.totalCholesterol,
    ldl: data.ldl,
    hdl: data.hdl,
    triglycerides: data.triglycerides,
    hasDiabetes: form.hasDiabetes.checked,
    hasHypertension: form.hasHypertension.checked,
    usesTobacco: form.usesTobacco.checked
  };
}

function restoreValues() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_VALUES) || "null");
    if (!saved) return;
    Object.entries(saved).forEach(([key, value]) => {
      const field = form.elements[key];
      if (!field) return;
      if (field.type === "checkbox") field.checked = Boolean(value);
      else if (value !== null && value !== undefined) field.value = value;
    });
    renderResults(assessHealth(saved));
  } catch {
    /* ignore corrupt storage */
  }
}

function onSubmit(event) {
  event.preventDefault();
  const values = readForm();
  localStorage.setItem(STORAGE_VALUES, JSON.stringify(values));
  renderResults(assessHealth(values));
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderResults(assessment) {
  results.classList.remove("hidden");
  overallScoreEl.textContent = String(assessment.overallScore);

  const metrics = [
    {
      label: t(currentLang, "bmiLabel"),
      value: assessment.bmi ?? "—",
      category: assessment.bmiCategory,
      risk: bmiRisk(assessment.bmiCategory)
    },
    {
      label: t(currentLang, "diabetesLabel"),
      value: "",
      category: assessment.diabetes.category,
      risk: assessment.diabetes.risk
    },
    {
      label: t(currentLang, "bloodPressureLabel"),
      value: "",
      category: assessment.bloodPressure.category,
      risk: assessment.bloodPressure.risk
    },
    {
      label: t(currentLang, "lipidsLabel"),
      value: "",
      category: assessment.lipids.category,
      risk: assessment.lipids.risk
    }
  ];

  metricsList.innerHTML = "";
  metrics.forEach((metric) => {
    const li = document.createElement("li");
    li.className = `metric risk-${metric.risk}`;
    const label = document.createElement("span");
    label.className = "metric-label";
    label.textContent = metric.label + (metric.value !== "" ? ` (${metric.value})` : "");
    const badge = document.createElement("span");
    badge.className = "metric-badge";
    badge.textContent = t(currentLang, categoryKey(metric.category));
    li.append(label, badge);
    metricsList.appendChild(li);
  });

  recommendationsList.innerHTML = "";
  getRecommendationKeys(assessment).forEach((key) => {
    const li = document.createElement("li");
    li.textContent = t(currentLang, key);
    recommendationsList.appendChild(li);
  });
}

function bmiRisk(category) {
  if (category === "obese") return 2;
  if (category === "overweight" || category === "underweight") return 1;
  if (category === "unknown") return 0;
  return 0;
}
