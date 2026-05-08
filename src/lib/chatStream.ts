/**
 * Tiny SSE client for the chat endpoint. We can't use EventSource because we
 * need to POST a body, so we read the streaming response with the Fetch API.
 */

export interface ChatStreamHandlers {
  onDelta: (text: string) => void;
  onDone: (info: { sources?: string[] }) => void;
  onError: (message: string) => void;
}

export async function streamChat(
  message: string,
  handlers: ChatStreamHandlers,
  signal?: AbortSignal,
): Promise<void> {
  const endpoint = getChatEndpoint();
  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
      signal,
    });
  } catch (e) {
    if ((e as Error).name === "AbortError") return;
    handlers.onError("Network error. Try again in a moment.");
    return;
  }

  if (!res.ok) {
    const message = await getErrorMessage(res, endpoint);
    if (res.status === 429) {
      handlers.onError(message);
    } else {
      handlers.onError(message);
    }
    return;
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("text/event-stream")) {
    handlers.onError(unreachableApiMessage(endpoint));
    return;
  }

  if (!res.body) {
    handlers.onError("No response body.");
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE frames are separated by blank lines.
      let idx;
      while ((idx = buffer.indexOf("\n\n")) !== -1) {
        const frame = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        const parsed = parseFrame(frame);
        if (!parsed) continue;
        if (parsed.event === "delta") {
          const text = (parsed.data as { text?: string }).text;
          if (typeof text === "string") handlers.onDelta(text);
        } else if (parsed.event === "done") {
          handlers.onDone(parsed.data as { sources?: string[] });
          return;
        } else if (parsed.event === "error") {
          handlers.onError(
            (parsed.data as { message?: string }).message ??
              "Unknown server error.",
          );
          return;
        }
      }
    }
  } catch (e) {
    if ((e as Error).name === "AbortError") return;
    handlers.onError("Stream interrupted.");
  }
}

function getChatEndpoint(): string {
  return import.meta.env.VITE_CHAT_API_URL?.trim() || "/api/chat";
}

async function getErrorMessage(res: Response, endpoint: string): Promise<string> {
  if (res.status === 429) {
    return "Rate limit hit. Please wait a few minutes before asking again.";
  }

  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const body = (await res.json()) as { error?: unknown; message?: unknown };
      const message = body.error ?? body.message;
      if (typeof message === "string" && message.trim()) {
        return message;
      }
    } catch {
      /* fall through to generic message */
    }
  }

  if (contentType.includes("text/html")) {
    return unreachableApiMessage(endpoint);
  }

  try {
    const body = await res.text();
    const trimmed = body.trim();
    if (trimmed) return `Server returned ${res.status}. ${trimmed}`;
  } catch {
    /* fall through to generic message */
  }

  return `Server returned ${res.status}. Try again later.`;
}

function unreachableApiMessage(endpoint: string): string {
  const origin =
    typeof window === "undefined" ? "this page" : window.location.origin;

  return (
    `The chat API is not reachable from ${origin}. ` +
    `I expected an SSE response from ${endpoint}. ` +
    "Start the CV site with `npm run dev` from the `site` folder and open the Vite URL, or set `VITE_CHAT_API_URL` to the running chat server."
  );
}

function parseFrame(
  frame: string,
): { event: string; data: unknown } | null {
  let event = "message";
  const dataLines: string[] = [];
  for (const line of frame.split("\n")) {
    if (line.startsWith("event:")) {
      event = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trim());
    }
  }
  if (dataLines.length === 0) return null;
  try {
    return { event, data: JSON.parse(dataLines.join("\n")) };
  } catch {
    return null;
  }
}
