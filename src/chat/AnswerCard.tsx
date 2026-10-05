import { useState } from "react";
import { sourceLabel } from "../lib/sources";
import { splitAnswer, useChat, type ChatMessage } from "./chatContext";
import { ArrowRight, Check, Copy, FileText, Link2 } from "lucide-react";

interface Props {
  answer: ChatMessage;
  question?: string;
  live: boolean;
  /** Compact = inside the dock thread. */
  compact?: boolean;
}

export function AnswerCard({ answer, question, live, compact = false }: Props) {
  const { ask } = useChat();
  const { body, followUps } = splitAnswer(answer.text);
  const [copied, setCopied] = useState<"" | "answer" | "link">("");

  const flash = (what: "answer" | "link") => {
    setCopied(what);
    window.setTimeout(() => setCopied(""), 1600);
  };
  const copyAnswer = async () => {
    try {
      await navigator.clipboard.writeText(question ? `Q: ${question}\n\n${body}` : body);
      flash("answer");
    } catch {
      /* clipboard blocked */
    }
  };
  const share = async () => {
    if (!question) return;
    const url = `${window.location.origin}/?ask=${encodeURIComponent(question)}`;
    try {
      await navigator.clipboard.writeText(url);
      flash("link");
    } catch {
      window.prompt("Copy this link", url);
    }
  };

  return (
    <div className="flex min-h-0 flex-col">
      <p
        className={`whitespace-pre-wrap leading-relaxed ${answer.error ? "text-sand" : "text-ink"} ${
          compact ? "text-[15px]" : "min-h-0 max-h-[260px] overflow-y-auto pr-1 text-[16px]"
        }`}
      >
        {body || <ThinkingDots />}
        {live && body && <span className="ml-1 inline-block h-[14px] w-[2px] animate-pulse bg-sand align-middle" />}
      </p>

      {!live && !answer.error && body && (
        <>
          {followUps.length > 0 && (
            <div className="mt-3 flex shrink-0 flex-wrap gap-1.5">
              {followUps.map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  className="inline-flex items-center gap-1 rounded-lg border-[1.5px] border-line bg-bg-2 px-3 py-1.5 text-left text-[14px] font-semibold text-sand transition-colors hover:border-sand hover:bg-sand hover:text-pop"
                >
                  {q} <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                </button>
              ))}
            </div>
          )}
          <div className="mt-3 flex shrink-0 flex-wrap items-center gap-1.5 border-t border-line pt-2.5">
            {(answer.sources ?? []).map((src) => (
              <button
                key={src}
                onClick={() => ask(`Tell me more about ${sourceLabel(src)}`)}
                title={`Answer drew on ${src}. Click to dig deeper`}
                className="inline-flex items-center rounded-md bg-bg-3 px-2 py-0.5 text-[12.5px] font-medium text-ink-mute transition-colors hover:bg-[#E4F1DC] hover:text-sand"
              >
                <FileText className="mr-1 inline h-3 w-3" />
                {sourceLabel(src)}
              </button>
            ))}
            <span className="ml-auto flex gap-1">
              <button onClick={copyAnswer} title="Copy answer" aria-label="Copy answer" className="rounded-md px-2 py-0.5 text-[11.5px] text-ink-faint transition hover:bg-bg-3 hover:text-ink">
                {copied === "answer" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              {question && (
                <button onClick={share} title="Copy share link" aria-label="Copy share link" className="rounded-md px-2 py-0.5 text-[11.5px] text-ink-faint transition hover:bg-bg-3 hover:text-ink">
                  {copied === "link" ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
                </button>
              )}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export function ThinkingDots() {
  return (
    <span className="inline-flex gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-sm bg-sand" style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
    </span>
  );
}
