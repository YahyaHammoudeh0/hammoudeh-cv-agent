import { useEffect, useRef, useState } from "react";
import { streamMatch } from "../lib/chatStream";
import { sourceLabel, uniqueSources } from "../lib/sources";
import { Target, X } from "lucide-react";

const SAMPLE_JD = `AI Engineer — we're hiring someone to build production LLM features: retrieval-augmented generation over internal documents, evaluation pipelines, and agentic workflows. You'll work in Python and TypeScript, ship full-stack features with React/Next.js, and deploy on cloud infrastructure. Bonus: forecasting/ML experience, Arabic language skills, and experience taking prototypes to production with client teams.`;

interface Parsed {
  score: number | null;
  verdict: string;
  strong: string[];
  gaps: string[];
  pitch: string;
}

function parse(text: string): Parsed {
  const score = text.match(/SCORE:\s*(\d{1,3})/i);
  const verdict = text.match(/VERDICT:\s*(.+)/i);
  const section = (name: string, next: string) => {
    const m = text.match(new RegExp(`${name}:\\s*([\\s\\S]*?)(?=${next}:|$)`, "i"));
    return m
      ? m[1]
          .split("\n")
          .map((l) => l.replace(/^\s*[-•*]\s*/, "").trim())
          .filter(Boolean)
      : [];
  };
  const pitch = text.match(/PITCH:\s*([\s\S]+)/i);
  return {
    score: score ? Math.min(100, Number(score[1])) : null,
    verdict: verdict ? verdict[1].trim() : "",
    strong: section("STRONG MATCHES", "GAPS"),
    gaps: section("GAPS", "PITCH"),
    pitch: pitch ? pitch[1].trim() : "",
  };
}

function tier(score: number) {
  if (score >= 85) return { label: "Strong fit", color: "#1E6B3C" };
  if (score >= 70) return { label: "Good fit", color: "#3F8F4F" };
  if (score >= 50) return { label: "Partial fit", color: "#C27C0E" };
  return { label: "Stretch role", color: "#B45309" };
}

