import { useChat } from "../chat/chatContext";
import { ArrowUpRight, MessageCircle, Plus, Trophy } from "lucide-react";
import { Card, SectionHeader, Tag } from "./ui";

const EDUCATION = [
  {
    school: "The American University in Cairo",
    title: "Bachelor of Science in Computer Science",
    date: "2022 to 2026",
    body: "Computer Science graduate on the Tomorrow's Leaders full scholarship. Coursework included data structures, algorithms, operating systems, databases, machine learning, computer networks, and software engineering.",
  },
  {
    school: "College of Charleston",
    title: "Exchange program",
    date: "Fall 2024",
    body: "Exchange semester with a 3.75 GPA.",
  },
];

interface ExperienceImage {
  src: string;
  href?: string;
  alt?: string;
}

interface ExperienceLink {
  label: string;
  href: string;
}

interface ExperienceItem {
  title: string;
  org: string;
  date: string;
  badge: string;
  body: string;
  stack: string[];
  images?: ExperienceImage[];
  links?: ExperienceLink[];
}

const EXPERIENCE: ExperienceItem[] = [
  {
    title: "AI Engineer",
    org: "EY — Assurance AI Hub",
    date: "Aug 2026 to present",
    badge: "Current",
    body: "Building GenAI proofs of concept for client teams, then transitioning them into full products.",
    stack: ["GenAI", "Python", "Client delivery"],
  },
  {
    title: "AI Engineer (Contractor)",
    org: "Loving Loyalty",
    date: "Mar 2026 to present",
    badge: "Contract",
    body: "Contract role building predictive intelligence for POS data (demand forecasting and business-insight models), and leading the app redesign within the POS codebase refactor.",
    stack: ["Forecasting", "POS analytics", "App redesign", "Python"],
  },
  {
    title: "Freelance Full-Stack & AI Engineer",
    org: "CSTC and Almafkhara Academy — KSA",
    date: "May 2026 to present",
    badge: "Freelance",
    body: "One white-label, multi-tenant platform serving two Saudi training centers: Arabic-first CRM/LMS, finance and accounting, HR and trainer payouts, reporting, certificates, and a WhatsApp AI assistant with voice-note transcription and human handoff.",
    stack: ["Next.js", "Supabase", "Multi-tenant", "WhatsApp AI", "Arabic RTL"],
    images: [
      { src: "/cv-shots/cstc.png", href: "https://cstc.edu.sa", alt: "CSTC homepage" },
      {
        src: "/cv-shots/almafkhara.png",
        href: "https://almafkhara.com.sa",
        alt: "Almafkhara Academy homepage",
      },
    ],
    links: [
      { label: "cstc.edu.sa", href: "https://cstc.edu.sa" },
      { label: "almafkhara.com.sa", href: "https://almafkhara.com.sa" },
    ],
  },
  {
    title: "AI Engineer Intern",
    org: "ZagTrader",
    date: "Feb 2026 to Apr 2026",
    badge: "Internship",
    body: "Built a unified AI platform with RAG retrieval, realtime voice, API gateway work, and admin tooling. Retrieval covered internal documents, Jira, portal data, and media transcripts.",
    stack: ["React", "Express", "WebSocket", "MongoDB", "OpenAI Realtime", "OpenRouter"],
    images: [{ src: "/cv-shots/zagtrader.png", alt: "ZagTrader platform" }],
  },
  {
    title: "Winner",
    org: "IMA Student Case Competition — Middle East & Africa",
    date: "Feb 2026 to May 2026",
    badge: "Winner",
    body: "Winning team at the Middle East & Africa finals in Riyadh. The case: should West Valley Fresh enter the organic Hass avocado market, and which five US cities should it target? We ran CVP, price-elasticity and sensitivity analysis on 10+ years of Hass Avocado Board data (43,840 weekly records, 40 cities) and recommended entry with a top-five ranking that held under ±50% shipping-cost scenarios. Awarded a CMA certification scholarship.",
    stack: ["CVP analysis", "Price elasticity", "Sensitivity analysis", "Python"],
  },
  {
    title: "1st Place",
    org: "Deloitte Innovation Hub Hackathon",
    date: "Feb 2026",
    badge: "Winner",
    body: "Built FlowCast, an inventory forecasting system combining XGBoost, LSTM, and DeepSeek orchestration. 28% cost reduction and over $1M in projected savings.",
    stack: ["XGBoost", "LSTM", "DeepSeek", "Python"],
  },
  {
    title: "Thesis",
    org: "AI Coding Assessment Platform",
    date: "Sep 2024 to Jun 2026",
    badge: "Research",
    body: "Thesis with University of Passau: adaptive coding assessment with ELO ratings, concept dependency graphs, AI chat, and teacher analytics.",
    stack: ["Next.js", "Nest.js", "DeepSeek", "Qwen", "Gemini", "OpenRouter"],
    images: [{ src: "/cv-shots/thesis.png", alt: "Madar assessment platform" }],
  },
  {
    title: "Founder",
    org: "Seiq Marketplace",
    date: "Jan 2025 to May 2026",
    badge: "Product",
    body: "Multi-vendor Jordanian marketplace with web and mobile apps, Supabase backend, PayPal, Careem Express localization, and AI-assisted listing flows.",
    stack: ["Next.js", "Supabase", "ShadCN", "Capacitor", "PayPal"],
    images: [{ src: "/cv-shots/seiq.png", alt: "Seiq marketplace" }],
  },
  {
    title: "PR Director and Developer",
    org: "AUC Symposium",
    date: "Jan 2025 to Jun 2025",
    badge: "Leadership",
    body: "Led PR for Regional Partnerships for Peace, established MENA university partnerships, and built the symposium website.",
    stack: ["PR", "Partnerships", "Web"],
  },
  {
    title: "OCR Developer",
    org: "Jordanian Law Project",
    date: "Jul 2025 to Aug 2025",
    badge: "AI",
    body: "Arabic OCR pipeline with Qwen3-VL, DocLayout-YOLO, and Gemini 2.5 Flash Lite. 99.3% accuracy at 10x lower cost than cloud alternatives.",
    stack: ["Qwen3-VL", "DocLayout-YOLO", "Gemini", "Python"],
  },
  {
    title: "Back End Developer",
    org: "Sitech",
    date: "Dec 2024 to Feb 2025",
    badge: "Internship",
    body: "Built a Spotify Controller with Django REST APIs and a CRM with AI lead scoring using DeepSeek and BAML.",
    stack: ["Django", "REST", "DeepSeek", "BAML"],
  },
  {
    title: "AI Researcher",
    org: "College of Charleston",
    date: "Sep 2024 to Jan 2025",
    badge: "Research",
    body: "Researched LSTM-based anomaly detection for electricity transformer sensors and security vulnerabilities in critical infrastructure.",
    stack: ["LSTM", "Security", "Anomaly detection"],
  },
  {
    title: "Freelance Developer",
    org: "Qatar Foundation",
    date: "Jul 2024 to Aug 2024",
    badge: "Unity",
    body: "Built a Unity 3D mobile tour of Zubarah Town ruins and an interactive video platform with timed quizzes for the Rasekh initiative.",
    stack: ["Unity", "C#", "Mobile"],
  },
  {
    title: "Game Developer Intern",
    org: "Largelabs",
    date: "Jun 2024 to Sep 2024",
    badge: "Game dev",
    body: "Implemented a save system for Threads of Life using C#, BSON serialization, and multithreading for game state persistence.",
    stack: ["Unity", "C#", "BSON", "Multithreading"],
  },
];

