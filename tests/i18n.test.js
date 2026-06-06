import test from "node:test";
import assert from "node:assert/strict";
import { LANGUAGES, translations, t, categoryKey } from "../src/i18n.js";

test("supports English and Malayalam", () => {
  assert.deepEqual(LANGUAGES, ["en", "ml"]);
});

test("both languages define the same keys", () => {
  const enKeys = Object.keys(translations.en).sort();
  const mlKeys = Object.keys(translations.ml).sort();
  assert.deepEqual(mlKeys, enKeys);
});

test("t falls back to English for missing keys", () => {
  assert.equal(t("ml", "english"), "English");
  assert.equal(t("xx", "calculate"), translations.en.calculate);
});

test("categoryKey builds the translation key", () => {
  assert.equal(categoryKey("diabetes"), "cat_diabetes");
  assert.equal(t("en", categoryKey("hypertension")), "High (hypertension)");
});
