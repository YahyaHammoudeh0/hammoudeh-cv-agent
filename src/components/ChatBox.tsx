import { useState, type FormEvent } from "react";
import { ArrowUp } from "lucide-react";

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
    <div className="flex w-full flex-col items-center gap-3 lg:items-start">
      <form
        onSubmit={submit}
        className="flex w-full items-center gap-2 rounded-2xl border-[1.5px] border-line bg-bg-2 py-2.5 pl-5 pr-2.5 transition-colors focus-within:border-sand"
      >
        <input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Ask me anything about my work…"
          className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-faint"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={!value.trim()}
          className="btn-ledge grid h-10 w-10 place-items-center rounded-xl bg-sand text-pop disabled:opacity-40"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </form>
      {chips.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 lg:justify-start">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => onChipClick(chip)}
              className="rounded-lg border-[1.5px] border-line bg-bg-2 px-3 py-1.5 text-[14px] font-medium text-ink-mute transition-colors hover:border-sand hover:text-sand"
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
