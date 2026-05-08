// Selected work shown in the bento grid. Card click opens the GitHub repo in a new tab.
// Replace the placeholder URLs with the real public repos.

export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  github: string;
  size: "lg" | "md" | "sm";
  accent?: "sand" | "cool" | "ink";
}

export const PROJECTS: Project[] = [
  {
    id: "deloitte",
    title: "FlowCast — Deloitte Hackathon Winner",
    description:
      "Inventory forecasting that beat the field at AUC's Deloitte Innovation Hub. XGBoost + LSTM ensemble with DeepSeek V3.2 routing the right model per SKU. ~28% cost reduction, $1M+ projected client savings.",
    stack: ["XGBoost", "LSTM", "DeepSeek", "Python"],
    github: "https://github.com/yahyahammoudeh/flowcast",
    size: "lg",
    accent: "sand",
  },
  {
    id: "zagtrader-rag",
    title: "ZagTrader Unified Agent",
    description:
      "Multi-source RAG over internal docs, web portal, Jira, and media transcripts for a brokerage backend. Playwright crawler, MongoDB GridFS, vision-based extraction, real-time voice agent on top.",
    stack: ["React", "Express", "Playwright", "MongoDB", "OpenAI Realtime"],
    github: "https://github.com/yahyahammoudeh/zagtrader-rag",
    size: "lg",
    accent: "cool",
  },
  {
    id: "linux-pm",
    title: "Linux Process Manager",
    description:
      "Production-grade process manager in Rust: Tokio runtime, Ratatui TUI, Actix-web REST, React UI, GPU/container/k8s tracking. 121 tests, 100% coverage.",
    stack: ["Rust", "Tokio", "Ratatui", "React"],
    github: "https://github.com/yahyahammoudeh/linux-process-manager",
    size: "md",
  },
  {
    id: "ocr",
    title: "Arabic Legal OCR",
    description:
      "Multi-stage Arabic OCR pipeline at 99.3% accuracy. DocLayout-YOLO → Qwen3-VL classifier → Gemini 2.5 Flash post-processing. ~$0.0002/page, 10× cheaper than cloud alternatives.",
    stack: ["Qwen3-VL", "DocLayout-YOLO", "Gemini", "Python"],
    github: "https://github.com/yahyahammoudeh/arabic-ocr",
    size: "md",
  },
  {
    id: "seiq",
    title: "Seiq Marketplace",
    description:
      "Multi-vendor marketplace I founded. Next.js + Supabase web + Capacitor iOS/Android. Instagram → product listing AI, PayPal, Careem Express, Jordan-specific localization.",
    stack: ["Next.js", "Supabase", "Capacitor", "Stripe"],
    github: "https://github.com/yahyahammoudeh/seiq",
    size: "md",
  },
  {
    id: "thesis",
    title: "Madar — AI Coding Assessment",
    description:
      "Thesis with University of Passau. Adaptive learning platform: ELO ratings, concept dependency graphs, multi-model evaluation (DeepSeek/Qwen/Gemini/GPT), persistent AI chat sessions.",
    stack: ["Next.js", "Nest.js", "OpenRouter", "Postgres"],
    github: "https://github.com/yahyahammoudeh/madar",
    size: "md",
  },
  {
    id: "pos",
    title: "Restaurant POS",
    description:
      "Full-featured POS with Kitchen Display System, table management, inventory, loyalty, PWA offline support, AR/EN i18n. 324 unit tests.",
    stack: ["Next.js 15", "tRPC", "Supabase", "PWA"],
    github: "https://github.com/yahyahammoudeh/restaurant-pos",
    size: "sm",
  },
  {
    id: "mdvrp",
    title: "MDVRP Solver — Beltone Hackathon",
    description:
      "Multi-Depot Vehicle Routing solver hitting 78–88% order fulfillment. BFS pathfinding over road graphs, capacity-aware routing, three-level fallbacks. Streamlit dashboard.",
    stack: ["Python", "BFS", "Streamlit"],
    github: "https://github.com/yahyahammoudeh/mdvrp-solver",
    size: "sm",
  },
];
