import { useEffect, useMemo, useState } from "react";
import Card from "./components/Card";
import Header from "./components/Header";
import Section from "./components/Section";
import { Lang, profile, t } from "./data/profile";

function ProjectPreviewImage({ demoUrl, fallbackImage, alt }: { demoUrl?: string; fallbackImage: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const normalized = demoUrl?.replace(/\/+$/, "") ?? "";
  const mshot = normalized ? `https://s.wordpress.com/mshots/v1/${encodeURIComponent(`${normalized}/`)}?w=1400` : "";
  const previewSrc =
    normalized && !failed
      ? mshot
      : fallbackImage;

  return <img src={previewSrc} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}

function FallbackImage({ src, fallback, alt }: { src: string; fallback: string; alt: string }) {
  const [errored, setErrored] = useState(false);
  return <img src={errored ? fallback : src} alt={alt} loading="lazy" onError={() => setErrored(true)} />;
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    const cached = localStorage.getItem("site-lang");
    return cached === "zh" || cached === "en" ? cached : "en";
  });
  const [activeWork, setActiveWork] = useState(0);

  useEffect(() => {
    localStorage.setItem("site-lang", lang);
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
    document.body.classList.toggle("lang-zh", lang === "zh");
    document.body.classList.toggle("lang-en", lang === "en");
  }, [lang]);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const title = useMemo(() => `${profile.basics.name[lang]} | ${lang === "zh" ? "作品集" : "Portfolio"}`, [lang]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="page-shell">
      <div className="ambient-glow ambient-glow-a" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-b" aria-hidden="true" />

      <Header lang={lang} onLangChange={setLang} />

      <main className="main-layout">
        <section className="hero-landing reveal" id="top">
          <div className="hero-left">
            <p className="hero-kicker">{lang === "zh" ? "你好，我是" : "Hello, I'm"}</p>
            <h1>{t(lang, profile.basics.fullName)}</h1>
            <p className="hero-tagline">{t(lang, profile.basics.heroTagline)}</p>
            <p className="hero-statement">{t(lang, profile.basics.heroStatement)}</p>
            <p className="hero-intro">{profile.summary[lang]}</p>
            <div className="hero-actions">
              <a className="btn-primary" href="#works">
                {lang === "zh" ? "查看作品" : "View Work"}
              </a>
              <a className="btn-ghost" href="#contact">
                {lang === "zh" ? "聯絡我" : "Contact Me"}
              </a>
            </div>
          </div>
          <div className="hero-right">
            <div className="identity-card">
              <p>{profile.basics.pronouns}</p>
              <p>{profile.basics.location[lang]}</p>
              <a href={`mailto:${profile.basics.email}`}>{profile.basics.email}</a>
              <a href={`tel:${profile.basics.phone.replace(/\s+/g, "")}`}>{profile.basics.phone}</a>
              {profile.basics.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <Section
          id="about"
          title={lang === "zh" ? "關於我" : "About Me"}
          subtitle={lang === "zh" ? "偏產品思維的工程實作者，重視可用性與體驗" : "Product-minded engineer focused on usability and visual clarity"}
        >
          <div className="about-layout reveal">
            <Card className="future-card">
              <h3>{t(lang, profile.aboutBelief.title)}</h3>
              <p>{t(lang, profile.aboutBelief.paragraph)}</p>
            </Card>
            <div className="about-side">
              <Card>
                <h3>{lang === "zh" ? "目前定位" : "Current Focus"}</h3>
                <p>{profile.summary[lang]}</p>
              </Card>
              <Card>
                <h3>{lang === "zh" ? "教育背景" : "Education"}</h3>
                <p>{profile.education.school[lang]}</p>
                <p>{profile.education.degree[lang]}</p>
                <p>{profile.education.graduation[lang]}</p>
                <p>{profile.education.honors[lang]}</p>
              </Card>
            </div>
          </div>
        </Section>

        <Section
          id="works"
          title={lang === "zh" ? "精選作品" : "Selected Works"}
          subtitle={lang === "zh" ? "先看實作成果，再看技術細節" : "Hands-on projects with direct visual and technical context"}
        >
          <div className="works-stack reveal">
            {profile.projects.map((project, index) => {
              const active = activeWork === index;
              return (
                <article
                  key={project.name.en}
                  className={`work-card ${project.galleryImages && project.galleryImages.length >= 2 ? "has-gallery" : ""} ${active ? "active" : ""}`}
                  onClick={() => setActiveWork(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveWork(index);
                    }
                  }}
                >
                  <div className="work-media">
                    {project.galleryImages && project.galleryImages.length >= 2 ? (
                      <div className="work-media-gallery">
                        <FallbackImage src={project.galleryImages[0]} fallback={project.image} alt={`${project.name[lang]} preview 1`} />
                        <FallbackImage src={project.galleryImages[1]} fallback={project.image} alt={`${project.name[lang]} preview 2`} />
                      </div>
                    ) : (
                      <ProjectPreviewImage
                        demoUrl={project.demoUrl}
                        fallbackImage={project.image}
                        alt={`${project.name[lang]} preview`}
                      />
                    )}
                  </div>
                  <div className="work-copy">
                    <div className="entry-head">
                      <h3>{project.name[lang]}</h3>
                      <p>{project.subtitle[lang]}</p>
                      <time>{project.period[lang]}</time>
                    </div>
                    <ul>
                      {project.bullets.map((bullet) => (
                        <li key={bullet.en}>{bullet[lang]}</li>
                      ))}
                    </ul>
                    <details className="expandable" open={active}>
                      <summary>{lang === "zh" ? "更多細節" : "More details"}</summary>
                      <div className="details-empty" />
                    </details>
                    <div className="work-links">
                      {project.projectLinks && project.projectLinks.length > 0
                        ? project.projectLinks.map((link) => (
                            <a
                              key={link.href + link.label.en}
                              className={link.tone === "primary" ? "btn-primary" : "btn-ghost"}
                              href={link.href}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(event) => event.stopPropagation()}
                            >
                              {t(lang, link.label)}
                            </a>
                          ))
                        : null}
                      {!project.projectLinks && project.demoUrl ? (
                        <a className="btn-primary" href={project.demoUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
                          {lang === "zh" ? "打開網站" : "Open Demo"}
                        </a>
                      ) : null}
                      {!project.projectLinks && project.repoUrl ? (
                        <a className="btn-ghost" href={project.repoUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
                          {lang === "zh" ? "程式碼" : "Repository"}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Section>

        <Section id="journey" title={lang === "zh" ? "經歷與研究" : "Journey & Research"}>
          <div className="timeline-grid reveal">
            {profile.experience.map((exp) => (
              <Card key={exp.title.en + exp.org.en}>
                <div className="entry-head">
                  <h3>{exp.title[lang]}</h3>
                  <p>
                    {exp.org[lang]}{exp.location ? ` · ${exp.location[lang]}` : ""}
                  </p>
                  <time>{exp.period[lang]}</time>
                </div>
                <ul>
                  {exp.bullets.map((bullet) => (
                    <li key={bullet.en}>{bullet[lang]}</li>
                  ))}
                </ul>
              </Card>
            ))}

            <Card>
              <div className="entry-head">
                <h3>{profile.researchTeam.teamRole[lang]}</h3>
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
                <h3>{profile.researchTeam.researchRole[lang]}</h3>
                <time>{profile.researchTeam.researchPeriod[lang]}</time>
              </div>
              <ul>
                {profile.researchTeam.researchBullets.map((bullet) => (
                  <li key={bullet.en}>{bullet[lang]}</li>
                ))}
              </ul>
            </Card>
          </div>
        </Section>

        <Section id="skills" title={lang === "zh" ? "技能與工具" : "Skills & Tooling"}>
          <div className="skills-grid reveal">
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

        <Section id="contact" title={lang === "zh" ? "聯絡方式" : "Contact"}>
          <Card className="reveal">
            <p>
              {lang === "zh"
                ? "想聊專案合作、實習、全職機會，或一起做有趣的產品，歡迎直接聯絡我。"
                : "Open to internships, full-time opportunities, and product collaborations."}
            </p>
            <div className="contact-list">
              <p className="contact-item">
                <strong>{lang === "zh" ? "Email：" : "Email: "}</strong>
                <a href={`mailto:${profile.basics.email}`}>{profile.basics.email}</a>
              </p>
              <p className="contact-item">
                <strong>{lang === "zh" ? "電話：" : "Phone: "}</strong>
                <a href={`tel:${profile.basics.phone.replace(/\s+/g, "")}`}>{profile.basics.phone}</a>
              </p>
              <p className="contact-item">
                <strong>LinkedIn: </strong>
                <a href="https://www.linkedin.com/in/yichenlin-lyc/" target="_blank" rel="noreferrer">
                  linkedin.com/in/yichenlin-lyc
                </a>
              </p>
            </div>
            <p className="language-line">
              <strong>{lang === "zh" ? "語言能力：" : "Languages: "}</strong>
              {profile.languages[lang]}
            </p>
          </Card>
        </Section>
      </main>
    </div>
  );
}
