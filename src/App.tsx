import { useEffect, useMemo, useState } from "react";
import Card from "./components/Card";
import Header from "./components/Header";
import Section from "./components/Section";
import { Lang, profile, t } from "./data/profile";

function splitBullets<T>(items: T[], keep = 2) {
  return {
    preview: items.slice(0, keep),
    extra: items.slice(keep),
  };
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    const cached = localStorage.getItem("site-lang");
    return cached === "zh" || cached === "en" ? cached : "en";
  });

  useEffect(() => {
    localStorage.setItem("site-lang", lang);
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
    document.body.classList.toggle("lang-zh", lang === "zh");
    document.body.classList.toggle("lang-en", lang === "en");
  }, [lang]);

  const title = useMemo(
    () => `${profile.basics.name[lang]} | ${lang === "zh" ? "個人履歷" : "Profile"}`,
    [lang],
  );

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="page-shell">
      <div className="ambient-glow ambient-glow-a" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-b" aria-hidden="true" />

      <Header lang={lang} onLangChange={setLang} />

      <main className="main-layout">
        <section className="hero fade-in">
          <p className="hero-kicker">{lang === "zh" ? "個人簡介" : "Personal Profile"}</p>
          <h1>{t(lang, profile.basics.fullName)}</h1>
          <p className="hero-tagline">{t(lang, profile.basics.heroTagline)}</p>
          <div className="hero-contacts">
            <a href={`tel:${profile.basics.phone.replace(/\s+/g, "")}`}>{profile.basics.phone}</a>
            <a href={`mailto:${profile.basics.email}`}>{profile.basics.email}</a>
            {profile.basics.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </section>

        <Section
          id="summary"
          title={lang === "zh" ? "專業摘要" : "Professional Summary"}
          subtitle={lang === "zh" ? "聚焦 UI、產品落地與跨端整合" : "UI-focused builder with cross-platform execution"}
        >
          <Card>
            <p>{profile.summary[lang]}</p>
          </Card>
          <Card>
            <h3>{lang === "zh" ? "教育背景" : "Education"}</h3>
            <p>{profile.education.school[lang]}</p>
            <p>{profile.education.degree[lang]}</p>
            <p>{profile.education.graduation[lang]}</p>
            <p>{profile.education.honors[lang]}</p>
          </Card>
        </Section>

        <Section id="skills" title={lang === "zh" ? "技能矩陣" : "Skills Matrix"}>
          <div className="skills-grid">
            {profile.skills.map((group) => (
              <Card key={group.title.en}>
                <h3>{group.title[lang]}</h3>
                <div className="chip-list">
                  {group.items.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="experience" title={lang === "zh" ? "工作經歷" : "Professional Experience"}>
          <div className="timeline-grid">
            {profile.experience.map((exp) => {
              const parts = splitBullets(exp.bullets);
              return (
                <Card key={exp.title.en + exp.org.en}>
                  <div className="entry-head">
                    <h3>{exp.title[lang]}</h3>
                    <p>
                      {exp.org[lang]}{exp.location ? ` · ${exp.location[lang]}` : ""}
                    </p>
                    <time>{exp.period[lang]}</time>
                  </div>
                  <ul>
                    {parts.preview.map((bullet) => (
                      <li key={bullet.en}>{bullet[lang]}</li>
                    ))}
                  </ul>
                  {parts.extra.length > 0 ? (
                    <details className="expandable">
                      <summary>{lang === "zh" ? "展開更多" : "Show more"}</summary>
                      <ul>
                        {parts.extra.map((bullet) => (
                          <li key={bullet.en}>{bullet[lang]}</li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </Card>
              );
            })}
          </div>
        </Section>

        <Section id="projects" title={lang === "zh" ? "技術專案" : "Selected Projects"}>
          <div className="timeline-grid">
            {profile.projects.map((project) => {
              const parts = splitBullets(project.bullets);
              return (
                <Card key={project.name.en}>
                  <div className="entry-head">
                    <h3>{project.name[lang]}</h3>
                    <p>{project.subtitle[lang]}</p>
                    <time>{project.period[lang]}</time>
                  </div>
                  <ul>
                    {parts.preview.map((bullet) => (
                      <li key={bullet.en}>{bullet[lang]}</li>
                    ))}
                  </ul>
                  {parts.extra.length > 0 ? (
                    <details className="expandable">
                      <summary>{lang === "zh" ? "展開更多" : "Show more"}</summary>
                      <ul>
                        {parts.extra.map((bullet) => (
                          <li key={bullet.en}>{bullet[lang]}</li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </Card>
              );
            })}
          </div>
        </Section>

        <Section id="research" title={lang === "zh" ? "研究與工程團隊" : "Research & Engineering Team"}>
          <div className="timeline-grid">
            <Card>
              <div className="entry-head">
                <h3>{profile.researchTeam.teamTitle[lang]}</h3>
                <p>{profile.researchTeam.teamRole[lang]}</p>
                <time>{profile.researchTeam.teamPeriod[lang]}</time>
              </div>
              <ul>
                {profile.researchTeam.teamBullets.map((bullet) => (
                  <li key={bullet.en}>{bullet[lang]}</li>
                ))}
              </ul>
            </Card>
            <Card>
              <div className="entry-head">
                <h3>{profile.researchTeam.researchTitle[lang]}</h3>
                <p>{profile.researchTeam.researchRole[lang]}</p>
                <time>{profile.researchTeam.researchPeriod[lang]}</time>
              </div>
              <ul>
                {profile.researchTeam.researchBullets.map((bullet) => (
                  <li key={bullet.en}>{bullet[lang]}</li>
                ))}
              </ul>
              <p className="language-line">
                <strong>{lang === "zh" ? "語言能力：" : "Languages: "}</strong>
                {profile.languages[lang]}
              </p>
            </Card>
          </div>
        </Section>

        <Section id="contact" title={lang === "zh" ? "聯絡方式" : "Contact"}>
          <Card>
            <p>
              {lang === "zh"
                ? "歡迎透過 Email 或 LinkedIn 聯絡我，討論軟體開發、產品實作或合作機會。"
                : "Reach out via email or LinkedIn for software, product, and collaboration opportunities."}
            </p>
            <div className="contact-actions">
              <a className="btn-primary" href={`mailto:${profile.basics.email}`}>
                {lang === "zh" ? "寄送 Email" : "Send Email"}
              </a>
              {profile.basics.links.map((link) => (
                <a key={link.href} className="btn-ghost" href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </Card>
        </Section>
      </main>
    </div>
  );
}
