const FACTS = [
  { label: "AUC CS graduate", value: "2026", detail: "B.Sc. Computer Science" },
  { label: "AUC GPA", value: "3.3", detail: "Computer Science" },
  { label: "IELTS", value: "8.0", detail: "Advanced English" },
  { label: "Scholarship", value: "MEPI", detail: "Full U.S. Department of State scholarship" },
];

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
    title: "AI Engineer",
    org: "Loving Loyalty",
    date: "Mar 2026 to present",
    badge: "Current",
    body: "Building predictive intelligence for POS data — demand forecasting and business-insight models — and leading a four-engineer team through a POS codebase refactor.",
    stack: ["Forecasting", "POS analytics", "Python"],
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

const PROJECTS = [
  {
    name: "Linux Process Manager",
    metric: "121 tests",
    body: "Rust process manager with TUI, REST API, React web UI, GPU monitoring, container awareness, and anomaly detection.",
    stack: ["Rust", "React", "SQLite", "Tokio", "Docker", "Prometheus"],
    image: "/cv-shots/process-manager.png",
  },
  {
    name: "Restaurant POS",
    metric: "324 tests",
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

function Pills({ items }: { items: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-md border border-line/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-ink-mute"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function CvSnapshot() {
  return (
    <section id="cv" className="relative border-y border-line bg-bg py-24">
      <div className="mx-auto grid w-full max-w-[1180px] gap-14 px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-10">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-sand">
            CV Snapshot
          </div>
          <h2 className="mt-4 font-display text-[44px] leading-[0.96] tracking-tight text-ink sm:text-[58px]">
            The factual scan.
          </h2>
          <p className="mt-5 max-w-[470px] text-[15px] leading-7 text-ink-mute">
            Condensed from the older CV page and the site knowledge files. No
            filler stats, just education, experience, projects, skills, and
            concrete proof.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6">
            {FACTS.map((item) => (
              <div key={item.label} className="border-t border-line pt-4">
                <div className="font-display text-[30px] leading-none text-ink">
                  {item.value}
                </div>
                <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-sand">
                  {item.label}
                </div>
                <p className="mt-2 text-[11px] leading-4 text-ink-mute">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-2">
            <a
              href="mailto:yahyahammoudeh@aucegypt.edu"
              className="rounded-full border border-sand bg-sand px-4 py-2 text-[12px] font-semibold text-bg transition hover:bg-sand-bright"
            >
              Email Mohammad
            </a>
            <a
              href="https://github.com/YahyaHammoudeh0"
              className="rounded-full border border-line px-4 py-2 text-[12px] font-semibold text-ink-mute transition hover:border-sand hover:text-ink"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </aside>

        <div className="space-y-14">
          <div>
            <div className="mb-5 flex items-end justify-between gap-4 border-b border-line pb-3">
              <h3 className="font-display text-[28px] leading-none text-ink">
                Education
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                verified facts
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {EDUCATION.map((item) => (
                <article
                  key={item.school}
                  className="rounded-2xl border border-line bg-bg-2/35 p-5"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-sand">
                    {item.date}
                  </div>
                  <h4 className="mt-3 text-[16px] font-semibold leading-tight text-ink">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-[13px] text-ink-mute">{item.school}</p>
                  <p className="mt-4 text-[14px] leading-6 text-ink-mute">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-5 flex items-end justify-between gap-4 border-b border-line pb-3">
              <h3 className="font-display text-[28px] leading-none text-ink">
                Experience
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                full compact timeline
              </span>
            </div>

            <div className="space-y-3">
              {EXPERIENCE.map((item, index) => (
                <details
                  key={item.title + item.org}
                  className="group rounded-2xl border border-line bg-bg-2/35 transition hover:border-sand/70 hover:bg-bg-2/55"
                  open={index < 3}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-[16px] font-semibold leading-tight text-ink">
                          {item.title}
                        </h4>
                        <span className="rounded-full border border-sand/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-sand">
                          {item.badge}
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] text-ink-mute">
                        {item.org}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="hidden rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint sm:inline">
                        {item.date}
                      </span>
                      <span className="grid h-8 w-8 place-items-center rounded-full border border-line text-lg leading-none text-sand transition group-open:rotate-45">
                        +
                      </span>
                    </div>
                  </summary>
                  <div className="grid gap-5 px-5 pb-5 md:grid-cols-[1fr_220px]">
                    <div>
                      <p className="text-[14px] leading-6 text-ink-mute">
                        {item.body}
                      </p>
                      <Pills items={item.stack} />
                      {item.links && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {item.links.map((link) => (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full border border-sand/40 bg-sand/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-sand transition hover:bg-sand hover:text-bg"
                            >
                              {link.label} ↗
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    {item.images && (
                      <div className="grid content-start gap-3">
                        {item.images.map((image) => {
                          const shot = (
                            <>
                              <img
                                src={image.src}
                                alt={image.alt ?? `${item.org} screenshot`}
                                className="h-full min-h-[126px] w-full object-cover opacity-85 transition group-hover:scale-[1.03] group-hover:opacity-100"
                              />
                              {image.href && (
                                <span
                                  aria-hidden
                                  className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full border border-line bg-bg/80 text-[12px] leading-none text-sand opacity-0 backdrop-blur transition group-hover/img:opacity-100"
                                >
                                  ↗
                                </span>
                              )}
                            </>
                          );

                          return image.href ? (
                            <a
                              key={image.src}
                              href={image.href}
                              target="_blank"
                              rel="noreferrer"
                              title={`Open ${image.href.replace("https://", "")}`}
                              className="group/img relative block overflow-hidden rounded-xl border border-line bg-bg transition hover:border-sand/70"
                            >
                              {shot}
                            </a>
                          ) : (
                            <div
                              key={image.src}
                              className="relative overflow-hidden rounded-xl border border-line bg-bg"
                            >
                              {shot}
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
            <div className="mb-5 flex items-end justify-between gap-4 border-b border-line pb-3">
              <h3 className="font-display text-[28px] leading-none text-ink">
                Projects
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                selected proof
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {PROJECTS.map((item) => (
                <article
                  key={item.name}
                  className="rounded-2xl border border-line bg-bg-2/35 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-[16px] font-semibold leading-tight text-ink">
                      {item.name}
                    </h4>
                    <span className="shrink-0 rounded-full border border-sand/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-sand">
                      {item.metric}
                    </span>
                  </div>
                  <p className="mt-4 text-[14px] leading-6 text-ink-mute">
                    {item.body}
                  </p>
                  <Pills items={item.stack} />
                  {item.image && (
                    <div className="mt-5 overflow-hidden rounded-xl border border-line bg-bg">
                      <img
                        src={item.image}
                        alt={`${item.name} screenshot`}
                        className="h-[132px] w-full object-cover opacity-85"
                      />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>

          <div>
            <h3 className="border-b border-line pb-3 font-display text-[28px] leading-none text-ink">
              Skills
            </h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {SKILLS.map(([group, ...items]) => (
                <div key={group} className="border-t border-line pt-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-sand">
                    {group}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="rounded-md border border-line/80 px-2 py-1 text-[12px] text-ink-mute"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
