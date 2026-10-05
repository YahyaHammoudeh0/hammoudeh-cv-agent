import { useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";

const EMAIL = "yohyoh580@gmail.com";

const LINKS = [
  { label: "GitHub", value: "YahyaHammoudeh0", href: "https://github.com/YahyaHammoudeh0" },
  { label: "LinkedIn", value: "Mohammad Yahya Hammoudeh", href: "https://www.linkedin.com/in/mohammad-yahya-hammoudeh-530888257" },
];

export function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-bg">
      {/* Same AUC walkway as the hero, at golden hour: the end of the visit. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <picture>
          <source media="(min-width: 1024px)" srcSet="/bg/auc-golden.webp" />
          <img src="/bg/auc-golden-sm.webp" alt="" className="h-full w-full object-cover object-[62%_70%]" />
        </picture>
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bg to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/95 via-bg/80 to-bg/30 lg:hidden" />
        <div className="absolute inset-y-0 left-0 hidden w-[60%] bg-gradient-to-r from-bg via-bg/85 to-transparent lg:block" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1280px] items-end gap-10 px-5 pt-28 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:pt-36">
        <div className="pb-16 lg:pb-28">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-sand text-pop sm:h-16 sm:w-16">
            <Mail className="h-7 w-7" />
          </span>
          <h2 className="mt-6 font-display text-[64px] font-extrabold leading-[0.9] tracking-[-0.03em] text-ink sm:text-[104px]">
            Say hi<span className="text-sand">.</span>
          </h2>
          <p className="mt-5 max-w-[480px] text-[18px] leading-relaxed text-ink-mute">
            The avatar is for quick context. For hiring, collaborations, or anything that deserves a real
            reply, come straight to me.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={`mailto:${EMAIL}`} className="btn-ledge inline-flex items-center gap-2 rounded-xl bg-sand px-6 py-3.5 text-[16px] font-bold text-pop">
              <Mail className="h-[18px] w-[18px]" />
              Email me at {EMAIL}
            </a>
            <button
              onClick={copy}
              aria-label="Copy email address"
              className="btn-ledge-light inline-flex items-center gap-2 rounded-xl border-[1.5px] border-line bg-bg-2 px-4 py-3.5 text-[15px] font-semibold text-ink"
            >
              {copied ? <Check className="h-4 w-4 text-sand" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="mt-8 grid max-w-[580px] gap-3 sm:grid-cols-2">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border-[1.5px] border-line bg-bg-2 p-5 transition-colors hover:border-sand"
              >
                <div className="flex items-center justify-between text-[14px] font-bold text-ink">
                  {link.label}
                  <ArrowUpRight className="h-4 w-4 text-ink-faint transition group-hover:text-sand" />
                </div>
                <div className="mt-2 break-words text-[16px] text-ink-mute">{link.value}</div>
              </a>
            ))}
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <img src="/avatar-wave.webp" alt="Yahya's 3D avatar waving" className="relative h-[46vh] max-h-[520px] min-h-[300px] w-auto" />
        </div>
      </div>

      <footer className="relative border-t-[1.5px] border-line bg-bg-2">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-2 px-5 py-6 text-[14px] text-ink-mute sm:flex-row sm:px-8 lg:px-10">
          <span>© {new Date().getFullYear()} Yahya Hammoudeh</span>
          <span className="text-center">Avatar built with Nano Banana, Tripo and Blender · rendered in three.js</span>
          <span>Try poking him five times</span>
        </div>
      </footer>
    </section>
  );
}
