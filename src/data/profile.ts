export type Lang = "en" | "zh";

type LText = {
  en: string;
  zh: string;
};

export type TimelineEntry = {
  title: LText;
  org: LText;
  location?: LText;
  period: LText;
  bullets: LText[];
};

export type ProjectEntry = {
  name: LText;
  subtitle: LText;
  period: LText;
  bullets: LText[];
  image: string;
  galleryImages?: string[];
  demoUrl?: string;
  repoUrl?: string;
  projectLinks?: Array<{
    label: LText;
    href: string;
    tone?: "primary" | "ghost";
  }>;
};

export const navLabels: Record<string, LText> = {
  about: { en: "About", zh: "關於我" },
  works: { en: "Works", zh: "作品" },
  journey: { en: "Journey", zh: "經歷" },
  skills: { en: "Skills", zh: "技能" },
  contact: { en: "Contact", zh: "聯絡" },
};

export const profile = {
  basics: {
    name: { en: "Yi-Chen Lin", zh: "林羿辰" },
    fullName: { en: "林羿辰 Yi-Chen Lin", zh: "林羿辰 Yi-Chen Lin" },
    pronouns: "(he/him)",
    phone: "+1 236-777-6823",
    email: "yichen.lin.2004@gmail.com",
    location: { en: "Vancouver, BC, Canada", zh: "加拿大 溫哥華" },
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/yichenlin-lyc/" },
      { label: "CryptoPulse Demo", href: "https://cryptopulse-production-a190.up.railway.app" },
      {
        label: "Portfolio",
        href: "https://drive.google.com/drive/folders/1l72JWhzAjmenkNoi_lEXS9KNUmsrSz11?usp=sharing",
      },
    ],
    heroTagline: {
      en: "UI-focused product builder bridging web, mobile, and Web3 systems.",
      zh: "專注介面體驗的產品開發者，串接 Web、行動端與 Web3 系統。",
    },
    heroStatement: {
      en: "Be like engineering is to solve problem.",
      zh: "工程師是解決問題的。",
    },
  },
  summary: {
    en: "UI-focused product builder with experience in frontend development, responsive interface design, and interactive systems across web, mobile, and Unity environments. Skilled in React, TypeScript, Kotlin, Unity, C#, and Solidity, with strong attention to usability, clarity, and cross-functional collaboration.",
    zh: "我是一位專注 UI 與產品落地的開發者，具備前端開發、響應式介面設計與互動系統實作經驗，涵蓋 Web、行動端與 Unity 環境。熟悉 React、TypeScript、Kotlin、Unity、C# 與 Solidity，重視可用性、資訊清晰度與跨職能協作。",
  },
  aboutBelief: {
    title: {
      en: "Future Aspect",
      zh: "相信未来",
    },
    paragraph: {
      en: "AI is evolving rapidly, and people are progressing in different ways and directions. In this trend, I believe engineers should not be valued only by knowing a specific language, but by being able to build products that truly satisfy users and clients. I don't focus on digging into just one narrow technology; instead, I focus on presenting products in the best possible state and delivering meaningful outcomes. For me, strong engineering is about turning complexity into clear user value, collaborating efficiently with product and design, and iterating quickly based on real feedback. Tools and frameworks will keep changing, but the ability to solve real problems and ship usable products is what stays important.",
      zh: "AI 發展非常快，大家也都在不同方向持續進步。在這樣的趨勢下，我相信工程師的價值不應該只在於會某一種語言，而是有能力做出真正讓使用者與客戶滿意的產品。我不會只深挖單一技術，而是更重視把產品以最佳狀態呈現出來，並交付有價值的結果。對我來說，工程能力的核心是把複雜問題轉化為清楚可用的使用者價值，並且能與產品、設計和開發夥伴高效率協作，快速迭代。工具與框架會持續變化，但真正不變的是解決真實問題與交付可用產品的能力。",
    },
  },
  skills: [
    {
      title: { en: "Programming", zh: "程式語言" },
      items: ["Solidity", "JavaScript", "TypeScript", "Python", "Java", "Kotlin", "SQL", "HTML", "CSS", "C#"],
    },
    {
      title: { en: "Tools / Frameworks", zh: "工具／框架" },
      items: ["Git", "GitHub", "React", "Vite", "Foundry", "MySQL", "Arduino", "Unity", "Android WebView", "Tauri"],
    },
    {
      title: { en: "AI / Research Tools", zh: "AI／研究工具" },
      items: ["Cursor", "Claude Code", "Notion AI", "Perplexity", "Midjourney", "Gemini", "Codex", "ChatGPT"],
    },
    {
      title: { en: "Technical Areas", zh: "技術領域" },
      items: [
        "Web3",
        "Smart Contract Development",
        "Responsive UI",
        "Frontend-Native Integration",
        "BLE / IoT Communication",
        "Software Engineering",
        "AI-assisted Development",
        "Real-time Data Interfaces",
        "Game Interaction",
      ],
    },
    {
      title: { en: "Design / Product", zh: "設計／產品" },
      items: ["User Flows", "Interaction Design", "Dashboard-style UI", "Usability-focused Implementation", "Interface Behavior"],
    },
    {
      title: { en: "Strengths", zh: "核心能力" },
      items: ["Problem Solving", "Data Analysis", "Critical Thinking", "Adaptability", "Communication"],
    },
  ],
  education: {
    school: { en: "University of British Columbia", zh: "英屬哥倫比亞大學（UBC）" },
    degree: { en: "Bachelor of Applied Science - Electrical Engineering", zh: "應用科學學士－電機工程" },
    graduation: { en: "Expected Graduation: May 2027", zh: "預計畢業：2027 年 5 月" },
    honors: { en: "Dean's Honour List, 2022-2025 Session", zh: "院長榮譽名單（Dean's Honour List），2022–2025 學年" },
  },
  experience: [
    {
      title: { en: "Software Developer", zh: "軟體開發工程師" },
      org: { en: "Delta Control", zh: "Delta Control" },
      location: { en: "Vancouver", zh: "溫哥華" },
      period: { en: "January 2026 - Present", zh: "2026 年 1 月 - 至今" },
      bullets: [
        {
          en: "Built a hybrid HVAC air balancing app using React, TypeScript, Kotlin, and Android WebView with core frontend interaction and mobile bridge logic.",
          zh: "使用 React、TypeScript、Kotlin 與 Android WebView 開發混合式 HVAC 風量平衡應用，負責核心前端互動與行動端橋接邏輯。",
        },
        {
          en: "Implemented frontend-native communication, data exchange, and state persistence to improve reliability across multi-page and multi-state flows.",
          zh: "實作前端與原生層通訊、資料交換與狀態持久化，提升多頁面與多狀態切換下的穩定性與一致性。",
        },
        {
          en: "Integrated BLE/IP communication for real-time sensor discovery, monitoring, and connection handling to improve device management UX.",
          zh: "整合 BLE / IP 通訊，支援即時感測器發現、監控與連線處理，優化設備管理與資料查看體驗。",
        },
        {
          en: "Improved interface behavior and interaction flows for smoother user-facing experiences.",
          zh: "優化介面行為與互動流程，讓使用者操作更順暢。",
        },
      ],
    },
    {
      title: { en: "Junior Electrical Assistant", zh: "初級電氣助理" },
      org: { en: "Joychime Industrial Corporation", zh: "Joychime Industrial Corporation" },
      location: { en: "New Taipei", zh: "新北" },
      period: { en: "May 2024 - August 2024", zh: "2024 年 5 月 - 2024 年 8 月" },
      bullets: [
        {
          en: "Performed plant operation inspections and handled exception issues, exceeding required standards by 10%.",
          zh: "執行工廠運作檢查並處理異常問題，成果超出要求標準 10%。",
        },
        {
          en: "Assisted wire connection and electrical equipment assembly, improving production efficiency.",
          zh: "協助線纜連接與電氣設備裝配，提升生產效率並深化工業流程理解。",
        },
        {
          en: "Managed technician reports and documentation, reducing paperwork by 30% and improving handoff clarity.",
          zh: "管理技術人員報告與文件整理，使紙本作業減少 30%，提升交接清晰度。",
        },
      ],
    },
  ] as TimelineEntry[],
  projects: [
    {
      name: { en: "Future DAO", zh: "Future DAO" },
      subtitle: { en: "Governance and Smart Contract System", zh: "治理與智慧合約系統" },
      period: { en: "January 2025/2026 - Present", zh: "2025/2026 年 1 月 - 至今" },
      image: "/placeholders/future-dao.svg",
      repoUrl: "https://github.com/ycl-2004/Future",
      bullets: [
        {
          en: "Built Solidity smart contracts for membership, utility token, treasury, and governance workflows.",
          zh: "使用 Solidity 建構會員、功能型代幣、金庫與治理流程所需的智慧合約。",
        },
        {
          en: "Developed frontend in React and TypeScript for contract interactions and state visibility.",
          zh: "使用 React 與 TypeScript 開發前端，完成合約互動、狀態展示與操作流程串接。",
        },
        {
          en: "Designed and tested proposal execution and token-based voting logic for DAO operations.",
          zh: "設計並測試提案執行與代幣投票邏輯，持續優化治理流程完整性與可維護性。",
        },
      ],
    },
    {
      name: { en: "CryptoPulse", zh: "CryptoPulse" },
      subtitle: { en: "Investment and Analytics Tool", zh: "投資與分析工具" },
      period: { en: "September 2025 - December 2025", zh: "2025 年 9 月 - 2025 年 12 月" },
      image: "/placeholders/cryptopulse.svg",
      demoUrl: "https://cryptopulse-production-a190.up.railway.app",
      bullets: [
        {
          en: "Built a full-stack crypto analytics platform for real-time market tracking.",
          zh: "開發全端加密貨幣分析平台，用於即時市場追蹤。",
        },
        {
          en: "Integrated external APIs for automated retrieval, pricing updates, and investment calculations.",
          zh: "整合外部 API，自動化完成資料取得、價格更新與投資計算。",
        },
        {
          en: "Designed responsive dashboard UI and improved app performance, stability, and usability.",
          zh: "設計響應式 UI，提升效能、穩定性與使用者體驗，讓資訊更清楚直觀。",
        },
      ],
    },
    {
      name: { en: "YC Todo", zh: "YC Todo" },
      subtitle: { en: "macOS Menubar Application", zh: "macOS 選單列應用" },
      period: { en: "December 2025 - February 2026", zh: "2025 年 12 月 - 2026 年 2 月" },
      image: "/placeholders/yc-todo.svg",
      galleryImages: ["/project-shots/light.png", "/project-shots/dark.png"],
      projectLinks: [
        {
          label: { en: "Project Folder", zh: "專案資料夾" },
          href: "https://drive.google.com/drive/u/1/folders/1l72JWhzAjmenkNoi_lEXS9KNUmsrSz11",
          tone: "primary",
        },
      ],
      bullets: [
        {
          en: "Built a native macOS menubar app using Tauri (Rust) and React for local task management.",
          zh: "使用 Tauri（Rust）與 React 開發原生 macOS 選單列任務管理應用，支援本地儲存。",
        },
        {
          en: "Integrated and modified an NSPopover plugin to fix UI layering and input behavior issues.",
          zh: "整合並修改 NSPopover 外掛，解決 macOS UI 分層與輸入問題。",
        },
        {
          en: "Packaged universal ARM64/x86_64 binaries and integrated audio playback.",
          zh: "打包支援 ARM64 / x86_64 的通用執行檔，並整合音訊播放功能。",
        },
      ],
    },
    {
      name: { en: "Unity Game Design", zh: "Unity 遊戲設計" },
      subtitle: { en: "Game Portfolio", zh: "遊戲作品集" },
      period: { en: "June 2024 - March 2025", zh: "2024 年 6 月 - 2025 年 3 月" },
      image: "/project-shots/game.png",
      projectLinks: [
        {
          label: { en: "2D", zh: "2D" },
          href: "https://play.unity.com/en/games/cae09d3a-0ee6-48dc-b80a-395419be1f65/collect-coins",
          tone: "primary",
        },
        {
          label: { en: "3D", zh: "3D" },
          href: "https://ycl-2004.github.io/OverCook/",
        },
        {
          label: { en: "Game Portfolio", zh: "遊戲作品集" },
          href: "https://ycl-2004.itch.io/",
        },
      ],
      bullets: [
        {
          en: "Developed and released both 2D and 3D Unity game experiences.",
          zh: "開發並發布 2D 與 3D Unity 遊戲體驗。",
        },
        {
          en: "Implemented continuous animations, responsive character controls, and interactive mechanics.",
          zh: "實作連續動畫、角色控制與互動機制。",
        },
      ],
    },
  ] as ProjectEntry[],
  researchTeam: {
    teamTitle: { en: "Engineering Design Team", zh: "工程設計團隊" },
    teamRole: { en: "Electrical-Power Team Member, UBC Sailbot", zh: "電力組成員，UBC Sailbot" },
    teamPeriod: { en: "September 2023 - December 2023", zh: "2023 年 9 月 - 2023 年 12 月" },
    teamBullets: [
      {
        en: "Contributed to power distribution design to satisfy project specs and safety standards.",
        zh: "參與電力分配系統設計，以滿足專案規格與安全標準。",
      },
      {
        en: "Built and tested electrical circuits to ensure performance and reliability.",
        zh: "搭建並測試電路，確保系統效能與可靠性。",
      },
      {
        en: "Diagnosed and resolved electrical issues to maintain system integrity.",
        zh: "診斷並解決電氣問題，維持系統完整性。",
      },
    ] as LText[],
    researchTitle: { en: "Technical Content & Research", zh: "技術內容與研究" },
    researchRole: { en: "Independent Web3 & AI Content Researcher", zh: "獨立 Web3 與 AI 內容研究者" },
    researchPeriod: { en: "January 2025 - Present", zh: "2025 年 1 月 - 至今" },
    researchBullets: [
      {
        en: "Research and write beginner-focused content on Web3 concepts, security awareness, and blockchain tools.",
        zh: "研究並撰寫面向初學者的 Web3、安全意識與區塊鏈工具內容。",
      },
      {
        en: "Explore AI productivity/development tools and document features, use cases, and workflow takeaways.",
        zh: "探索 AI 生產力與開發工具，整理其功能、使用場景與工作流心得。",
      },
      {
        en: "Publish recurring technical summaries and short educational posts for online audiences.",
        zh: "持續發布技術總結與短篇教育內容，強化知識轉化與表達能力。",
      },
    ] as LText[],
  },
  languages: {
    en: "English (Professional Working Proficiency) | Chinese (Native/Bilingual Proficiency)",
    zh: "English（專業工作能力）｜Chinese（母語／雙語能力）",
  },
};

export function t(lang: Lang, value: LText): string {
  return value[lang];
}