const PROJECTS: { name: string; metric?: string; body: string; stack: string[]; image?: string }[] = [
  {
    name: "Linux Process Manager",
    body: "Rust process manager with TUI, REST API, React web UI, GPU monitoring, container awareness, and anomaly detection.",
    stack: ["Rust", "React", "SQLite", "Tokio", "Docker", "Prometheus"],
    image: "/cv-shots/process-manager.png",
  },
  {
    name: "Restaurant POS",
    body: "Restaurant POS with Kitchen Display, table management, inventory, loyalty, PWA offline support, and Arabic/English UI.",
    stack: ["Next.js 15", "React 19", "tRPC", "Supabase", "PWA"],
    image: "/cv-shots/pos.png",
  },
  {
    name: "MDVRP Solver",
    metric: "78-88% fulfillment",
    body: "Beltone AI Hackathon solver with BFS pathfinding, capacity-aware routing, fallbacks, and a Streamlit dashboard.",
    stack: ["Python", "BFS", "Streamlit"],
  },
  {
    name: "CV Bot",
    metric: "Job automation",
    body: "Automated job-search assistant with resume parsing, LinkedIn search, AI cover letters, CV tailoring, and Easy Apply form automation.",
    stack: ["Python", "Streamlit", "Playwright", "OpenRouter", "SQLite"],
  },
  {
    name: "PAYG AI Chat",
    metric: "Multi-model chat",
    body: "Pay-as-you-go AI chat supporting OpenAI, Claude, Gemini, and OpenRouter with transparent per-request pricing.",
    stack: ["OpenAI", "Claude", "Gemini", "OpenRouter"],
  },
];

const SKILLS = [
  ["Languages", "Rust", "C++", "C", "Python", "TypeScript", "C#", "SQL"],
  ["Frameworks", "React", "Next.js", "Nest.js", "Express", "Django", "tRPC", "PyTorch"],
  ["Infra and data", "Supabase", "PostgreSQL", "MongoDB", "Docker", "REST APIs"],
  ["AI and ML", "RAG", "GenAI", "Forecasting", "OCR", "DeepSeek", "Qwen", "Gemini", "OpenRouter", "BAML"],
  ["Languages spoken", "Arabic native", "English IELTS 8.0"],
];

function AskButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="btn-ledge inline-flex items-center gap-1.5 rounded-xl bg-sand px-3.5 py-2 text-[14px] font-bold text-pop"
    >
      <MessageCircle className="h-4 w-4" /> Ask about this
    </button>
  );
}

