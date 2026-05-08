const LINKS = [
  {
    label: "Email",
    value: "yahyahammoudeh@aucegypt.edu",
    href: "mailto:yahyahammoudeh@aucegypt.edu",
  },
  {
    label: "GitHub",
    value: "YahyaHammoudeh0",
    href: "https://github.com/YahyaHammoudeh0",
  },
  {
    label: "LinkedIn",
    value: "Mohammad Yahya Hammoudeh",
    href: "https://www.linkedin.com/in/mohammad-yahya-hammoudeh-530888257",
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="border-t border-line bg-bg py-24">
      <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-sand">
            Contact
          </div>
          <h2 className="mt-4 font-display text-[44px] leading-[0.96] tracking-tight text-ink sm:text-[58px]">
            Ask directly.
          </h2>
          <p className="mt-5 max-w-[460px] text-[15px] leading-7 text-ink-mute">
            The agent is for fast context. Anything hiring, collaboration, or
            follow-up related should go straight to me.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              className="group rounded-2xl border border-line bg-bg-2/35 p-5 transition hover:border-sand hover:bg-bg-2/55"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-sand">
                {link.label}
              </div>
              <div className="mt-4 break-words text-[15px] leading-6 text-ink-mute transition group-hover:text-ink">
                {link.value}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
