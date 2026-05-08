import { useEffect, useRef, useState } from "react";

const MODEL_LABEL =
  (import.meta.env.VITE_CHAT_MODEL as string | undefined)?.trim() ||
  "deepseek/deepseek-v4-flash";

const FRAME_COUNT = 192;
const FRAME_BATCH_SIZE = 18;

const PHASES = [
  {
    eyebrow: "01 / question",
    title: "Read the question.",
    body: "Extract project names, skills, constraints, and intent.",
    start: 0,
    end: 0.2,
  },
  {
    eyebrow: "02 / retrieval",
    title: "Search the work.",
    body: "Look across CV notes, project summaries, READMEs, and GitHub metadata.",
    start: 0.2,
    end: 0.44,
  },
  {
    eyebrow: "03 / context",
    title: "Pack the evidence.",
    body: "Keep only the strongest chunks, then build the model context.",
    start: 0.44,
    end: 0.68,
  },
  {
    eyebrow: "04 / model",
    title: "Answer from context.",
    body: `${MODEL_LABEL} writes using the retrieved evidence.`,
    start: 0.68,
    end: 0.86,
  },
  {
    eyebrow: "05 / response",
    title: "Ready to answer.",
    body: "The retrieved context is ready, and the hero chat can stream a grounded answer.",
    start: 0.86,
    end: 1,
  },
];

function frameSrc(index: number) {
  return `/rag-frames/frame-${String(index + 1).padStart(4, "0")}.jpg`;
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function phaseFor(progress: number) {
  return Math.max(
    0,
    PHASES.findIndex((phase) => progress >= phase.start && progress <= phase.end),
  );
}

export function RagScroll() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const progressRef = useRef(0);
  const drawnFrameRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const [activePhase, setActivePhase] = useState(0);
  const [loadedFrames, setLoadedFrames] = useState(0);
  const [framesReady, setFramesReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const frames: HTMLImageElement[] = new Array(FRAME_COUNT);

    async function loadFrame(index: number) {
      await new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.decoding = "async";
        image.onload = () => {
          frames[index] = image;
          setLoadedFrames((count) => count + 1);
          resolve();
        };
        image.onerror = () => reject(new Error(`Failed to load ${frameSrc(index)}`));
        image.src = frameSrc(index);
      });
    }

    async function loadAllFrames() {
      for (let start = 0; start < FRAME_COUNT && !cancelled; start += FRAME_BATCH_SIZE) {
        const batch = Array.from(
          { length: Math.min(FRAME_BATCH_SIZE, FRAME_COUNT - start) },
          (_, offset) => loadFrame(start + offset),
        );
        await Promise.all(batch);
      }

      if (!cancelled) {
        framesRef.current = frames;
        setFramesReady(true);
      }
    }

    loadAllFrames().catch((error) => {
      console.error(error);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas || !framesReady) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawnFrameRef.current = -1;
    };

    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(rect.height - window.innerHeight, 1);
      const progress = clamp(-rect.top / scrollable);
      progressRef.current = progress;
      setActivePhase((current) => {
        const next = phaseFor(progress);
        return current === next ? current : next;
      });
    };

    const tick = () => {
      const frame = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.floor(progressRef.current * (FRAME_COUNT - 1))),
      );

      if (frame !== drawnFrameRef.current) {
        drawFrame(ctx, framesRef.current[frame], window.innerWidth, window.innerHeight);
        drawnFrameRef.current = frame;
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    resize();
    updateProgress();
    rafRef.current = window.requestAnimationFrame(tick);

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateProgress);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [framesReady]);

  const phase = PHASES[activePhase];
  const loadProgress = Math.round((loadedFrames / FRAME_COUNT) * 100);

  return (
    <section
      ref={sectionRef}
      id="thought-process"
      className="relative h-[480vh] bg-bg text-ink"
    >
      <div className="sticky top-0 h-screen overflow-hidden border-y border-line bg-bg">
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
            framesReady ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_68%_50%,rgba(11,10,8,0)_0%,rgba(11,10,8,0.04)_44%,rgba(11,10,8,0.72)_100%)]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[48vw] bg-gradient-to-r from-bg via-bg/82 to-transparent" />

        {!framesReady && (
          <div className="absolute inset-0 grid place-items-center bg-bg">
            <div className="w-[280px]">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-sand">
                Loading sequence
              </div>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full bg-sand transition-[width] duration-200"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                {loadProgress}%
              </div>
            </div>
          </div>
        )}

        <div className="pointer-events-none relative z-10 mx-auto flex h-screen max-w-[1180px] items-center px-6 lg:px-10">
          <div className="max-w-[390px]">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-sand">
              Inside the head
            </div>
            <h2 className="mt-4 font-display text-[42px] font-semibold leading-[0.95] tracking-tight sm:text-[54px]">
              How the answer forms.
            </h2>

            <article className="mt-10 rounded-2xl border border-sand/40 bg-bg-2/76 p-5 shadow-[0_0_42px_rgba(212,165,116,0.1)]">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-sand">
                {phase.eyebrow}
              </div>
              <h3 className="mt-3 font-display text-[30px] leading-[1] text-ink">
                {phase.title}
              </h3>
              <p className="mt-4 text-[14px] leading-6 text-ink-mute">
                {phase.body}
              </p>
            </article>

            <div className="mt-7 flex w-[280px] items-center gap-3 rounded-full border border-line bg-bg-2/45 px-4 py-3">
              {PHASES.map((item, index) => (
                <div
                  key={item.eyebrow}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    index <= activePhase ? "bg-sand" : "bg-line"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | undefined,
  canvasWidth: number,
  canvasHeight: number,
) {
  if (!image) return;

  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = canvasWidth / canvasHeight;
  const baseScale = imageRatio > canvasRatio
    ? canvasHeight / image.naturalHeight
    : canvasWidth / image.naturalWidth;
  const scale = baseScale * 1.08;
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  const x = (canvasWidth - width) / 2 + canvasWidth * 0.08;
  const y = (canvasHeight - height) / 2 - canvasHeight * 0.01;

  ctx.fillStyle = "#0b0a08";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, x, y, width, height);
}
