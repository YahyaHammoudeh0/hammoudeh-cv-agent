import { useEffect, useRef } from "react";
import { ChatBox } from "../components/ChatBox";
import { AnswerCard } from "./AnswerCard";
import { useChat } from "./chatContext";
import { X } from "lucide-react";

const STARTERS = ["Give me the 30-second CV", "What are you doing at EY now?", "Which project proves backend depth?"];

/** Floating chat thread, reachable from anywhere on the page. */
export function ChatDock() {
  const { messages, streaming, ask, setTyping, dockOpen, setDockOpen, reset } = useChat();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, dockOpen]);

  useEffect(() => {
    if (!dockOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDockOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dockOpen, setDockOpen]);

  return (
    <div
      role="dialog"
      aria-label="Chat with Yahya"
      aria-hidden={!dockOpen}
      className={`fixed inset-x-2 bottom-2 z-[70] flex max-h-[78svh] flex-col overflow-hidden rounded-2xl border-[1.5px] border-ink bg-bg-2 shadow-[6px_6px_0_#10261A] transition-all duration-300 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[420px] ${
        dockOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="flex items-center gap-3 border-b-[1.5px] border-line bg-sand px-4 py-3">
        <img src="/avatar-face.webp" alt="" className="h-9 w-9 rounded-xl bg-bg-3 object-cover" />
        <div className="min-w-0 flex-1">
          <div className="font-display text-[16px] font-bold leading-tight text-pop">Yahya</div>
          <div className="flex items-center gap-1.5 text-[13px] text-white/75">
            <span className={`h-1.5 w-1.5 rounded-sm ${streaming ? "animate-pulse bg-pop" : "bg-pop"}`} />
            {streaming ? "typing…" : "answers from my real work"}
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={reset} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[13px] font-semibold text-white/80 hover:bg-white/10 hover:text-white" title="Start over">
            new
          </button>
        )}
        <button onClick={() => setDockOpen(false)} aria-label="Close chat" className="grid h-8 w-8 place-items-center rounded-lg text-white/80 hover:bg-white/10 hover:bg-bg-3 hover:text-ink">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div>
            <p className="text-[15px] leading-relaxed text-ink-mute">
              Ask me anything about my work. I remember the conversation, so follow-ups work.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {STARTERS.map((q) => (
                <button key={q} onClick={() => ask(q)} className="rounded-lg border-[1.5px] border-line px-3 py-1.5 text-[14px] font-medium text-ink-mute transition-colors hover:border-sand hover:text-sand">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={m.id} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-sand px-3.5 py-2 text-[15px] font-medium text-white">
              {m.text}
            </div>
          ) : (
            <div key={m.id} className="max-w-[95%] rounded-2xl rounded-bl-md border-[1.5px] border-line bg-bg px-3.5 py-2.5">
              <AnswerCard
                answer={m}
                question={messages[i - 1]?.text}
                live={streaming && i === messages.length - 1}
                compact
              />
            </div>
          ),
        )}
      </div>

      <div className="border-t-[1.5px] border-line p-3">
        <ChatBox chips={[]} onTypingChange={setTyping} onSubmit={(t) => ask(t)} onChipClick={(t) => ask(t)} />
      </div>
    </div>
  );
}
