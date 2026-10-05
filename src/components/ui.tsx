import type { ReactNode } from "react";

/** Numbered section header: palm block with a lime numeral, then a big heading. */
export function SectionHeader({ num, title, sub }: { num: string; title: string; sub?: string }) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-sand font-display text-[22px] font-extrabold text-pop sm:h-16 sm:w-16 sm:text-[26px]">
          {num}
        </span>
        <h2 className="font-display text-[40px] font-extrabold leading-[0.95] tracking-[-0.02em] text-ink sm:text-[60px]">{title}</h2>
      </div>
      {sub && <p className="mt-4 max-w-[560px] text-[17px] leading-relaxed text-ink-mute">{sub}</p>}
    </div>
  );
}

/** Flat white card with a crisp border; border turns palm on hover when interactive. */
export function Card({ children, className = "", interactive = false }: { children: ReactNode; className?: string; interactive?: boolean }) {
  return (
    <div className={`rounded-2xl border-[1.5px] border-line bg-bg-2 ${interactive ? "transition-colors hover:border-sand" : ""} ${className}`}>
      {children}
    </div>
  );
}

/** Square-ish tag (no pills). `tone="palm"` for status badges. */
export function Tag({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "palm" | "lime" }) {
  const tones = {
    plain: "border-[1.5px] border-line bg-bg-2 text-ink-mute",
    palm: "bg-[#E4F1DC] text-sand",
    lime: "bg-pop text-ink",
  };
  return <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[13px] font-semibold ${tones[tone]}`}>{children}</span>;
}
