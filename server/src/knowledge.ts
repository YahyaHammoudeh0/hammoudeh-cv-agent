import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KNOWLEDGE_DIR = join(__dirname, "..", "knowledge");

export interface KnowledgeChunk {
  id: string;
  source: string;
  text: string;
  tokens: Set<string>;
}

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "must", "shall", "can", "of", "in", "on",
  "at", "to", "for", "with", "by", "from", "about", "as", "into",
  "through", "during", "and", "or", "but", "not", "no", "if", "then",
  "else", "when", "where", "why", "how", "what", "which", "who", "whom",
  "this", "that", "these", "those", "i", "you", "he", "she", "it", "we",
  "they", "them", "his", "her", "its", "their", "our", "my", "your",
  "me", "him", "us", "so", "than", "too", "very", "just", "more",
  "most", "some", "any", "all", "each", "every", "few", "many", "much",
  "other", "such", "only", "own", "same", "also",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

function chunkText(source: string, text: string): KnowledgeChunk[] {
  // Split on blank lines into paragraphs; group small ones.
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const chunks: KnowledgeChunk[] = [];
  let buf: string[] = [];
  let bufLen = 0;
  const FLUSH = 600; // characters per chunk target

  const flush = () => {
    if (buf.length === 0) return;
    const body = buf.join("\n\n");
    chunks.push({
      id: `${source}#${chunks.length}`,
      source,
      text: body,
      tokens: new Set(tokenize(body)),
    });
    buf = [];
    bufLen = 0;
  };

  for (const p of paragraphs) {
    buf.push(p);
    bufLen += p.length;
    if (bufLen >= FLUSH) flush();
  }
  flush();

  return chunks;
}

let CORPUS: KnowledgeChunk[] | null = null;

export function loadCorpus(): KnowledgeChunk[] {
  if (CORPUS) return CORPUS;
  const files = readdirSync(KNOWLEDGE_DIR).filter(
    (f) => f.endsWith(".md") || f.endsWith(".txt"),
  );
  const chunks: KnowledgeChunk[] = [];
  for (const f of files) {
    const text = readFileSync(join(KNOWLEDGE_DIR, f), "utf8");
    chunks.push(...chunkText(f, text));
  }
  CORPUS = chunks;
  console.log(
    `[knowledge] loaded ${chunks.length} chunks from ${files.length} files`,
  );
  return chunks;
}

/**
 * Naive keyword-overlap retrieval. Score = |query_tokens ∩ chunk_tokens|,
 * with a small boost for chunks whose source filename contains a query token.
 */
export function retrieve(query: string, k = 5): KnowledgeChunk[] {
  const corpus = loadCorpus();
  const qTokens = new Set(tokenize(query));
  if (qTokens.size === 0) return corpus.slice(0, k);

  const scored = corpus.map((c) => {
    let score = 0;
    for (const t of qTokens) if (c.tokens.has(t)) score += 1;
    // Filename boost
    const sourceLower = c.source.toLowerCase();
    for (const t of qTokens) if (sourceLower.includes(t)) score += 0.5;
    return { chunk: c, score };
  });

  scored.sort((a, b) => b.score - a.score);
  // Always return at least 3 chunks (the about / contact baseline) even if no
  // keyword overlap, so the model has *some* grounding.
  const top = scored.filter((s) => s.score > 0).slice(0, k);
  if (top.length < 3) {
    const seen = new Set(top.map((s) => s.chunk.id));
    for (const c of corpus) {
      if (!seen.has(c.id)) {
        top.push({ chunk: c, score: 0 });
        if (top.length >= 3) break;
      }
    }
  }
  return top.map((s) => s.chunk);
}

export function formatContext(chunks: KnowledgeChunk[]): string {
  return chunks
    .map(
      (c, i) =>
        `<doc id="${i + 1}" source="${c.source}">\n${c.text}\n</doc>`,
    )
    .join("\n\n");
}
