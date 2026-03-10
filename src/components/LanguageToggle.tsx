import { Lang } from "../data/profile";

type LanguageToggleProps = {
  lang: Lang;
  onChange: (lang: Lang) => void;
};

export default function LanguageToggle({ lang, onChange }: LanguageToggleProps) {
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => onChange("en")}
        className={lang === "en" ? "active" : ""}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => onChange("zh")}
        className={lang === "zh" ? "active" : ""}
        aria-pressed={lang === "zh"}
      >
        中文
      </button>
    </div>
  );
}
