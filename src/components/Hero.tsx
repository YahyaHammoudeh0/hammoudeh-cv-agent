import { useEffect, useRef, useState } from "react";
import { Agent, type AgentState } from "./Agent";
import { ChatBox } from "./ChatBox";
import { streamChat } from "../lib/chatStream";

const CHIPS = [
  "Give me the 30-second CV",
  "Why hire you?",
  "Tell me about FlowCast and Deloitte",
  "What did you build at ZagTrader?",
  "Explain the Arabic OCR project",
  "What is your thesis about?",
  "Which project proves backend depth?",
  "What makes you different from other juniors?",
];

const CV_HOOKS = [
  {
    label: "Deloitte winner",
    detail: "FlowCast inventory forecasting",
    question: "Tell me about FlowCast and the Deloitte hackathon win",
  },
  {
    label: "99.3% OCR",
    detail: "Arabic legal document pipeline",
    question: "Explain the Arabic OCR project and why it matters",
  },
  {
    label: "ZagTrader",
    detail: "brokerage RAG and voice agent",
    question: "What did you build at ZagTrader?",
  },
  {
    label: "Systems depth",
    detail: "Rust process manager, 121 tests",
    question: "Which project proves backend and systems depth?",
  },
];

export function Hero() {
  const [state, setState] = useState<AgentState>("idle");
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const responseTimer = useRef<number | null>(null);
  const idleTimer = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const clearTimers = () => {
    if (responseTimer.current) window.clearTimeout(responseTimer.current);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
  };

  useEffect(() => () => {
    clearTimers();
    abortRef.current?.abort();
  }, []);

  const askAgent = async (text: string, excited = false) => {
    clearTimers();
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setResponse("");
    setIsStreaming(true);
    setState(excited ? "excited" : "thinking");

    // Brief excited beat before transitioning to thinking, just like the old
    // demo cycle. Tokens start arriving almost immediately so we drop straight
    // to "answering" on first delta.
    if (excited) {
      responseTimer.current = window.setTimeout(
        () => setState("thinking"),
        700,
      );
    }

    let firstDelta = true;
    await streamChat(
      text,
      {
        onDelta: (delta) => {
          if (firstDelta) {
            firstDelta = false;
            setState("answering");
          }
          setResponse((r) => r + delta);
        },
        onDone: () => {
          setIsStreaming(false);
          idleTimer.current = window.setTimeout(() => setState("idle"), 1500);
        },
        onError: (msg) => {
          setResponse(msg);
          setIsStreaming(false);
          setState("confused");
          idleTimer.current = window.setTimeout(() => setState("idle"), 2000);
        },
      },
      controller.signal,
    );
  };

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-line bg-bg/60 px-5 py-5 backdrop-blur sm:px-10 sm:py-6">
        <div className="font-display text-[16px] font-extrabold tracking-[0.18em] sm:text-[18px]">HAMMOUDEH</div>
        <nav className="flex gap-4 text-[10px] uppercase tracking-widest text-ink-mute sm:gap-7 sm:text-[12px]">
          <a href="#cv" className="transition hover:text-ink">CV</a>
          <a href="#thought-process" className="transition hover:text-ink">RAG</a>
          <a href="#contact" className="transition hover:text-ink">Contact</a>
        </nav>
      </header>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[18%] h-[6px] w-[60%] rotate-[-4deg] rounded-full bg-sand opacity-30 blur-[40px]" />
        <div className="absolute left-[32%] top-[58%] h-[4px] w-[55%] rotate-[3deg] rounded-full bg-cool opacity-25 blur-[50px]" />
        <div className="absolute left-[8%] top-[78%] h-[5px] w-[70%] rotate-[-2deg] rounded-full bg-sand opacity-20 blur-[55px]" />
      </div>

      {/* Robot lives in its own absolute layer behind the hero content. */}
      <Agent
        state={state}
        className="absolute inset-x-0 top-0 z-0 h-[68vh] pointer-events-none"
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-end px-6 pt-24 pb-16">
        <h1 className="text-center font-display text-[64px] sm:text-[84px] font-semibold leading-[0.95] tracking-tight">
          Ask <em className="font-normal italic text-sand">Hammoudeh.</em>
        </h1>
        <p className="mt-4 max-w-[520px] text-center text-[15px] leading-relaxed text-ink-mute">
          An agent trained on Mohammad's work — the projects, the decisions, the tradeoffs. He'll tell you what you want to know.
        </p>

        <div className="mt-7 flex min-h-[292px] w-full flex-col items-center gap-3">
          <ChatBox
            chips={CHIPS}
            onTypingChange={(typing) => {
              if (isStreaming) return;
              if (typing) {
                clearTimers();
                setState("typing");
              } else if (state === "typing") {
                setState("idle");
              }
            }}
            onSubmit={(text) => askAgent(text, false)}
            onChipClick={(text) => askAgent(text, true)}
          />

          <div className="grid w-full max-w-[720px] grid-cols-2 gap-1.5 opacity-90 sm:grid-cols-4">
            {CV_HOOKS.map((hook) => (
              <button
                key={hook.label}
                onClick={() => askAgent(hook.question, true)}
                className="group rounded-lg border border-line bg-bg-2/35 px-3 py-1.5 text-left backdrop-blur transition hover:border-sand hover:bg-sand/[0.06]"
              >
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-sand">
                  {hook.label}
                </div>
                <div className="mt-1 text-[11.5px] leading-4 text-ink-mute transition group-hover:text-ink">
                  {hook.detail}
                </div>
              </button>
            ))}
          </div>

          <div
            className={`w-full max-w-[640px] rounded-2xl border border-line bg-bg-2/70 p-5 backdrop-blur transition-opacity ${
              response || isStreaming ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sand">
                Hammoudeh
              </div>
              <p className="max-h-[136px] overflow-y-auto whitespace-pre-wrap pr-2 text-[15px] leading-relaxed text-ink">
                {response || "Thinking..."}
                {isStreaming && (
                  <span className="ml-1 inline-block h-[14px] w-[2px] animate-pulse bg-sand align-middle" />
                )}
              </p>
            </div>
        </div>

        <a
          href="#thought-process"
          className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint transition hover:text-sand"
        >
          See how he works ↓
        </a>
      </div>
    </section>
  );
}
