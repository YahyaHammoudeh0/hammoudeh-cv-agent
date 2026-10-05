import { useEffect, useRef, useState } from "react";
import { LazyAvatar as Avatar } from "./LazyAvatar";
import { ChatBox } from "./ChatBox";
import { JobMatch } from "./JobMatch";
import { AnswerCard } from "../chat/AnswerCard";
import { useChat } from "../chat/chatContext";
import { ArrowUpRight, Target } from "lucide-react";

const CHIPS = [
  "Give me the 30-second CV",
  "Why hire you?",
  "What are you doing at EY now?",
  "What did you build at ZagTrader?",
  "Tell me about FlowCast and Deloitte",
  "Which project proves backend depth?",
];

const CV_HOOKS = [
  { label: "EY", detail: "AI Engineer, GenAI POC to product", question: "What are you doing now at EY?" },
  { label: "Loving Loyalty", detail: "Forecasting + leading the app redesign", question: "What do you do at Loving Loyalty, and what does the app redesign involve?" },
  { label: "Deloitte 1st place", detail: "FlowCast inventory forecasting", question: "Tell me about FlowCast and the Deloitte hackathon win" },
  { label: "IMA winner", detail: "MEA finals, Riyadh 2026", question: "Tell me about winning the IMA Student Case Competition" },
]

const GREETING = "Hey, I'm the 3D me. Ask me anything about my work, or poke me.";
const POKE_LINES = ["Hey!", "Easy.", "I'm working here!", "Okay, okay.", "Personal space?", "Again?!"];
const BOX_LINE = "Alright. Square up.";

const stamp = () => performance.now();
const pickOne = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

interface Burst {
  id: number;
  text: string;
  x: number;
  y: number;
}

