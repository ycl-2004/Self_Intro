import { useEffect, useMemo, useState } from "react";
import Card from "./components/Card";
import Header from "./components/Header";
import Section from "./components/Section";
import { Lang, profile, t, ProjectEntry } from "./data/profile";

function resolveAssetUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const clean = path.replace(/^\/+/, "");
  return `${import.meta.env.BASE_URL}${clean}`;
}

function categorizeProject(project: ProjectEntry): "web3" | "fullstack" | "native" | "game" {
  const raw = `${project.name.en} ${project.subtitle.en}`.toLowerCase();
  if (raw.includes("dao") || raw.includes("web3") || raw.includes("smart contract")) return "web3";
  if (raw.includes("todo") || raw.includes("macos") || raw.includes("tauri")) return "native";
  if (raw.includes("unity") || raw.includes("game")) return "game";
  return "fullstack";
}

function ProjectPreviewImage({ demoUrl, fallbackImage, alt }: { demoUrl?: string; fallbackImage: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const normalized = demoUrl?.replace(/\/+$/, "") ?? "";
  const mshot = normalized ? `https://s.wordpress.com/mshots/v1/${encodeURIComponent(`${normalized}/`)}?w=1400` : "";
  const fallbackSrc = resolveAssetUrl(fallbackImage);
  const previewSrc = normalized && !failed ? mshot : fallbackSrc;

  return <img src={previewSrc} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}

function FallbackImage({ src, fallback, alt }: { src: string; fallback: string; alt: string }) {
  const [errored, setErrored] = useState(false);
  const primary = resolveAssetUrl(src);
  const fallbackSrc = resolveAssetUrl(fallback);
  return <img src={errored ? fallbackSrc : primary} alt={alt} loading="lazy" onError={() => setErrored(true)} />;
}

type ProjectFilter = "all" | "web3" | "fullstack" | "native" | "game";

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    const cached = localStorage.getItem("site-lang");
    return cached === "zh" || cached === "en" ? cached : "en";
  });
  const [activeSection, setActiveSection] = useState("about");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showToTop, setShowToTop] = useState(false);
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>("all");
  const [projectSearch, setProjectSearch] = useState("");
  const [activeWorkKey, setActiveWorkKey] = useState(profile.projects[0]?.name.en ?? "");
  const [emailCopied, setEmailCopied] = useState(false);

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
      { threshold: 0.16 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const maxScrollable = Math.max(1, scrollHeight - clientHeight);
      setScrollProgress((scrollTop / maxScrollable) * 100);
      setShowToTop(scrollTop > 520);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const onMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      root.style.setProperty("--bg-mx", `${x.toFixed(2)}%`);
      root.style.setProperty("--bg-my", `${y.toFixed(2)}%`);
      root.style.setProperty("--bg-dx", `${((x - 50) / 50).toFixed(3)}`);
      root.style.setProperty("--bg-dy", `${((y - 50) / 50).toFixed(3)}`);
    };

    const onScrollDepth = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const maxScrollable = Math.max(1, scrollHeight - clientHeight);
      const progress = scrollTop / maxScrollable;
      root.style.setProperty("--bg-scroll", progress.toFixed(4));
    };

    onScrollDepth();
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScrollDepth, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScrollDepth);
    };
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: "-20% 0px -45% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const title = useMemo(() => `${profile.basics.name[lang]} | ${lang === "zh" ? "作品集" : "Portfolio"}`, [lang]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  const filterLabels: Record<ProjectFilter, { en: string; zh: string }> = {
    all: { en: "All", zh: "全部" },
    web3: { en: "Web3", zh: "Web3" },
    fullstack: { en: "Full Stack", zh: "全端" },
    native: { en: "Native", zh: "原生" },
    game: { en: "Game", zh: "遊戲" },
  };

  const filteredProjects = useMemo(() => {
    const keyword = projectSearch.trim().toLowerCase();

    return profile.projects.filter((project) => {
      const category = categorizeProject(project);
      const matchFilter = projectFilter === "all" || category === projectFilter;
      const source = `${project.name.en} ${project.name.zh} ${project.subtitle.en} ${project.subtitle.zh} ${project.bullets
        .map((b) => `${b.en} ${b.zh}`)
        .join(" ")}`.toLowerCase();
      const matchKeyword = keyword.length === 0 || source.includes(keyword);
      return matchFilter && matchKeyword;
    });
  }, [projectFilter, projectSearch]);

  useEffect(() => {
    if (filteredProjects.length === 0) return;
    const exists = filteredProjects.some((project) => project.name.en === activeWorkKey);
    if (!exists) {
      setActiveWorkKey(filteredProjects[0].name.en);
    }
  }, [filteredProjects, activeWorkKey]);

  const activeProjectIndex = filteredProjects.findIndex((project) => project.name.en === activeWorkKey);

  const moveActiveProject = (direction: "prev" | "next") => {
    if (filteredProjects.length === 0) return;
    const start = activeProjectIndex >= 0 ? activeProjectIndex : 0;
    const delta = direction === "next" ? 1 : -1;
    const nextIndex = (start + delta + filteredProjects.length) % filteredProjects.length;
    setActiveWorkKey(filteredProjects[nextIndex].name.en);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.basics.email);
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 1800);
    } catch {
      setEmailCopied(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="bg-interactive" aria-hidden="true">
        <span className="bg-blob bg-blob-a" />
        <span className="bg-blob bg-blob-b" />
        <span className="bg-blob bg-blob-c" />
      </div>

      <div className="scroll-progress" aria-hidden="true" style={{ width: `${scrollProgress}%` }} />

      <Header lang={lang} onLangChange={setLang} activeSection={activeSection} />

      <main className="main-layout">
        <section className="hero-shell reveal" id="top" aria-labelledby="hero-heading">
          <div className="hero-main">
            <p className="hero-kicker">{lang === "zh" ? "你好，我是" : "Hello, I'm"}</p>
            <h1 id="hero-heading">{t(lang, profile.basics.fullName)}</h1>
            <p className="hero-tagline">{t(lang, profile.basics.heroTagline)}</p>
            <p className="hero-statement">{t(lang, profile.basics.heroStatement)}</p>
            <p className="hero-intro">{profile.summary[lang]}</p>

            <div className="hero-metrics" aria-label={lang === "zh" ? "快速摘要" : "Quick summary"}>
              <p>
                <strong>{profile.projects.length}</strong> {lang === "zh" ? "個專案" : "projects"}
              </p>
              <p>
                <strong>{profile.experience.length + 2}</strong> {lang === "zh" ? "段經歷" : "experience blocks"}
              </p>
              <p>
                <strong>{profile.skills.length}</strong> {lang === "zh" ? "組技能" : "skill groups"}
              </p>
            </div>

            <div className="hero-actions">
              <a className="btn-primary" href="#works">
                {lang === "zh" ? "查看作品" : "View Work"}
              </a>
              <a className="btn-ghost" href="#contact">
                {lang === "zh" ? "聯絡我" : "Contact Me"}
              </a>
            </div>
          </div>

          <aside className="hero-aside" aria-label={lang === "zh" ? "聯絡資訊" : "Contact details"}>
            <div className="identity-block">
              <p>{profile.basics.pronouns}</p>
              <p>{profile.basics.location[lang]}</p>
            </div>

            <div className="identity-links">
              <a href={`mailto:${profile.basics.email}`}>{profile.basics.email}</a>
              <a href={`tel:${profile.basics.phone.replace(/\s+/g, "")}`}>{profile.basics.phone}</a>
              {profile.basics.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>

            <button type="button" className="mini-action" onClick={copyEmail}>
              {emailCopied
                ? lang === "zh"
                  ? "已複製 Email"
                  : "Email Copied"
                : lang === "zh"
                  ? "複製 Email"
                  : "Copy Email"}
            </button>
          </aside>
        </section>

        <Section
          id="about"
          title={lang === "zh" ? "關於我" : "About"}
          subtitle={lang === "zh" ? "產品思維導向的工程實作者，重視可用性、清晰度與交付品質。" : "Product-minded builder focused on usability, clarity, and reliable delivery."}
        >
          <div className="about-grid reveal">
            <Card className="about-belief">
              <h3>{t(lang, profile.aboutBelief.title)}</h3>
              <p>{t(lang, profile.aboutBelief.paragraph)}</p>
            </Card>

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
        </Section>

        <Section
          id="works"
          title={lang === "zh" ? "精選作品" : "Selected Projects"}
          subtitle={lang === "zh" ? "以成果為主，快速看懂問題、做法與產出。" : "Outcome-first projects with clear problem, approach, and deliverable signals."}
        >
          <div className="works-toolbar reveal">
            <label className="search-field" aria-label={lang === "zh" ? "搜尋作品" : "Search projects"}>
              <span>{lang === "zh" ? "搜尋" : "Search"}</span>
              <input
                type="search"
                value={projectSearch}
                onChange={(event) => setProjectSearch(event.target.value)}
                placeholder={lang === "zh" ? "輸入關鍵字（如 React、Web3）" : "Type keyword (e.g. React, Web3)"}
              />
            </label>

            <div className="filter-group" role="tablist" aria-label={lang === "zh" ? "作品分類" : "Project categories"}>
              {(Object.keys(filterLabels) as ProjectFilter[]).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`filter-chip ${projectFilter === filter ? "active" : ""}`}
                  onClick={() => setProjectFilter(filter)}
                >
                  {filterLabels[filter][lang]}
                </button>
              ))}
            </div>

            <div className="project-stepper">
              <button type="button" className="mini-action" onClick={() => moveActiveProject("prev")} disabled={filteredProjects.length === 0}>
                {lang === "zh" ? "上一個" : "Prev"}
              </button>
              <button type="button" className="mini-action" onClick={() => moveActiveProject("next")} disabled={filteredProjects.length === 0}>
                {lang === "zh" ? "下一個" : "Next"}
              </button>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <Card className="empty-state reveal">
              <h3>{lang === "zh" ? "找不到符合條件的作品" : "No matching project found"}</h3>
              <p>
                {lang === "zh"
                  ? "請嘗試其他關鍵字，或切換分類查看全部作品。"
                  : "Try another keyword or switch category to view all projects."}
              </p>
            </Card>
          ) : (
            <div className="works-grid reveal">
              {filteredProjects.map((project) => {
                const active = activeWorkKey === project.name.en;
                return (
                  <article
                    key={project.name.en}
                    className={`project-card ${project.galleryImages && project.galleryImages.length >= 2 ? "has-gallery" : ""} ${active ? "active" : ""}`}
                    onClick={() => setActiveWorkKey(project.name.en)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setActiveWorkKey(project.name.en);
                      }
                    }}
                  >
                    <div className="project-media">
                      {project.galleryImages && project.galleryImages.length >= 2 ? (
                        <div className="project-gallery">
                          <FallbackImage src={project.galleryImages[0]} fallback={project.image} alt={`${project.name[lang]} preview 1`} />
                          <FallbackImage src={project.galleryImages[1]} fallback={project.image} alt={`${project.name[lang]} preview 2`} />
                        </div>
                      ) : (
                        <ProjectPreviewImage demoUrl={project.demoUrl} fallbackImage={project.image} alt={`${project.name[lang]} preview`} />
                      )}
                    </div>

                    <div className="project-body">
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
                        <p className="project-hint">
                          {lang === "zh"
                            ? "可點擊下方連結查看 Demo、程式碼或專案資料。"
                            : "Use the links below to open the demo, repository, or project folder."}
                        </p>
                      </details>

                      <div className="project-links">
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
          )}
        </Section>

        <Section id="journey" title={lang === "zh" ? "經歷與研究" : "Experience & Research"}>
          <div className="journey-grid reveal">
            {profile.experience.map((exp) => (
              <Card key={exp.title.en + exp.org.en}>
                <div className="entry-head">
                  <h3>{exp.title[lang]}</h3>
                  <p>
                    {exp.org[lang]}
                    {exp.location ? ` · ${exp.location[lang]}` : ""}
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
          <Card className="contact-card reveal">
            <p>
              {lang === "zh"
                ? "想聊實習、全職機會、產品合作，或一起做有趣的專案，歡迎直接聯絡我。"
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

      <button
        type="button"
        className={`back-to-top ${showToTop ? "is-visible" : ""}`}
        aria-label={lang === "zh" ? "回到頂部" : "Back to top"}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </button>
    </div>
  );
}
