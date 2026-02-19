import { LANGUAGES } from "../config/languages";

export default function LangTabs({ value, onChange, children }) {
  return (
    <div>
      <div className="flex gap-1 border-b border-slate-200 mb-4 overflow-x-auto">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => onChange(lang.code)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              value === lang.code
                ? "border-b-2 border-saffron text-saffron"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
