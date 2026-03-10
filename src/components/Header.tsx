import { Lang, navLabels, profile, t } from "../data/profile";
import LanguageToggle from "./LanguageToggle";

type HeaderProps = {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
};

const navOrder = ["summary", "skills", "experience", "projects", "research", "contact"];

export default function Header({ lang, onLangChange }: HeaderProps) {
  return (
    <header className="site-header fade-in">
      <div className="brand-block">
        <p className="name-line">{t(lang, profile.basics.fullName)}</p>
        <p className="meta-line">
          {profile.basics.pronouns} · {profile.basics.location[lang]}
        </p>
      </div>
      <nav className="top-nav" aria-label="Primary">
        {navOrder.map((id) => (
          <a key={id} href={`#${id}`}>
            {t(lang, navLabels[id])}
          </a>
        ))}
      </nav>
      <LanguageToggle lang={lang} onChange={onLangChange} />
    </header>
  );
}
