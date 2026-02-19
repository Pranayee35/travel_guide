import { SUPPORTED_LANGS, DEFAULT_LANG } from "../config/constants.js";

export function language(req, res, next) {
  const lang = req.query.lang || req.headers["accept-language"]?.slice(0, 2) || DEFAULT_LANG;
  req.lang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
  next();
}
