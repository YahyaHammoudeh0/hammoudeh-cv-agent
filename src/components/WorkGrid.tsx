import { PROJECTS, type Project } from "../data/projects";

const ACCENTS: Record<NonNullable<Project["accent"]>, string> = {
  sand: "group-hover:border-sand",
  cool: "group-hover:border-cool",
  ink: "group-hover:border-ink-mute",
};

const SIZE_CLASS: Record<Project["size"], string> = {
  lg: "md:col-span-2",
  md: "",
  sm: "",
};

function Card({ p }: { p: Project }) {
  const accentClass = p.accent ? ACCENTS[p.accent] : "group-hover:border-sand";

  return (
    <a
      href={p.github}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex min-h-[210px] flex-col justify-between gap-5 rounded-2xl border border-line bg-bg-2/35 p-5 transition-all duration-300 hover:bg-bg-2/55 ${accentClass} ${SIZE_CLASS[p.size]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-[21px] leading-[1.08] tracking-tight text-ink sm:text-[24px]">
          {p.title}
        </h3>
        <div
          aria-hidden
          className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-ink-mute transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-sand group-hover:text-sand"
          title="GitHub"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current">
            <path d="M5 1l8 0 0 8-2 0 0-4.5L4.5 12 3 10.5 9.5 4l-4.5 0z" />
          </svg>
        </div>
      </div>

      <p className="line-clamp-2 text-[13px] leading-5 text-ink-faint">
        {p.description}
      </p>

      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {p.stack.slice(0, 3).map((s) => (
            <span
              key={s}
              className="rounded-full border border-line/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-ink-mute"
            >
              {s}
            </span>
          ))}
        </div>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-sand opacity-80">
          Repo
        </span>
      </div>
    </a>
  );
}

export function WorkGrid() {
  return (
    <section id="work" className="relative bg-bg py-32">
      <div className="mx-auto w-full max-w-[1180px] px-6 lg:px-10">
        <div className="mb-14 max-w-[640px]">
          <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-sand">
            Project archive
          </div>
          <h2 className="mt-4 font-display text-[44px] leading-[0.96] tracking-tight sm:text-[60px]">
            Repos and builds.
          </h2>
          <p className="mt-5 text-[15px] leading-7 text-ink-mute">
            The CV above gives the story. This is the archive layer: quick links
            into the shipped work, experiments, hackathons, and research builds.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <Card key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