export function JobMatch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [jd, setJd] = useState("");
  const [raw, setRaw] = useState("");
  const [status, setStatus] = useState<"idle" | "streaming" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [sources, setSources] = useState<string[]>([]);
  const [shownScore, setShownScore] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const parsed = parse(raw);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Animate the gauge toward the parsed score.
  useEffect(() => {
    if (parsed.score === null) return;
    let raf = 0;
    const tick = () => {
      setShownScore((s) => {
        const next = s + Math.max(1, Math.round((parsed.score! - s) * 0.12));
        if (next < parsed.score!) raf = requestAnimationFrame(tick);
        return Math.min(next, parsed.score!);
      });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [parsed.score]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const run = async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setRaw("");
    setError("");
    setSources([]);
    setShownScore(0);
    setStatus("streaming");
    await streamMatch(
      jd,
      {
        onDelta: (t) => setRaw((r) => r + t),
        onDone: (info) => {
          setSources(uniqueSources(info.sources));
          setStatus("done");
        },
        onError: (msg) => {
          setError(msg);
          setStatus("error");
        },
      },
      ctrl.signal,
    );
  };

  const t = tier(shownScore);
  const R = 52;
  const C = Math.PI * R;

  return (
    <div className={`fixed inset-0 z-[85] grid place-items-center p-4 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
      <div
        role="dialog"
        aria-label="Job match"
        className={`relative flex max-h-[92svh] w-full max-w-[760px] flex-col overflow-hidden rounded-2xl border-[1.5px] border-ink bg-bg-2 shadow-[6px_6px_0_#10261A] transition-all duration-300 ${
          open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <span className="inline-flex items-center rounded-lg bg-[#E4F1DC] px-2.5 py-1 text-[13px] font-semibold text-sand">Recruiter mode</span>
            <h3 className="mt-2 font-display text-[32px] font-extrabold leading-none text-ink">
              Job <span className="text-sand">match.</span>
            </h3>
            <p className="mt-2 text-[13px] text-ink-mute">Paste a job description. I'll score the fit from my actual work, gaps included.</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg border-[1.5px] border-line text-ink-mute hover:border-sand hover:text-sand" aria-label="Close job match">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          {status === "idle" || status === "error" ? (
            <>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the job description here…"
                className="h-[200px] w-full resize-none rounded-2xl border border-line bg-bg/60 p-4 text-[14px] leading-6 text-ink outline-none transition placeholder:text-ink-faint focus:border-tie"
              />
              {error && <p className="mt-2 text-[14px] text-[#B45309]">{error}</p>}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <button onClick={() => setJd(SAMPLE_JD)} className="text-[14px] font-semibold text-ink-mute underline-offset-4 hover:text-sand hover:underline">
                  Try a sample JD
                </button>
                <button
                  onClick={run}
                  disabled={jd.trim().length < 40}
                  className="btn-ledge inline-flex items-center rounded-xl bg-sand px-5 py-2.5 text-[15px] font-bold text-pop disabled:opacity-40"
                >
                  <Target className="mr-1.5 inline h-4 w-4" />
                  Score my fit
                </button>
              </div>
            </>
          ) : (
            <div className="grid gap-5 md:grid-cols-[200px_1fr]">
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 120 70" className="w-[190px]">
                  <path d={`M 8 62 A ${R} ${R} 0 0 1 112 62`} fill="none" stroke="#dbe3ef" strokeWidth="10" strokeLinecap="round" />
                  <path
                    d={`M 8 62 A ${R} ${R} 0 0 1 112 62`}
                    fill="none"
                    stroke={t.color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    strokeDashoffset={C * (1 - shownScore / 100)}
                  />
                </svg>
                <div className="-mt-10 font-display text-[44px] font-semibold leading-none text-ink">
                  {parsed.score === null ? "…" : shownScore}
                </div>
                <div className="mt-2 text-[14px] font-semibold" style={{ color: parsed.score === null ? undefined : t.color }}>
                  {parsed.score === null ? "Reading the JD…" : t.label}
                </div>
                {parsed.verdict && <p className="mt-2 text-center text-[13px] leading-5 text-ink-mute">{parsed.verdict}</p>}
              </div>

              <div className="space-y-4">
                {parsed.strong.length > 0 && (
                  <div>
                    <div className="text-[14px] font-bold text-sand">Strong matches</div>
                    <ul className="mt-2 space-y-1.5">
                      {parsed.strong.map((s, i) => (
                        <li key={i} className="animate-pop rounded-xl border-[1.5px] border-[#CFE6C3] bg-[#F1F9EC] px-3 py-2 text-[14.5px] leading-6 text-ink">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {parsed.gaps.length > 0 && (
                  <div>
                    <div className="text-[14px] font-bold text-[#B45309]">Gaps, honestly</div>
                    <ul className="mt-2 space-y-1.5">
                      {parsed.gaps.map((s, i) => (
                        <li key={i} className="animate-pop rounded-xl border-[1.5px] border-[#F3D9B0] bg-[#FFF7EA] px-3 py-2 text-[14.5px] leading-6 text-ink-mute">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {parsed.pitch && (
                  <p className="rounded-xl bg-sand p-4 text-[15px] font-medium leading-6 text-white">“{parsed.pitch}”</p>
                )}
                {status === "streaming" && parsed.strong.length === 0 && (
                  <div className="space-y-2">
                    {[80, 65, 72].map((w, i) => (
                      <div key={i} className="h-8 animate-pulse rounded-xl bg-line/60" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                )}
                {sources.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[13px] font-semibold text-ink-faint">Evidence:</span>
                    {sources.map((s) => (
                      <span key={s} className="rounded-md bg-bg-3 px-2 py-0.5 text-[12.5px] font-medium text-ink-mute">
                        {sourceLabel(s)}
                      </span>
                    ))}
                  </div>
                )}
                {status === "done" && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    <a
                      href={`mailto:yohyoh580@gmail.com?subject=${encodeURIComponent("Role I think you'd fit")}`}
                      className="btn-ledge inline-flex items-center rounded-xl bg-sand px-4 py-2 text-[14px] font-bold text-pop"
                    >
                      Let's talk
                    </a>
                    <button
                      onClick={() => {
                        setStatus("idle");
                        setRaw("");
                      }}
                      className="rounded-xl border-[1.5px] border-line px-4 py-2 text-[14px] font-semibold text-ink-mute transition-colors hover:border-sand hover:text-sand"
                    >
                      Try another JD
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
