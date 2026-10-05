import { useEffect, useRef, useState } from "react";
import type { AgentState, OneShot } from "./Avatar";
import { LazyAvatar as Avatar } from "./LazyAvatar";
import { ArrowUp } from "lucide-react";
import { SectionHeader, Tag } from "./ui";

const MODEL_LABEL =
  (import.meta.env.VITE_CHAT_MODEL as string | undefined)?.trim() || "deepseek/deepseek-v4.1-flash";

const PHASES: { eyebrow: string; title: string; body: string; state: AgentState }[] = [
  {
    eyebrow: "Step 1 · Question",
    title: "Read the question.",
    body: "Pull out project names, skills, constraints and what you actually want to know.",
    state: "typing",
  },
  {
    eyebrow: "Step 2 · Retrieval",
    title: "Search the work.",
    body: "Look across CV notes, project summaries, READMEs and GitHub metadata.",
    state: "thinking",
  },
  {
    eyebrow: "Step 3 · Context",
    title: "Pack the evidence.",
    body: "Keep only the strongest chunks and build the model context from them.",
    state: "thinking",
  },
  {
    eyebrow: "Step 4 · Model",
    title: "Answer from context.",
    body: `${MODEL_LABEL} writes the answer using only the retrieved evidence.`,
    state: "answering",
  },
  {
    eyebrow: "Step 5 · Response",
    title: "Grounded, then streamed.",
    body: "The answer streams back to the chat up top. Go on, scroll up and try it.",
    state: "idle",
  },
];

const DOCS = [
  { name: "cv.md", tag: "experience", x: -150, y: -120, r: -8 },
  { name: "zagtrader/README", tag: "RAG · voice", x: 140, y: -150, r: 6 },
  { name: "projects.json", tag: "stack", x: -175, y: 40, r: 5 },
  { name: "github: repos", tag: "metadata", x: 160, y: 20, r: -5 },
  { name: "flowcast.md", tag: "forecasting", x: -110, y: 150, r: 9 },
  { name: "ocr-pipeline.md", tag: "Arabic OCR", x: 120, y: 150, r: -7 },
];

function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [oneShot, setOneShot] = useState<{ name: OneShot; id: number } | null>(null);
  const lastPhase = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = clamp(-rect.top / Math.max(rect.height - window.innerHeight, 1));
      setProgress(p);
      const next = Math.min(PHASES.length - 1, Math.floor(p * PHASES.length));
      setPhase(next);
      if (next !== lastPhase.current) {
        if (next === PHASES.length - 1) setOneShot({ name: "excited", id: Date.now() });
        lastPhase.current = next;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const current = PHASES[phase];

  return (
    <section ref={sectionRef} id="thought-process" className="relative h-[420vh] bg-bg-3">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden border-y-[1.5px] border-line">
        {/* Faint grid, like a whiteboard behind him. */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#10261A_1px,transparent_1px),linear-gradient(90deg,#10261A_1px,transparent_1px)] [background-size:56px_56px]" />

        <div className="relative mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-4 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div className="relative z-10 order-2 lg:order-1">
            <SectionHeader num="04" title="How the answer forms" />

            <article key={phase} className="mt-8 max-w-[440px] animate-pop rounded-2xl border-[1.5px] border-line bg-bg-2 p-5 lg:mt-10">
              <Tag tone="palm">{current.eyebrow}</Tag>
              <h3 className="mt-3 font-display text-[26px] font-bold leading-[1.05] text-ink sm:text-[30px]">{current.title}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-mute">{current.body}</p>
            </article>

            <div className="mt-6 flex max-w-[420px] items-center gap-2">
              {PHASES.map((p, i) => (
                <div key={p.eyebrow} className="h-2 flex-1 overflow-hidden rounded bg-line">
                  <div
                    className="h-full rounded bg-sand transition-[width] duration-150"
                    style={{ width: `${clamp(progress * PHASES.length - i) * 100}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="relative order-1 h-[52svh] lg:order-2 lg:h-[84svh]">
            <Avatar state={current.state} oneShot={oneShot} lookAtCursor={false} framing="half" className="absolute inset-0" />
            <Props phase={phase} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** The floating paper trail around the avatar for each phase. */
function Props({ phase }: { phase: number }) {
  const stacked = phase >= 2;
  return (
    <div className="pointer-events-none absolute left-1/2 top-[44%] z-10 h-0 w-0">
      {/* 01: the question */}
      <div
        className={`absolute -translate-x-1/2 transition-all duration-500 ${phase === 0 ? "opacity-100" : "-translate-y-6 opacity-0"}`}
        style={{ top: -230 }}
      >
        <div className="whitespace-nowrap rounded-2xl rounded-bl-md border-[1.5px] border-line bg-bg-2 px-4 py-2.5 text-[15px] text-ink-mute">
          What did you <mark className="rounded bg-pop px-1 text-ink">build</mark> at{" "}
          <mark className="rounded bg-pop px-1 text-ink">ZagTrader</mark>?
        </div>
      </div>

      {/* 02–03: docs fly in, then stack */}
      {DOCS.map((d, i) => {
        const visible = phase === 1 || phase === 2;
        const x = stacked ? 150 + i * 2 : d.x;
        const y = stacked ? -40 - i * 7 : d.y;
        const r = stacked ? (i % 2 ? 2 : -2) : d.r;
        return (
          <div
            key={d.name}
            className="absolute transition-all duration-700 ease-[cubic-bezier(.2,.9,.3,1.15)]"
            style={{
              transform: `translate(calc(${x}px - 50%), ${y}px) rotate(${r}deg) scale(${visible ? 1 : 0.6})`,
              opacity: visible ? (phase === 2 && i > 3 ? 0 : 1) : 0,
              transitionDelay: `${i * 60}ms`,
            }}
          >
            <div className="w-[150px] rounded-xl border-[1.5px] border-line bg-white px-3 py-2 text-left">
              <div className="truncate font-mono text-[10.5px] font-medium text-ink">{d.name}</div>
              <div className="mt-1 h-1 w-3/4 rounded bg-ink/15" />
              <div className="mt-1 h-1 w-1/2 rounded bg-ink/15" />
              <div className="mt-1.5 inline-block rounded-md bg-sand px-1.5 py-0.5 text-[10px] font-bold text-pop">
                {d.tag}
              </div>
            </div>
          </div>
        );
      })}

      {/* 04: model streaming */}
      <div
        className={`absolute -translate-x-1/2 transition-all duration-500 ${phase === 3 ? "opacity-100" : "translate-y-4 opacity-0"}`}
        style={{ top: -250 }}
      >
        <div className="w-[240px] rounded-xl border-[1.5px] border-line bg-bg-2 p-3">
          <div className="font-mono text-[11px] text-sand">{MODEL_LABEL}</div>
          <div className="mt-2 space-y-1.5">
            {[90, 75, 82, 40].map((w, i) => (
              <div key={i} className="h-1.5 animate-pulse rounded bg-ink/25" style={{ width: `${w}%`, animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>

      {/* 05: done */}
      <div
        className={`absolute -translate-x-1/2 transition-all duration-500 ${phase === 4 ? "opacity-100" : "translate-y-4 opacity-0"}`}
        style={{ top: 230 }}
      >
        <a
          href="#top"
          className="btn-ledge pointer-events-auto inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-sand px-4 py-2.5 text-[14px] font-bold text-pop"
        >
          <ArrowUp className="h-4 w-4" /> Try asking me
        </a>
      </div>
    </div>
  );
}
