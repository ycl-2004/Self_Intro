import { useEffect, useMemo, useRef, useState } from "react";
import Card from "./components/Card";
import Header from "./components/Header";
import NameLockup from "./components/NameLockup";
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

function getPrimaryProjectHref(project: ProjectEntry): string | undefined {
  return project.projectLinks?.[0]?.href ?? project.demoUrl ?? project.repoUrl;
}

function projectToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const projectSlugMap = new Map(profile.projects.map((project) => [projectToSlug(project.name.en), project.name.en]));

function getInitialProjectKey(): string {
  const fallback = profile.projects[0]?.name.en ?? "";
  if (typeof window === "undefined") return fallback;

  const params = new URLSearchParams(window.location.search);
  const projectParam = params.get("project");
  if (!projectParam) return fallback;

  return projectSlugMap.get(projectParam) ?? profile.projects.find((project) => project.name.en === projectParam)?.name.en ?? fallback;
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    const cached = localStorage.getItem("site-lang");
    return cached === "zh" || cached === "en" ? cached : "en";
  });
  const [activeSection, setActiveSection] = useState("about");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showToTop, setShowToTop] = useState(false);
  const [activeWorkKey, setActiveWorkKey] = useState(getInitialProjectKey);
  const [activeSkillTag, setActiveSkillTag] = useState<string | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const [activeSignal, setActiveSignal] = useState(0);
  const [activeProof, setActiveProof] = useState(0);
  const worksSectionRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    if (typeof window === "undefined" || !activeWorkKey) return;
    const params = new URLSearchParams(window.location.search);
    params.set("project", projectToSlug(activeWorkKey));
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", nextUrl);
  }, [activeWorkKey]);

  const filterLabels: Record<ProjectFilter, { en: string; zh: string }> = {
    all: { en: "All", zh: "全部" },
    web3: { en: "Web3", zh: "Web3" },
    fullstack: { en: "Full Stack", zh: "全端" },
    native: { en: "Native", zh: "原生" },
    game: { en: "Game", zh: "遊戲" },
  };

  const spotlightProjects = profile.projects;
  const archiveProjects = profile.projects.slice(4);

  const projectNarratives: Record<
    string,
    {
      challenge: { en: string; zh: string };
      role: { en: string; zh: string };
      constraint: { en: string; zh: string };
      impact: { en: string; zh: string };
      why: { en: string; zh: string };
      outcome: { en: string; zh: string };
      stats: Array<{ label: { en: string; zh: string }; value: string }>;
    }
  > = {
    "Future DAO": {
      challenge: {
        en: "Turn abstract governance flows into a working onchain membership and voting system with clear user-facing states.",
        zh: "把抽象的治理流程轉成可運作的鏈上會員與投票系統，並讓使用者能清楚理解每個狀態。",
      },
      role: {
        en: "Individual builder across smart contracts, interface behavior, and governance flow definition.",
        zh: "以 individual builder 身分處理智慧合約、介面行為與治理流程定義。",
      },
      constraint: {
        en: "The constraint was continuous progress: keep improving clarity and reliability while the system itself was still evolving.",
        zh: "限制在於必須持續進步，在系統本身仍在演變時，也要同步提升清晰度與可靠性。",
      },
      impact: {
        en: "The impact is a product that helps people see how governance and coordination can change the way communities organize value in the world.",
        zh: "它的影響在於讓人看見治理與協作產品，如何改變世界上社群組織價值與決策的方式。",
      },
      why: {
        en: "For product teams, this matters because it shows I can translate abstract system logic into something people can actually use and trust.",
        zh: "對產品團隊來說，這代表我能把抽象系統邏輯轉成使用者真的能理解並信任的產品。",
      },
      outcome: {
        en: "Built contract primitives, proposal voting logic, and React-based visibility for treasury and governance actions.",
        zh: "完成合約基礎模組、提案投票邏輯，以及 React 前端上的治理與金庫狀態可視化。",
      },
      stats: [
        { label: { en: "Stack", zh: "技術" }, value: "Solidity / React" },
        { label: { en: "Focus", zh: "重點" }, value: "Governance UX" },
        { label: { en: "Type", zh: "類型" }, value: "Web3 Product" },
      ],
    },
    CryptoPulse: {
      challenge: {
        en: "Make volatile market data feel actionable through a dashboard that is fast, readable, and useful for real-time decision support.",
        zh: "把高波動市場資料整理成可操作的 dashboard，讓它在即時情境下依然快速、清楚且有用。",
      },
      role: {
        en: "Individual builder across data integration, information hierarchy, and portfolio interaction design.",
        zh: "以 individual builder 身分處理資料串接、資訊層級與投資介面互動設計。",
      },
      constraint: {
        en: "The constraint was continuous progress under noisy data: improve readability and decision speed as the product surface kept expanding.",
        zh: "限制在於面對高噪音資料時仍要持續進步，隨產品表面增加也要同步提升可讀性與決策速度。",
      },
      impact: {
        en: "The impact is a product that helps people see world change through live market movement, instead of getting lost in raw financial noise.",
        zh: "它的影響在於讓人從即時市場變化中看見世界正在如何改變，而不是被原始金融噪音淹沒。",
      },
      why: {
        en: "For product teams, this matters because it proves I can shape data-heavy products into clearer decision environments.",
        zh: "對產品團隊來說，這證明我能把資料密集型產品整理成更清楚的決策環境。",
      },
      outcome: {
        en: "Delivered a responsive analytics product with live data integration, portfolio calculations, and clearer market scanning flows.",
        zh: "交付具備即時資料整合、投資計算與市場掃描流程的響應式分析產品。",
      },
      stats: [
        { label: { en: "Stack", zh: "技術" }, value: "React / APIs" },
        { label: { en: "Focus", zh: "重點" }, value: "Data Interface" },
        { label: { en: "Type", zh: "類型" }, value: "Full-stack" },
      ],
    },
    "YC Todo": {
      challenge: {
        en: "Build a native-feeling menubar utility with reliable lightweight interactions inside a constrained desktop surface.",
        zh: "在受限的桌面介面中，做出原生感夠強、互動夠輕且穩定的 menubar 工具。",
      },
      role: {
        en: "Individual builder owning interaction behavior, native wrapper integration, packaging, and desktop utility polish.",
        zh: "以 individual builder 身分負責互動行為、原生包裝整合、打包流程與桌面工具細修。",
      },
      constraint: {
        en: "The constraint was continuous progress inside a tiny surface: every refinement had to improve focus without adding friction.",
        zh: "限制在於極小介面中的持續進步，每個細修都必須提升專注感，而不能增加摩擦。",
      },
      impact: {
        en: "The impact is showing how even a small productivity product can change the pace and quality of everyday work through better behavior.",
        zh: "它的影響在於讓人看見，即使是小型生產力工具，也能透過更好的行為設計改變日常工作的節奏與品質。",
      },
      why: {
        en: "For product teams, this matters because it shows I care about system behavior and feel, not only visual screens.",
        zh: "對產品團隊來說，這代表我在意的不只是畫面，而是系統層面的行為與整體手感。",
      },
      outcome: {
        en: "Shipped a Tauri-based local task app with popover fixes, universal builds, and a more polished desktop utility experience.",
        zh: "完成 Tauri 本地任務工具，修正 popover 問題、支援通用架構打包，並提升桌面工具體驗。",
      },
      stats: [
        { label: { en: "Stack", zh: "技術" }, value: "Tauri / React" },
        { label: { en: "Focus", zh: "重點" }, value: "Native Utility" },
        { label: { en: "Type", zh: "類型" }, value: "Desktop App" },
      ],
    },
    "Unity Game Design": {
      challenge: {
        en: "Create interactive game experiences that still feel intentional in pacing, controls, and player feedback instead of just technical demos.",
        zh: "做出不只是技術展示，而是在節奏、操作與回饋上都更完整的互動遊戲體驗。",
      },
      role: {
        en: "Individual builder handling gameplay implementation, interaction tuning, animation behavior, and playable releases.",
        zh: "以 individual builder 身分處理玩法實作、互動調校、動畫行為與可玩版本發布。",
      },
      constraint: {
        en: "The constraint was continuous progress in player feel: every iteration needed to improve timing, feedback, and control responsiveness.",
        zh: "限制在於玩家手感上的持續進步，每次迭代都要讓節奏、回饋與操作響應更好。",
      },
      impact: {
        en: "The impact is helping people see how interactive products can reshape emotion, attention, and feedback loops in digital experiences.",
        zh: "它的影響在於讓人看見互動產品如何重新塑造情緒、注意力與數位體驗中的回饋循環。",
      },
      why: {
        en: "For product teams, this matters because it proves I can design for behavior and feedback, not only static layouts.",
        zh: "對產品團隊來說，這證明我能設計的是行為與回饋系統，而不只是靜態版面。",
      },
      outcome: {
        en: "Built and published multiple Unity game prototypes with player control systems, environment interaction, and continuous animation loops.",
        zh: "完成並發布多個 Unity 遊戲原型，涵蓋玩家控制、場景互動與連續動畫設計。",
      },
      stats: [
        { label: { en: "Stack", zh: "技術" }, value: "Unity / C#" },
        { label: { en: "Focus", zh: "重點" }, value: "Interaction Systems" },
        { label: { en: "Type", zh: "類型" }, value: "Game Design" },
      ],
    },
  };

  const trustSignals = [
    {
      title: { en: "Shipping Context", zh: "交付情境" },
      body: { en: "Web, mobile, desktop, and interactive systems", zh: "Web、mobile、desktop 與互動系統" },
      detail: {
        en: "I have worked across browser products, native-adjacent interfaces, desktop utility surfaces, and interaction-heavy systems rather than only one app category.",
        zh: "我不只做單一類型網站，而是跨越 browser 產品、接近原生的介面、desktop utility 與互動系統。",
      },
    },
    {
      title: { en: "Current Track", zh: "目前主軸" },
      body: { en: "Frontend systems, product UI, and applied engineering", zh: "Frontend systems、產品 UI 與應用工程" },
      detail: {
        en: "The strongest fit is where interface clarity, technical system complexity, and product judgment need to exist together.",
        zh: "我最適合的是介面清晰度、技術系統複雜度與產品判斷力必須同時存在的場景。",
      },
    },
    {
      title: { en: "Education", zh: "學歷背景" },
      body: { en: "UBC Electrical Engineering · Dean's Honour List", zh: "UBC 電機工程 · 院長榮譽名單" },
      detail: {
        en: "This background gives me a stronger systems view: I tend to reason from constraints, reliability, and signal quality, not only appearance.",
        zh: "這個背景讓我有更強的 systems view，我更常從限制、可靠性與訊號品質出發，而不只看外觀。",
      },
    },
    {
      title: { en: "Availability", zh: "合作狀態" },
      body: { en: "Open to internships, full-time roles, and strong product teams", zh: "開放實習、全職機會與高標準產品團隊合作" },
      detail: {
        en: "I am especially looking for teams with high product standards, strong design taste, and real ambition around what they ship.",
        zh: "我特別希望加入對產品標準高、設計品味強，且對交付有真正野心的團隊。",
      },
    },
  ];

  const sectionAuras: Record<string, { glow: string; glow2: string }> = {
    top: { glow: "rgba(15, 108, 253, 0.12)", glow2: "rgba(45, 212, 191, 0.08)" },
    about: { glow: "rgba(59, 130, 246, 0.13)", glow2: "rgba(125, 211, 252, 0.08)" },
    works: { glow: "rgba(14, 165, 233, 0.14)", glow2: "rgba(45, 212, 191, 0.1)" },
    journey: { glow: "rgba(99, 102, 241, 0.12)", glow2: "rgba(15, 108, 253, 0.08)" },
    skills: { glow: "rgba(45, 212, 191, 0.12)", glow2: "rgba(59, 130, 246, 0.08)" },
    contact: { glow: "rgba(96, 165, 250, 0.14)", glow2: "rgba(147, 197, 253, 0.08)" },
  };

  const skillProjectMap: Record<string, string> = {
    "Responsive UI": "CryptoPulse",
    "Interaction Design": "Unity Game Design",
    "Dashboard UI": "CryptoPulse",
    React: "CryptoPulse",
    TypeScript: "CryptoPulse",
    "State Flows": "CryptoPulse",
    Tauri: "YC Todo",
    "Android WebView": "YC Todo",
    "BLE / IP": "Future DAO",
    Solidity: "Future DAO",
    Web3: "Future DAO",
    "AI-assisted Development": "YC Todo",
  };

  const capabilityGroups = [
    {
      title: { en: "Product Interfaces", zh: "產品介面" },
      text: {
        en: "Designing readable, high-signal interfaces for workflows, dashboards, and multi-state product experiences.",
        zh: "擅長設計高可讀、高訊號的介面，用於 workflow、dashboard 與多狀態產品體驗。",
      },
      tags: ["Responsive UI", "Interaction Design", "Dashboard UI"],
    },
    {
      title: { en: "Frontend Systems", zh: "前端系統" },
      text: {
        en: "Building structured React and TypeScript applications with attention to behavior, state flow, and maintainability.",
        zh: "使用 React 與 TypeScript 建構具備清楚狀態流、穩定行為與可維護性的前端系統。",
      },
      tags: ["React", "TypeScript", "State Flows"],
    },
    {
      title: { en: "Native + Device", zh: "原生與裝置" },
      text: {
        en: "Working across desktop and native bridges where UX depends on system behavior, packaging, and hardware communication.",
        zh: "能處理 desktop 與 native bridge 場景，重視系統行為、打包流程與硬體互動對 UX 的影響。",
      },
      tags: ["Tauri", "Android WebView", "BLE / IP"],
    },
    {
      title: { en: "Emerging Systems", zh: "新興系統" },
      text: {
        en: "Exploring Web3 and AI-assisted workflows through products that require clear abstractions and user trust.",
        zh: "透過需要抽象清楚與建立信任的產品，持續探索 Web3 與 AI 協作工作流。",
      },
      tags: ["Solidity", "Web3", "AI-assisted Development"],
    },
  ];

  const operatingPrinciples = [
    {
      title: { en: "Clarity over feature noise", zh: "清晰度優先於功能堆疊" },
      body: {
        en: "I focus on making interfaces understandable fast, especially when the underlying system is technical or state-heavy.",
        zh: "當底層系統很技術化或狀態很多時，我會先讓介面能被快速理解，而不是先堆功能。",
      },
    },
    {
      title: { en: "Ship with product judgment", zh: "用產品判斷力交付" },
      body: {
        en: "I care about what should exist, not only what can be built. That includes scope, flow, and signal quality.",
        zh: "我在意的不只是做得出來，而是什麼值得存在，包含 scope、流程與資訊品質。",
      },
    },
    {
      title: { en: "Bridge design and engineering", zh: "串接設計與工程" },
      body: {
        en: "My strongest work happens where interaction design, implementation detail, and real user value need to align.",
        zh: "我最強的價值出現在互動設計、實作細節與真實使用者價值必須對齊的地方。",
      },
    },
  ];

  useEffect(() => {
    if (spotlightProjects.length === 0) return;
    const exists = spotlightProjects.some((project) => project.name.en === activeWorkKey);
    if (!exists) {
      setActiveWorkKey(spotlightProjects[0].name.en);
    }
  }, [spotlightProjects, activeWorkKey]);

  const activeProjectIndex = spotlightProjects.findIndex((project) => project.name.en === activeWorkKey);
  const activeProject = activeProjectIndex >= 0 ? spotlightProjects[activeProjectIndex] : spotlightProjects[0];
  const activeProjectProgress = spotlightProjects.length > 0 ? ((activeProjectIndex >= 0 ? activeProjectIndex + 1 : 1) / spotlightProjects.length) * 100 : 0;

  const heroSignals = [
    {
      label: { en: "React / TypeScript", zh: "React / TypeScript" },
      title: { en: "Structured frontend systems", zh: "有結構的前端系統" },
      body: {
        en: "I build UI layers that can scale in complexity without losing readability, hierarchy, or behavioral clarity.",
        zh: "我會把 UI 做成可以承受複雜度成長，但仍保有可讀性、層級與行為清晰度的系統。",
      },
    },
    {
      label: { en: "Product UI Design", zh: "產品與介面設計" },
      title: { en: "Product thinking in the interface", zh: "把產品思考落在介面上" },
      body: {
        en: "I focus on what users should understand, notice, and trust first, not just what the screen can contain.",
        zh: "我在意的不只是畫面能放什麼，而是使用者應該先理解什麼、注意什麼、信任什麼。",
      },
    },
    {
      label: { en: "Web3 Systems", zh: "Web3 系統" },
      title: { en: "Abstract systems made legible", zh: "把抽象系統做得可理解" },
      body: {
        en: "Governance, onchain state, and token logic only become useful when the interface explains them well.",
        zh: "治理、鏈上狀態與代幣邏輯，只有在介面能清楚說明時，才會真正變得有用。",
      },
    },
    {
      label: { en: "Web + Mobile", zh: "Web + Mobile" },
      title: { en: "Interaction across surfaces", zh: "跨裝置互動思維" },
      body: {
        en: "I enjoy working where frontend behavior, native constraints, and user workflow all need to align.",
        zh: "我擅長處理前端行為、原生限制與使用者工作流必須一起對齊的情境。",
      },
    },
  ];

  const activateProject = (projectKey: string, options?: { scroll?: boolean; skill?: string | null }) => {
    const exists = spotlightProjects.some((project) => project.name.en === projectKey);
    if (!exists) return;

    setActiveWorkKey(projectKey);
    setActiveSkillTag(options?.skill ?? null);

    if (options?.scroll) {
      window.requestAnimationFrame(() => {
        worksSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const moveActiveProject = (direction: "prev" | "next") => {
    if (spotlightProjects.length === 0) return;
    const start = activeProjectIndex >= 0 ? activeProjectIndex : 0;
    const delta = direction === "next" ? 1 : -1;
    const nextIndex = (start + delta + spotlightProjects.length) % spotlightProjects.length;
    activateProject(spotlightProjects[nextIndex].name.en, { scroll: true, skill: null });
  };

  const jumpToProjectBySkill = (skill: string) => {
    const targetProject = skillProjectMap[skill];
    if (!targetProject) return;
    activateProject(targetProject, { scroll: true, skill });
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
    <div
      className={`page-shell page-shell-${activeSection}`}
      style={{
        ["--section-glow" as string]: (sectionAuras[activeSection] ?? sectionAuras.top).glow,
        ["--section-glow-2" as string]: (sectionAuras[activeSection] ?? sectionAuras.top).glow2,
      }}
    >
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
            <div className="hero-band">
              <p className="hero-kicker">{lang === "zh" ? "產品工程 / 介面系統 / 可交付成果" : "Product Engineering / Interface Systems / Delivery"}</p>
              <span className="hero-availability">{lang === "zh" ? "開放合作與工作機會" : "Open to internships and product roles"}</span>
            </div>
            <h1 id="hero-heading">
              <NameLockup stackedOnMobile />
            </h1>
            <p className="hero-tagline">{t(lang, profile.basics.heroTagline)}</p>
            <p className="hero-intro">{profile.summary[lang]}</p>

            <div className="hero-signals" aria-label={lang === "zh" ? "能力標籤" : "Capabilities"}>
              {heroSignals.map((signal, index) => (
                <button
                  key={signal.label.en}
                  type="button"
                  className={`hero-signal ${activeSignal === index ? "active" : ""}`}
                  onClick={() => setActiveSignal(index)}
                >
                  {signal.label[lang]}
                </button>
              ))}
            </div>

            <div className="hero-focus-panel" aria-live="polite">
              <p className="hero-focus-kicker">{lang === "zh" ? "目前聚焦" : "Current Lens"}</p>
              <h2>{heroSignals[activeSignal].title[lang]}</h2>
              <p>{heroSignals[activeSignal].body[lang]}</p>
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
            <div className="hero-panel hero-panel-primary">
              <p className="hero-panel-label">{lang === "zh" ? "目前定位" : "Current Positioning"}</p>
              <div className="identity-block">
                <p>{profile.basics.location[lang]}</p>
                <p>{lang === "zh" ? "可配合實習與產品工程職缺" : "Open to internships and product engineering roles"}</p>
              </div>
              <div className="identity-links">
                <a href={`mailto:${profile.basics.email}`}>{profile.basics.email}</a>
                <a href={profile.basics.links[0].href} target="_blank" rel="noreferrer">
                  {profile.basics.links[0].label}
                </a>
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
            </div>

            <div className="hero-panel hero-panel-accent">
              <p className="hero-panel-label">{lang === "zh" ? "精選作品" : "Featured Work"}</p>
              {activeProject ? (
                <>
                  <h3>{activeProject.name[lang]}</h3>
                  <p>{activeProject.subtitle[lang]}</p>
                  <span className="hero-panel-meta">
                    {activeProjectIndex + 1} / {spotlightProjects.length || profile.projects.length}
                  </span>
                  <div className="hero-project-pills" aria-label={lang === "zh" ? "快速切換作品" : "Quick project switch"}>
                    {spotlightProjects.map((project) => (
                      <button
                        key={project.name.en}
                        type="button"
                        className={`hero-project-pill ${project.name.en === activeProject.name.en ? "active" : ""}`}
                        onClick={() => activateProject(project.name.en, { scroll: true, skill: null })}
                      >
                        {project.name[lang]}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </aside>
        </section>

        <section className="proof-grid reveal" aria-label={lang === "zh" ? "信任訊號" : "Trust signals"}>
          {trustSignals.map((item, index) => (
            <button key={item.title.en} type="button" className={`proof-card ${activeProof === index ? "active" : ""}`} onClick={() => setActiveProof(index)}>
              <p className="proof-label">{item.title[lang]}</p>
              <p className="proof-value">{item.body[lang]}</p>
            </button>
          ))}
        </section>

        <Card className="proof-detail reveal">
          <p className="card-kicker">{lang === "zh" ? "更多說明" : "Detail"}</p>
          <h3>{trustSignals[activeProof].title[lang]}</h3>
          <p>{trustSignals[activeProof].detail[lang]}</p>
        </Card>

        <Section
          id="about"
          title={lang === "zh" ? "工作方式" : "How I Work"}
          subtitle={lang === "zh" ? "我把工程、產品與介面設計放在同一個問題裡思考，重視理解速度、互動品質與實際交付。" : "I approach engineering, product, and interface design as the same problem: make complexity legible, usable, and shippable."}
        >
          <div className="about-editorial reveal">
            <Card className="about-story">
              <p className="card-kicker">{lang === "zh" ? "定位" : "Positioning"}</p>
              <h3>{lang === "zh" ? "從工程背景切入，但以產品品質為中心。" : "Engineering-trained, product-centered."}</h3>
              <p>{profile.summary[lang]}</p>
              <p>{t(lang, profile.aboutBelief.paragraph)}</p>
            </Card>

            <div className="principles-grid">
              {operatingPrinciples.map((principle) => (
                <Card key={principle.title.en} className="principle-card">
                  <p className="card-kicker">{lang === "zh" ? "原則" : "Principle"}</p>
                  <h3>{principle.title[lang]}</h3>
                  <p>{principle.body[lang]}</p>
                </Card>
              ))}

              <Card className="education-card">
                <p className="card-kicker">{lang === "zh" ? "背景" : "Background"}</p>
                <h3>{profile.education.school[lang]}</h3>
                <p>{profile.education.degree[lang]}</p>
                <p>{profile.education.graduation[lang]}</p>
                <p>{profile.education.honors[lang]}</p>
              </Card>
            </div>
          </div>
        </Section>

        <Section
          id="works"
          title={lang === "zh" ? "旗艦作品" : "Flagship Case Studies"}
          subtitle={lang === "zh" ? "這些專案最能代表我如何把技術系統做成可理解、可操作、可展示的產品。" : "These projects best represent how I turn technical systems into interfaces people can understand, operate, and trust."}
          ref={worksSectionRef}
        >
          <div className="case-study-shell reveal">
            <div className="case-study-rail" role="tablist" aria-label={lang === "zh" ? "旗艦作品列表" : "Flagship projects"}>
              {spotlightProjects.map((project, index) => {
                const category = categorizeProject(project);
                const active = project.name.en === activeProject?.name.en;
                const narrative = projectNarratives[project.name.en];
                return (
                  <button
                    key={project.name.en}
                    type="button"
                    className={`case-study-tab ${active ? "active" : ""}`}
                    onClick={() => activateProject(project.name.en, { skill: null })}
                  >
                    <span className="case-study-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="case-study-tab-copy">
                      <span className="case-study-tag">{filterLabels[category][lang]}</span>
                      <strong>{project.name[lang]}</strong>
                      <small>{narrative?.impact[lang] ?? project.subtitle[lang]}</small>
                    </span>
                  </button>
                );
              })}
            </div>

            {activeProject ? (
              <article key={activeProject.name.en} className="case-study-stage">
                <div className="case-study-media">
                  {getPrimaryProjectHref(activeProject) ? (
                    <a
                      className="case-study-media-link"
                      href={getPrimaryProjectHref(activeProject)}
                      target="_blank"
                      rel="noreferrer"
                      data-cta={lang === "zh" ? "打開作品" : "Open Project"}
                      aria-label={lang === "zh" ? `打開 ${activeProject.name[lang]} 相關連結` : `Open ${activeProject.name[lang]} project link`}
                    >
                      {activeProject.galleryImages && activeProject.galleryImages.length >= 2 ? (
                        <div className="project-gallery">
                          <FallbackImage src={activeProject.galleryImages[0]} fallback={activeProject.image} alt={`${activeProject.name[lang]} preview 1`} />
                          <FallbackImage src={activeProject.galleryImages[1]} fallback={activeProject.image} alt={`${activeProject.name[lang]} preview 2`} />
                        </div>
                      ) : (
                        <ProjectPreviewImage
                          demoUrl={activeProject.demoUrl}
                          fallbackImage={activeProject.image}
                          alt={`${activeProject.name[lang]} preview`}
                        />
                      )}
                    </a>
                  ) : activeProject.galleryImages && activeProject.galleryImages.length >= 2 ? (
                    <div className="project-gallery">
                      <FallbackImage src={activeProject.galleryImages[0]} fallback={activeProject.image} alt={`${activeProject.name[lang]} preview 1`} />
                      <FallbackImage src={activeProject.galleryImages[1]} fallback={activeProject.image} alt={`${activeProject.name[lang]} preview 2`} />
                    </div>
                  ) : (
                    <ProjectPreviewImage
                      demoUrl={activeProject.demoUrl}
                      fallbackImage={activeProject.image}
                      alt={`${activeProject.name[lang]} preview`}
                    />
                  )}
                </div>

                <div className="case-study-content">
                  <div className="case-study-header">
                    <span className="project-category">{filterLabels[categorizeProject(activeProject)][lang]}</span>
                    <h3>{activeProject.name[lang]}</h3>
                    <p>{activeProject.subtitle[lang]}</p>
                    <time>{activeProject.period[lang]}</time>
                    {activeSkillTag ? (
                      <div className="case-study-source">
                        <span>{lang === "zh" ? "由能力標籤導向" : "Matched from capability"}</span>
                        <strong>{activeSkillTag}</strong>
                      </div>
                    ) : null}
                    <div className="case-study-progress" aria-label={lang === "zh" ? "作品進度" : "Project progress"}>
                      <span>
                        {String(activeProjectIndex + 1).padStart(2, "0")} / {String(spotlightProjects.length).padStart(2, "0")}
                      </span>
                      <div className="case-study-progress-track" aria-hidden="true">
                        <span style={{ width: `${activeProjectProgress}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="case-study-metrics">
                    {projectNarratives[activeProject.name.en]?.stats.map((stat) => (
                      <div key={stat.label.en} className="metric-block">
                        <span>{stat.label[lang]}</span>
                        <strong>{stat.value}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="case-study-story">
                    <div>
                      <p className="case-study-label">{lang === "zh" ? "問題" : "Problem"}</p>
                      <p>{projectNarratives[activeProject.name.en]?.challenge[lang]}</p>
                    </div>
                    <div>
                      <p className="case-study-label">{lang === "zh" ? "角色" : "Role"}</p>
                      <p>{projectNarratives[activeProject.name.en]?.role[lang]}</p>
                    </div>
                    <div>
                      <p className="case-study-label">{lang === "zh" ? "限制" : "Constraint"}</p>
                      <p>{projectNarratives[activeProject.name.en]?.constraint[lang]}</p>
                    </div>
                    <div>
                      <p className="case-study-label">{lang === "zh" ? "交付內容" : "What I Built"}</p>
                      <p>{projectNarratives[activeProject.name.en]?.outcome[lang]}</p>
                    </div>
                    <div>
                      <p className="case-study-label">{lang === "zh" ? "價值" : "Why It Matters"}</p>
                      <p>{projectNarratives[activeProject.name.en]?.impact[lang]}</p>
                    </div>
                    <div>
                      <p className="case-study-label">{lang === "zh" ? "對產品團隊的意義" : "Why This Matters for Product Teams"}</p>
                      <p>{projectNarratives[activeProject.name.en]?.why[lang]}</p>
                    </div>
                  </div>

                  <ul className="case-study-points">
                    {activeProject.bullets.map((bullet) => (
                      <li key={bullet.en}>{bullet[lang]}</li>
                    ))}
                  </ul>

                  <div className="project-links">
                    {activeProject.projectLinks && activeProject.projectLinks.length > 0
                      ? activeProject.projectLinks.map((link) => (
                          <a
                            key={link.href + link.label.en}
                            className={link.tone === "primary" ? "btn-primary" : "btn-ghost"}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {t(lang, link.label)}
                          </a>
                        ))
                      : null}

                    {!activeProject.projectLinks && activeProject.demoUrl ? (
                      <a className="btn-primary" href={activeProject.demoUrl} target="_blank" rel="noreferrer">
                        {lang === "zh" ? "打開網站" : "Open Demo"}
                      </a>
                    ) : null}

                    {!activeProject.projectLinks && activeProject.repoUrl ? (
                      <a className="btn-ghost" href={activeProject.repoUrl} target="_blank" rel="noreferrer">
                        {lang === "zh" ? "程式碼" : "Repository"}
                      </a>
                    ) : null}

                    <span className="case-study-hint">
                      {lang === "zh" ? "切換作品後會自動回到作品區開頭，重新看到完整專案上下文。" : "Switching projects auto-scrolls back to the start of the work section for full context."}
                    </span>

                    <button type="button" className="btn-ghost case-study-nav" onClick={() => moveActiveProject("prev")}>
                      {lang === "zh" ? "上一個作品" : "Previous Project"}
                    </button>
                    <button type="button" className="btn-ghost case-study-nav" onClick={() => moveActiveProject("next")}>
                      {lang === "zh" ? "下一個作品" : "Next Project"}
                    </button>
                  </div>
                </div>
              </article>
            ) : null}
          </div>

          {archiveProjects.length > 0 ? (
            <div className="archive-grid reveal">
              {archiveProjects.map((project) => (
                <article key={project.name.en} className="archive-card">
                  <span className="project-category">{filterLabels[categorizeProject(project)][lang]}</span>
                  <strong>{project.name[lang]}</strong>
                  <small>{project.subtitle[lang]}</small>
                  <div className="archive-links">
                    {project.projectLinks?.map((link) => (
                      <a key={link.href + link.label.en} href={link.href} target="_blank" rel="noreferrer">
                        {t(lang, link.label)}
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </Section>

        <Section id="journey" title={lang === "zh" ? "經歷與研究" : "Experience & Research"} subtitle={lang === "zh" ? "精簡呈現我在不同情境下承擔的責任與交付結果。" : "A compressed view of the contexts where I have taken responsibility, shipped, and learned fast."}>
          <div className="timeline-grid reveal">
            {profile.experience.map((exp) => (
              <Card key={exp.title.en + exp.org.en} className="timeline-card">
                <div className="timeline-topline">
                  <span>{exp.period[lang]}</span>
                  <span>{exp.location?.[lang] ?? exp.org[lang]}</span>
                </div>
                <div className="entry-head">
                  <h3>{exp.title[lang]}</h3>
                  <p>{exp.org[lang]}</p>
                </div>
                <ul>
                  {exp.bullets.slice(0, 3).map((bullet) => (
                    <li key={bullet.en}>{bullet[lang]}</li>
                  ))}
                </ul>
              </Card>
            ))}

            <Card className="timeline-card">
              <div className="timeline-topline">
                <span>{profile.researchTeam.teamPeriod[lang]}</span>
                <span>{lang === "zh" ? "設計 / 團隊協作" : "Systems / Teamwork"}</span>
              </div>
              <div className="entry-head">
                <h3>{profile.researchTeam.teamRole[lang]}</h3>
                <p>{profile.researchTeam.teamTitle[lang]}</p>
              </div>
              <ul>
                {profile.researchTeam.teamBullets.slice(0, 3).map((bullet) => (
                  <li key={bullet.en}>{bullet[lang]}</li>
                ))}
              </ul>
            </Card>

            <Card className="timeline-card">
              <div className="timeline-topline">
                <span>{profile.researchTeam.researchPeriod[lang]}</span>
                <span>{lang === "zh" ? "內容 / 研究" : "Writing / Research"}</span>
              </div>
              <div className="entry-head">
                <h3>{profile.researchTeam.researchRole[lang]}</h3>
                <p>{profile.researchTeam.researchTitle[lang]}</p>
              </div>
              <ul>
                {profile.researchTeam.researchBullets.slice(0, 3).map((bullet) => (
                  <li key={bullet.en}>{bullet[lang]}</li>
                ))}
              </ul>
            </Card>
          </div>
        </Section>

        <Section id="skills" title={lang === "zh" ? "核心能力" : "Capabilities"} subtitle={lang === "zh" ? "把工具和技能重新整理成真正和產品交付有關的能力層。" : "Tools matter, but the more useful framing is what I can actually design, build, and ship."}>
          <div className="capability-grid reveal">
            {capabilityGroups.map((group) => (
              <Card key={group.title.en} className="capability-card">
                <p className="card-kicker">{lang === "zh" ? "能力" : "Capability"}</p>
                <h3>{group.title[lang]}</h3>
                <p>{group.text[lang]}</p>
                <div className="chip-list">
                  {group.tags.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`chip chip-action ${activeSkillTag === item ? "active" : ""}`}
                      onClick={() => jumpToProjectBySkill(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="contact" title={lang === "zh" ? "一起做更好的產品" : "Let’s Build Better Products"} subtitle={lang === "zh" ? "如果你在找能把工程、產品與介面品質一起扛起來的人，我很願意聊。" : "If you are looking for someone who can bridge engineering depth with interface quality and product judgment, I would like to talk."}>
          <div className="contact-shell reveal">
            <Card className="contact-card contact-primary">
              <p className="card-kicker">{lang === "zh" ? "合作" : "Primary CTA"}</p>
              <p className="contact-lead">
                {lang === "zh"
                  ? "我對高標準的產品工程、前端系統與介面密集型角色特別有興趣。"
                  : "I am especially interested in high-bar product engineering, frontend systems, and interface-heavy roles."}
              </p>
              <div className="contact-actions">
                <a className="btn-primary" href={`mailto:${profile.basics.email}`}>
                  {lang === "zh" ? "直接寄信" : "Email Me"}
                </a>
                <a className="btn-ghost" href="https://www.linkedin.com/in/yichenlin-lyc/" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
                <a className="btn-ghost" href={profile.basics.links[2].href} target="_blank" rel="noreferrer">
                  {lang === "zh" ? "作品資料" : "Portfolio Files"}
                </a>
              </div>
            </Card>

            <Card className="contact-card contact-secondary">
              <p className="card-kicker">{lang === "zh" ? "聯絡資訊" : "Contact Details"}</p>
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
                  <strong>{lang === "zh" ? "地點：" : "Location: "}</strong>
                  {profile.basics.location[lang]}
                </p>
              </div>

              <p className="language-line">
                <strong>{lang === "zh" ? "語言能力：" : "Languages: "}</strong>
                {profile.languages[lang]}
              </p>
            </Card>
          </div>
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
