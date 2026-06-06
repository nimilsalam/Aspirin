import { assessHealth, getRecommendationKeys, getVerdictKey, getTopPriority } from "./clinical.js";
import { LANGUAGES, t, categoryKey } from "./i18n.js";

const STORAGE_LANG = "aspirinLang";
const STORAGE_VALUES = "aspirinValues";
const STORAGE_UPDATED = "aspirinUpdated";

const screenLanguage = document.getElementById("screen-language");
const screenForm = document.getElementById("screen-form");
const form = document.getElementById("health-form");
const results = document.getElementById("results");
const metricsList = document.getElementById("metrics");
const recommendationsList = document.getElementById("recommendations-list");
const overallScoreEl = document.getElementById("overall-score");
const scoreRing = document.getElementById("score-ring");
const verdictEl = document.getElementById("verdict");
const focusEl = document.getElementById("focus");
const asOfEl = document.getElementById("as-of");
const rangeWarning = document.getElementById("range-warning");
const editValuesBtn = document.getElementById("edit-values");
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
  editValuesBtn.addEventListener("click", onEditValues);
  form.addEventListener("input", (event) => {
    if (event.target.matches('input[type="number"]')) validateRanges();
  });

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
    const updatedAt = Number(localStorage.getItem(STORAGE_UPDATED)) || null;
    renderResults(assessHealth(saved), updatedAt);
  } catch {
    /* ignore corrupt storage */
  }
}

// Highlights numeric inputs whose value is outside their min/max range.
// Returns true when every field is within range.
function validateRanges() {
  let allValid = true;
  form.querySelectorAll('input[type="number"]').forEach((input) => {
    const label = input.closest("label");
    const raw = input.value.trim();
    let invalid = false;
    if (raw !== "") {
      const n = Number(raw);
      const min = input.min === "" ? -Infinity : Number(input.min);
      const max = input.max === "" ? Infinity : Number(input.max);
      invalid = !Number.isFinite(n) || n < min || n > max;
    }
    if (label) label.classList.toggle("field-error", invalid);
    input.setAttribute("aria-invalid", invalid ? "true" : "false");
    if (invalid) allValid = false;
  });
  rangeWarning.classList.toggle("hidden", allValid);
  return allValid;
}

function onSubmit(event) {
  event.preventDefault();
  validateRanges();
  const values = readForm();
  const now = Date.now();
  localStorage.setItem(STORAGE_VALUES, JSON.stringify(values));
  localStorage.setItem(STORAGE_UPDATED, String(now));
  renderResults(assessHealth(values), now);
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

function onEditValues() {
  const firstSection = form.querySelector("details.section");
  if (firstSection) firstSection.open = true;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  const firstInput = form.querySelector("input, select");
  if (firstInput) firstInput.focus({ preventScroll: true });
}

function formatDate(timestamp) {
  if (!timestamp) return "";
  try {
    return new Date(timestamp).toLocaleDateString(currentLang, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return new Date(timestamp).toLocaleDateString();
  }
}

// Maps each metric to its condition-specific tip and numeric-cutoff context.
function metricDetail(metric, assessment) {
  const cutoffKey = {
    bmiLabel: "cutBmi",
    diabetesLabel: "cutDiabetes",
    bloodPressureLabel: "cutBloodPressure",
    lipidsLabel: "cutLipids"
  }[metric.labelKey];

  let tipKey;
  if (metric.category === "unknown") tipKey = "metricUnknownTip";
  else if (metric.risk <= 0) tipKey = "metricNormalTip";
  else {
    tipKey = {
      bmiLabel: "recWeight",
      diabetesLabel: "recDiabetes",
      bloodPressureLabel: "recHypertension",
      lipidsLabel: "recDyslipidemia"
    }[metric.labelKey];
  }
  return { tip: t(currentLang, tipKey), cutoff: t(currentLang, cutoffKey) };
}

function renderResults(assessment, updatedAt) {
  results.classList.remove("hidden");
  overallScoreEl.textContent = String(assessment.overallScore);

  asOfEl.textContent = updatedAt ? `${t(currentLang, "asOf")} ${formatDate(updatedAt)}` : "";

  const metrics = [
    {
      labelKey: "bmiLabel",
      label: t(currentLang, "bmiLabel"),
      value: assessment.bmi ?? "—",
      category: assessment.bmiCategory,
      risk: bmiRisk(assessment.bmiCategory)
    },
    {
      labelKey: "diabetesLabel",
      label: t(currentLang, "diabetesLabel"),
      value: "",
      category: assessment.diabetes.category,
      risk: assessment.diabetes.risk
    },
    {
      labelKey: "bloodPressureLabel",
      label: t(currentLang, "bloodPressureLabel"),
      value: "",
      category: assessment.bloodPressure.category,
      risk: assessment.bloodPressure.risk
    },
    {
      labelKey: "lipidsLabel",
      label: t(currentLang, "lipidsLabel"),
      value: "",
      category: assessment.lipids.category,
      risk: assessment.lipids.risk
    }
  ];

  // Colour the score ring to match the worst risk present.
  const worstRisk = metrics.reduce((max, m) => Math.max(max, m.risk), 0);
  scoreRing.className = `score-ring risk-${worstRisk}`;
  scoreRing.setAttribute(
    "aria-label",
    `${t(currentLang, "overallScore")}: ${assessment.overallScore} / 100`
  );

  // Plain-language verdict.
  verdictEl.textContent = t(currentLang, getVerdictKey(assessment));

  // Single focus area (highest-risk condition).
  const focusKey = getTopPriority(assessment);
  focusEl.textContent = focusKey
    ? `${t(currentLang, "focusOn")}: ${t(currentLang, focusKey)}`
    : t(currentLang, "focusNone");

  metricsList.innerHTML = "";
  metrics.forEach((metric) => {
    const li = document.createElement("li");
    li.className = `metric risk-${metric.risk}`;

    const details = document.createElement("details");
    const summary = document.createElement("summary");

    const label = document.createElement("span");
    label.className = "metric-label";
    label.textContent = metric.label + (metric.value !== "" ? ` (${metric.value})` : "");

    const badge = document.createElement("span");
    badge.className = "metric-badge";
    badge.textContent = t(currentLang, categoryKey(metric.category));

    summary.append(label, badge);

    const body = document.createElement("div");
    body.className = "metric-detail";
    const { tip, cutoff } = metricDetail(metric, assessment);
    const tipP = document.createElement("p");
    tipP.className = "metric-tip";
    tipP.textContent = tip;
    const cutP = document.createElement("p");
    cutP.className = "metric-cutoff";
    cutP.textContent = cutoff;
    body.append(tipP, cutP);

    details.append(summary, body);
    li.appendChild(details);
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