function Pills({ items }: { items: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {items.map((item) => (
        <Tag key={item}>{item}</Tag>
      ))}
    </div>
  );
}

export function CvSnapshot() {
  const { ask } = useChat();
  const askAbout = (q: string) => ask(q, { openDock: true, excited: true });

  return (
    <section id="cv" className="relative bg-bg py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1180px] space-y-24 px-5 sm:px-8 lg:px-10">
        <div>
          <SectionHeader
            num="01"
            title="Work"
            sub="Roles, wins and what I actually built. Open a row for the detail, or ask the avatar for the long version."
          />
          <div className="mt-10 space-y-3">
            {EXPERIENCE.map((item, index) => (
              <details key={item.title + item.org} className="reveal group" open={index < 2}>
                <summary className="list-none">
                  <Card interactive className="flex cursor-pointer items-start justify-between gap-4 px-5 py-4 group-open:rounded-b-none group-open:border-b-0 sm:items-center">
                    <div className="min-w-0">
                      <h3 className="font-display text-[19px] font-bold leading-tight text-ink">{item.title}</h3>
                      <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[15px] text-ink-mute">
                        <span>{item.org}</span>
                        <span aria-hidden className="text-line">|</span>
                        <span className="font-semibold text-sand">{item.date}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Tag tone={item.badge === "Winner" ? "lime" : item.badge === "Current" || item.badge === "Contract" ? "palm" : "plain"}>
                        {item.badge === "Winner" && <Trophy className="h-3.5 w-3.5" />}
                        {item.badge}
                      </Tag>
                      <span className="grid h-8 w-8 place-items-center rounded-lg border-[1.5px] border-line text-ink-mute transition-colors group-hover:border-sand group-hover:text-sand">
                        <Plus className="h-4 w-4 transition-transform group-open:rotate-45" />
                      </span>
                    </div>
                  </Card>
                </summary>
                <div className="grid gap-5 rounded-b-2xl border-[1.5px] border-t-0 border-line bg-bg-2 px-5 pb-5 pt-1 md:grid-cols-[1fr_260px]">
                  <div>
                    <p className="max-w-[760px] text-[16px] leading-relaxed text-ink-mute">{item.body}</p>
                    <Pills items={item.stack} />
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <AskButton onClick={() => askAbout(`Tell me about your ${item.title} role at ${item.org}: what you built, the stack, and the hardest problem.`)} />
                      {item.links?.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-xl border-[1.5px] border-line px-3 py-1.5 text-[14px] font-semibold text-ink transition hover:border-sand hover:text-sand"
                        >
                          {link.label} <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                  {item.images && (
                    <div className="grid content-start gap-3">
                      {item.images.map((image) => {
                        const img = <img src={image.src} alt={image.alt ?? `${item.org} screenshot`} className="h-full min-h-[130px] w-full object-cover" />;
                        return image.href ? (
                          <a
                            key={image.src}
                            href={image.href}
                            target="_blank"
                            rel="noreferrer"
                            title={`Open ${image.href.replace("https://", "")}`}
                            className="block overflow-hidden rounded-xl border-[1.5px] border-line transition hover:border-sand"
                          >
                            {img}
                          </a>
                        ) : (
                          <div key={image.src} className="overflow-hidden rounded-xl border-[1.5px] border-line">
                            {img}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>

        <div>
          <SectionHeader num="02" title="Projects" sub="Things I built outside the day job, each with a reason to exist." />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {PROJECTS.map((item) => (
              <Card key={item.name} interactive className="reveal flex flex-col overflow-hidden">
                {item.image && (
                  <div className="border-b-[1.5px] border-line">
                    <img src={item.image} alt={`${item.name} screenshot`} className="h-[180px] w-full object-cover" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-[20px] font-bold leading-tight text-ink">{item.name}</h3>
                    {item.metric && <Tag tone="palm">{item.metric}</Tag>}
                  </div>
                  <p className="mt-3 flex-1 text-[16px] leading-relaxed text-ink-mute">{item.body}</p>
                  <Pills items={item.stack} />
                  <div className="mt-4">
                    <AskButton onClick={() => askAbout(`Walk me through the ${item.name} project: why you built it, how it works, and what you'd do differently.`)} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <SectionHeader num="03" title="Education & skills" />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {EDUCATION.map((item) => (
              <Card key={item.school} className="p-5">
                <span className="text-[14px] font-semibold text-sand">{item.date}</span>
                <h3 className="mt-2 font-display text-[19px] font-bold leading-tight text-ink">{item.title}</h3>
                <p className="mt-0.5 text-[15px] text-ink-mute">{item.school}</p>
                <p className="mt-3 text-[16px] leading-relaxed text-ink-mute">{item.body}</p>
              </Card>
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SKILLS.map(([group, ...items]) => (
              <Card key={group} className="p-5">
                <h3 className="text-[15px] font-bold text-ink">{group}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {items.map((it) => (
                    <Tag key={it}>{it}</Tag>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
