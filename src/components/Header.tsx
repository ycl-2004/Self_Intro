import { Lang, navLabels, profile, t } from "../data/profile";
import LanguageToggle from "./LanguageToggle";
import NameLockup from "./NameLockup";

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
        <p className="name-line">
          <NameLockup />
        </p>
        <div className="brand-meta-row">
          <p className="meta-line">
            {profile.basics.pronouns} · {profile.basics.location[lang]}
          </p>
          <div className="lang-toggle-mobile">
            <LanguageToggle lang={lang} onChange={onLangChange} />
          </div>
        </div>
      </a>
      <nav className="top-nav" aria-label="Primary">
        {navOrder.map((id) => (
          <a key={id} href={`#${id}`} className={activeSection === id ? "active" : ""}>
            {t(lang, navLabels[id])}
          </a>
        ))}
      </nav>
      <div className="lang-toggle-desktop">
        <LanguageToggle lang={lang} onChange={onLangChange} />
      </div>
    </header>
  );
}
