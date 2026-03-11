import { Lang, navLabels, profile, t } from "../data/profile";
import LanguageToggle from "./LanguageToggle";

type HeaderProps = {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  activeSection?: string;
};

const navOrder = ["about", "works", "journey", "skills", "contact"];

export default function Header({ lang, onLangChange, activeSection }: HeaderProps) {
  return (
    <header className="site-header">
      <a className="brand-block" href="#top" aria-label={lang === "zh" ? "回到頁首" : "Back to top"}>
        <p className="name-line">{t(lang, profile.basics.fullName)}</p>
        <p className="meta-line">
          {profile.basics.pronouns} · {profile.basics.location[lang]}
        </p>
      </a>
      <nav className="top-nav" aria-label="Primary">
        {navOrder.map((id) => (
          <a key={id} href={`#${id}`} className={activeSection === id ? "active" : ""}>
            {t(lang, navLabels[id])}
          </a>
        ))}
      </nav>
      <LanguageToggle lang={lang} onChange={onLangChange} />
    </header>
  );
}
