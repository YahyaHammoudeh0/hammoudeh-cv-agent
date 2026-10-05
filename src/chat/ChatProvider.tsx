import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { AgentState, OneShot } from "../components/Avatar";
import { streamChat } from "../lib/chatStream";
import { uniqueSources } from "../lib/sources";
import { ChatContext, splitAnswer, type AskOptions, type ChatCtx, type ChatMessage } from "./chatContext";

const HISTORY_TURNS = 6;
let seq = 0;
const nextId = () => ++seq;

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [avatarState, setAvatarState] = useState<AgentState>("idle");
  const [oneShot, setOneShot] = useState<{ name: OneShot; id: number } | null>(null);
  const [dockOpen, setDockOpen] = useState(false);

  const messagesRef = useRef<ChatMessage[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const timers = useRef<number[]>([]);
  const streamingRef = useRef(false);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const play = useCallback((name: OneShot) => setOneShot({ name, id: nextId() }), []);

  const ask = useCallback(
    (text: string, opts: AskOptions = {}) => {
      const question = text.trim();
      if (!question) return;
      clearTimers();
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const history = messagesRef.current
        .filter((m) => !m.error)
        .slice(-HISTORY_TURNS)
        .map((m) => ({ role: m.role, content: m.role === "assistant" ? splitAnswer(m.text).body : m.text }));

      const userMsg: ChatMessage = { id: nextId(), role: "user", text: question };
      const answerId = nextId();
      setMessages((ms) => [...ms, userMsg, { id: answerId, role: "assistant", text: "" }]);
      setStreaming(true);
      streamingRef.current = true;
      if (opts.openDock) setDockOpen(true);

      if (opts.excited) {
        play("excited");
        later(() => setAvatarState("thinking"), 900);
      } else {
        setAvatarState("thinking");
      }

      const patch = (fn: (m: ChatMessage) => ChatMessage) =>
        setMessages((ms) => ms.map((m) => (m.id === answerId ? fn(m) : m)));

      let first = true;
      void streamChat(
        question,
        history,
        {
          onDelta: (delta) => {
            if (first) {
              first = false;
              clearTimers();
              setAvatarState("answering");
            }
            patch((m) => ({ ...m, text: m.text + delta }));
          },
          onDone: (info) => {
            setStreaming(false);
            streamingRef.current = false;
            patch((m) => ({ ...m, sources: uniqueSources(info.sources) }));
            later(() => setAvatarState("idle"), 1500);
          },
          onError: (msg) => {
            setStreaming(false);
            streamingRef.current = false;
            patch((m) => ({ ...m, text: msg, error: true }));
            setAvatarState("confused");
            later(() => setAvatarState("idle"), 3200);
          },
        },
        controller.signal,
      );
    },
    [play],
  );

  const setTyping = useCallback((typing: boolean) => {
    if (streamingRef.current) return;
    clearTimers();
    setAvatarState(typing ? "typing" : "idle");
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    clearTimers();
    setMessages([]);
    setStreaming(false);
    streamingRef.current = false;
    setAvatarState("idle");
  }, []);

  // Shared links: /?ask=<question> asks it on arrival.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("ask");
    if (!q) return;
    const t = window.setTimeout(() => ask(q.slice(0, 300)), 1200);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      clearTimers();
    },
    [],
  );

  const value = useMemo<ChatCtx>(
    () => ({
      messages,
      streaming,
      avatarState,
      oneShot,
      play,
      ask,
      setTyping,
      dockOpen,
      setDockOpen,
      reset,
    }),
    [messages, streaming, avatarState, oneShot, play, ask, setTyping, dockOpen, reset],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