export function Hero() {
  const { messages, streaming, avatarState, oneShot, play, ask, setTyping, setDockOpen } = useChat();
  const [jobOpen, setJobOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [bursts, setBursts] = useState<Burst[]>([]);
  const pokes = useRef<number[]>([]);
  const lastPointer = useRef({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);

  const answer = [...messages].reverse().find((m) => m.role === "assistant");
  const answerIdx = answer ? messages.indexOf(answer) : -1;
  const question = answerIdx > 0 ? messages[answerIdx - 1].text : undefined;
  const live = streaming && answerIdx === messages.length - 1;

  const onReady = () => {
    window.setTimeout(() => {
      play("wave");
      setGreeting(GREETING);
    }, 700);
  };

  const onPoke = () => {
    if (streaming) return;
    const now = stamp();
    pokes.current = [...pokes.current.filter((t) => now - t < 3500), now];
    const rect = stageRef.current?.getBoundingClientRect();
    const x = rect ? lastPointer.current.x - rect.left : 0;
    const y = rect ? lastPointer.current.y - rect.top : 0;
    if (pokes.current.length >= 5) {
      pokes.current = [];
      play("dance");
      setGreeting(BOX_LINE);
      return;
    }
    play("poke");
    const id = now;
    setBursts((b) => [...b, { id, text: pickOne(POKE_LINES), x, y }]);
    window.setTimeout(() => setBursts((b) => b.filter((item) => item.id !== id)), 950);
  };

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden lg:h-[100svh] lg:min-h-[720px]">
      <Header onJobMatch={() => setJobOpen(true)} onChat={() => setDockOpen(true)} />
      <JobMatch open={jobOpen} onClose={() => setJobOpen(false)} />
      <HeroBackdrop />

      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] flex-1 grid-cols-1 items-center lg:min-h-0 lg:grid-rows-[minmax(0,1fr)] gap-2 px-5 pb-14 pt-20 sm:px-8 lg:grid-cols-[1fr_0.95fr] lg:gap-6 lg:px-10 lg:pt-20">
        {/* Avatar stage: first on mobile, right column on desktop. */}
        <div
          ref={stageRef}
          className="relative order-1 h-[54svh] min-h-[380px] lg:order-2 lg:h-[86svh]"
          onPointerDownCapture={(e) => (lastPointer.current = { x: e.clientX, y: e.clientY })}
        >
          {/* Mobile: the campus sits right behind him, walkway under his feet. */}
          <div className="pointer-events-none absolute -left-5 -right-5 -top-20 bottom-0 overflow-hidden sm:-left-8 sm:-right-8 lg:hidden" aria-hidden>
            <img src="/bg/auc-hero-sm.webp" alt="" className="h-full w-full object-cover object-[64%_88%]" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-bg" />
          </div>

          {/* Canvas bleeds past the stage so wide or raised gestures never hit an edge. */}
          <Avatar
            state={avatarState}
            oneShot={oneShot}
            lookAtCursor
            onPoke={onPoke}
            onReady={onReady}
            framing="hero"
            className="absolute -top-[18%] bottom-0 -left-5 -right-5 sm:-left-8 sm:-right-8 lg:-left-[30%] lg:-right-[30%]"
          />

          {bursts.map((b) => (
            <span
              key={b.id}
              className="pointer-events-none absolute z-30 animate-rise whitespace-nowrap rounded-lg bg-ink px-3 py-1 font-display text-[14px] font-bold text-pop"
              style={{ left: b.x, top: b.y - 20, transform: "translateX(-50%)" }}
            >
              {b.text}
            </span>
          ))}

        </div>

        {/* Copy + chat. On desktop the hero is locked to the viewport and the answer card
            absorbs leftover height, so a long answer never resizes the stage or backdrop. */}
        <div className="relative z-20 order-2 flex flex-col items-center text-center lg:order-1 lg:h-full lg:min-h-0 lg:items-start lg:justify-center lg:text-left">
          <h1 className="font-display text-[42px] font-extrabold leading-[0.92] tracking-[-0.03em] text-ink sm:text-[72px] lg:text-[84px]">
            Ask <span className="text-sand">Yahya</span>
            <span className="text-ink">.</span>
          </h1>
          <p className={`mt-4 max-w-[500px] text-[16px] leading-relaxed text-ink-mute ${answer ? "lg:hidden" : ""}`}>
            A 3D version of me, wired to an agent that knows my projects, decisions and tradeoffs.
            It answers from my actual work, remembers the conversation, and shows its sources.
          </p>

          <div className="mt-6 w-full max-w-[600px]">
            <ChatBox
              chips={answer ? [] : CHIPS}
              onTypingChange={setTyping}
              onSubmit={(text) => ask(text)}
              onChipClick={(text) => ask(text, { excited: true })}
            />
          </div>

          <div
            className={`flex min-h-0 w-full max-w-[600px] flex-col overflow-hidden transition-all duration-300 ${
              answer || greeting ? "mt-4 max-h-[520px] opacity-100" : "mt-0 max-h-0 opacity-0"
            }`}
          >
            <div className="flex min-h-0 flex-col rounded-2xl border-[1.5px] border-line bg-bg-2 p-4 text-left">
              <div className="mb-2 flex shrink-0 items-center gap-2 text-[12px] font-semibold text-ink-mute">
                <img src="/avatar-face.webp" alt="" className="h-6 w-6 shrink-0 rounded-full border border-line object-cover" />
                {question ? <span className="truncate">“{question}”</span> : "Yahya"}
                {answer && (
                  <button onClick={() => setDockOpen(true)} className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-lg border-[1.5px] border-line px-2.5 py-1 text-[13px] font-semibold text-ink-mute transition-colors hover:border-sand hover:text-sand">
                    open chat <ArrowUpRight className="ml-0.5 inline h-3 w-3" />
                  </button>
                )}
              </div>
              {answer ? (
                <AnswerCard answer={answer} question={question} live={live} />
              ) : (
                <p className="text-[15px] leading-relaxed text-ink">{greeting}</p>
              )}
            </div>
          </div>

          <div className="mt-5 grid w-full max-w-[600px] grid-cols-2 gap-2 sm:grid-cols-4">
            {CV_HOOKS.map((hook) => (
              <button
                key={hook.label}
                onClick={() => ask(hook.question, { excited: true })}
                className="group rounded-2xl border-[1.5px] border-line bg-bg-2 px-3.5 py-2.5 text-left transition-colors hover:border-sand"
              >
                <div className="font-display text-[14px] font-bold text-ink group-hover:text-sand">{hook.label}</div>
                <div className="mt-0.5 text-[13px] leading-4 text-ink-mute">{hook.detail}</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setJobOpen(true)}
            className={`btn-ledge mt-4 flex items-center gap-3 rounded-2xl bg-sand px-4 py-3 text-left ${answer ? "lg:hidden" : ""}`}
          >
            <Target className="h-6 w-6 shrink-0 text-pop" />
            <span>
              <span className="block font-display text-[15px] font-bold text-pop">Hiring? Run a job match.</span>
              <span className="block text-[13.5px] text-white/80">Paste a JD, get an honest fit score with proof and gaps.</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

/** Desktop: AUC campus painting across the hero, drifting a few px with the cursor. */
function HeroBackdrop() {
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = layer.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * -14;
        const y = (e.clientY / window.innerHeight - 0.5) * -8;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.05)`;
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block" aria-hidden>
      <div ref={layer} className="absolute -inset-4 transition-transform duration-300 ease-out" style={{ transform: "scale(1.05)" }}>
        <img src="/bg/auc-hero.webp" alt="" className="h-full w-full object-cover object-[45%_62%]" />
      </div>
      <div className="absolute inset-y-0 left-0 w-[62%] bg-gradient-to-r from-bg/95 via-bg/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}

function Header({ onJobMatch, onChat }: { onJobMatch: () => void; onChat: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-[1.5px] border-line bg-bg-2/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3.5 sm:px-8 lg:px-10">
        <a href="#top" className="group flex items-center gap-2.5">
          <img src="/avatar-face.webp" alt="" className="h-9 w-9 rounded-xl border-[1.5px] border-line bg-bg-3 object-cover" />
          <span className="font-display text-[18px] font-extrabold tracking-tight text-ink">Yahya Hammoudeh</span>
        </a>
        <nav className="flex items-center gap-4 text-[13px] font-semibold text-ink-mute sm:gap-6">
          <a href="#cv" className="hidden transition hover:text-ink sm:inline">Work</a>
          <button onClick={onJobMatch} className="hidden transition hover:text-ink md:inline">Job match</button>
          <a href="#contact" className="hidden transition hover:text-ink sm:inline">Contact</a>
          <button onClick={onChat} className="btn-ledge inline-flex items-center gap-1.5 rounded-xl bg-sand px-4 py-2 text-pop">
            Chat
          </button>
        </nav>
      </div>
    </header>
  );
}
