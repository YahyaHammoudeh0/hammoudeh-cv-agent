import { useEffect, useRef, useState } from "react";
import { useChat } from "../chat/chatContext";
import { MessageCircle, X } from "lucide-react";

type Section = "top" | "cv" | "thought-process" | "contact";

const LINES: Record<Section, string[]> = {
  top: [],
  cv: ["Curious about a role? Hit “Ask about this”.", "Every line here has a story. Ask me."],
  "thought-process": [],
  contact: ["Don't be a stranger.", "Email me. I actually reply."],
};

/** Mini me in the corner once the hero scrolls away. Click = open the chat dock.
 *  A 2D sticker on purpose: only one 3D avatar should ever be rendering. */
export function Companion() {
  const { dockOpen, setDockOpen, streaming } = useChat();
  const [section, setSection] = useState<Section>("top");
  const [line, setLine] = useState("");
  const [wiggle, setWiggle] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const seen = useRef(new Set<Section>());
  const lineTimer = useRef<number | null>(null);

  const reactTo = useRef((next: Section) => {
    if (next === "top" || next === "thought-process") return;
    const first = !seen.current.has(next);
    seen.current.add(next);
    const options = LINES[next];
    setLine(options[Math.floor(Math.random() * options.length)]);
    if (first) setWiggle((w) => w + 1);
    if (lineTimer.current) window.clearTimeout(lineTimer.current);
    lineTimer.current = window.setTimeout(() => setLine(""), 5200);
  });

  useEffect(() => {
    const ids: Section[] = ["top", "cv", "thought-process", "contact"];
    const ratios = new Map<Section, number>();
    let current: Section = "top";
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target.id as Section, e.intersectionRatio);
        let best: Section = "top";
        let bestRatio = -1;
        for (const id of ids) {
          const r = ratios.get(id) ?? 0;
          if (r > bestRatio) {
            best = id;
            bestRatio = r;
          }
        }
        if (best !== current) {
          current = best;
          setSection(best);
          reactTo.current(best);
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      io.disconnect();
      if (lineTimer.current) window.clearTimeout(lineTimer.current);
    };
  }, []);

  const visible = !dismissed && !dockOpen && section !== "top" && section !== "thought-process";

  return (
    <div
      className={`fixed bottom-4 right-3 z-[60] flex items-end gap-2 transition-all duration-500 sm:right-5 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[120%] opacity-0"
      }`}
    >
      {line && (
        <div key={line} className="mb-24 max-w-[210px] animate-pop rounded-2xl rounded-br-sm border-[1.5px] border-line bg-bg-2 px-3 py-2 text-[14px] leading-5 text-ink">
          {line}
        </div>
      )}
      <div className="group relative">
        <button
          onClick={() => setDockOpen(true)}
          aria-label="Chat with Yahya"
          className="relative block h-[180px] w-[130px] overflow-hidden rounded-2xl border-[1.5px] border-line bg-bg-3  transition hover:-translate-y-1 hover:border-sand sm:h-[210px] sm:w-[150px]"
        >
          <img
            key={wiggle}
            src="/avatar-think.webp"
            alt=""
            className={`pointer-events-none absolute inset-x-0 top-3 mx-auto h-[88%] w-auto animate-pop object-contain object-top drop-shadow-[0_10px_14px_rgba(14,23,38,0.25)] transition group-hover:scale-105 ${
              streaming ? "animate-pulse" : ""
            }`}
          />
          <span className="absolute inset-x-2 bottom-2 rounded-lg bg-sand py-1.5 text-center text-[13px] font-bold text-pop">
            <MessageCircle className="mr-1 inline h-3.5 w-3.5" />
            Ask me
          </span>
        </button>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Hide"
          className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full border border-line bg-bg-2 text-[11px] text-ink-faint opacity-0 transition hover:text-ink group-hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
