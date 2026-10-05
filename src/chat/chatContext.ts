import { createContext, useContext } from "react";
import type { AgentState, OneShot } from "../components/Avatar";

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  /** Raw model text; may end with a `FOLLOW_UPS: a | b | c` line. */
  text: string;
  sources?: string[];
  error?: boolean;
}

export interface AskOptions {
  /** Play the excited gesture first (chips / "ask about this"). */
  excited?: boolean;
  /** Open the floating chat dock (used from anywhere below the hero). */
  openDock?: boolean;
}

export interface ChatCtx {
  messages: ChatMessage[];
  streaming: boolean;
  avatarState: AgentState;
  oneShot: { name: OneShot; id: number } | null;
  play: (name: OneShot) => void;
  ask: (text: string, opts?: AskOptions) => void;
  setTyping: (typing: boolean) => void;
  dockOpen: boolean;
  setDockOpen: (open: boolean) => void;
  reset: () => void;
}

export const ChatContext = createContext<ChatCtx | null>(null);

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
}

const MARKER = "FOLLOW_UPS:";

/** Split a model answer into display text and follow-up questions.
 *  While streaming, also hides a half-written marker at the very end. */
export function splitAnswer(text: string): { body: string; followUps: string[] } {
  const idx = text.indexOf(MARKER);
  if (idx >= 0) {
    const followUps = text
      .slice(idx + MARKER.length)
      .split("|")
      .map((q) => q.trim().replace(/^[-•\d.)\s]+/, ""))
      .filter((q) => q.length > 3)
      .slice(0, 3);
    return { body: text.slice(0, idx).trim(), followUps };
  }
  for (let n = MARKER.length - 1; n > 0; n--) {
    if (text.endsWith(MARKER.slice(0, n))) return { body: text.slice(0, -n).trimEnd(), followUps: [] };
  }
  return { body: text, followUps: [] };
}
