import { DEFAULT_LANG, SUPPORTED_LANGS } from "../config/constants.js";

/**
 * Get translated value from multilingual object.
 * @param {Object} obj - { en: "...", hi: "...", ... }
 * @param {string} lang - requested language
 * @returns {string}
 */
export function getTranslated(obj, lang) {
  if (!obj || typeof obj !== "object") return "";
  const l = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
  return obj[l] || obj[DEFAULT_LANG] || obj.en || Object.values(obj)[0] || "";
}

/**
 * Apply translation to document: replace multilingual fields with single string for requested lang.
 * @param {Object} doc - mongoose document or plain object
 * @param {string[]} fields - field names that are multilingual
 * @param {string} lang
 */
export function translateDoc(doc, fields, lang) {
  if (!doc) return doc;
  const d = doc.toObject ? doc.toObject() : { ...doc };
  for (const field of fields) {
    if (d[field] && typeof d[field] === "object" && !Array.isArray(d[field])) {
      d[field] = getTranslated(d[field], lang);
    }
  }
  return d;
}

/**
 * Translate array of docs.
 */
export function translateList(list, fields, lang) {
  return (list || []).map((doc) => translateDoc(doc, fields, lang));
}
