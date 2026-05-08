import { useState, type FormEvent } from "react";

interface Props {
  onTypingChange: (typing: boolean) => void;
  onSubmit: (text: string) => void;
  onChipClick: (text: string) => void;
  chips: string[];
}

export function ChatBox({ onTypingChange, onSubmit, onChipClick, chips }: Props) {
  const [value, setValue] = useState("");

  const handleChange = (next: string) => {
    setValue(next);
    onTypingChange(next.trim().length > 0);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue("");
    onTypingChange(false);
  };

  return (
    <div className="w-full max-w-[760px] flex flex-col items-center gap-3">
      <form
        onSubmit={submit}
        className="w-full flex items-center gap-3 rounded-2xl border border-line bg-bg-2/60 px-5 py-3 backdrop-blur transition-colors focus-within:border-sand"
      >
        <input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Ask Hammoudeh…"
          className="flex-1 bg-transparent text-base font-light text-ink outline-none placeholder:text-ink-faint"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={!value.trim()}
          className="grid h-9 w-9 place-items-center rounded-lg bg-sand text-bg transition hover:bg-sand-bright disabled:opacity-40 disabled:hover:bg-sand"
        >
          →
        </button>
      </form>
      <div className="flex max-w-[720px] flex-wrap justify-center gap-1.5">
        {chips.map((chip) => (
          <button
            key={chip}
            onClick={() => onChipClick(chip)}
            className="rounded-full border border-line/80 px-2.5 py-1.5 text-[11.5px] text-ink-mute transition hover:border-sand hover:bg-sand/[0.06] hover:text-ink"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
