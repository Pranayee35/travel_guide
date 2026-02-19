import { LANGUAGES } from "../config/languages";

export default function MultilingualInput({ label, name, value = {}, onChange }) {
  const val = typeof value === "object" && value !== null ? value : { en: value || "" };
  const handleChange = (lang, v) => {
    onChange({ ...val, [lang]: v });
  };
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-slate-600 mb-2">{label}</label>}
      {LANGUAGES.map((lang) => (
        <div key={lang.code} className="mb-2">
          <span className="text-xs text-slate-500 w-8 inline-block">{lang.code}</span>
          <input
            type="text"
            value={val[lang.code] || ""}
            onChange={(e) => handleChange(lang.code, e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder={`${label} (${lang.label})`}
          />
        </div>
      ))}
    </div>
  );
}
