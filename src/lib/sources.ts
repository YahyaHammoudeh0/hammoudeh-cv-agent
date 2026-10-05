/** Turn knowledge-file names from the chat server into short, friendly labels. */
export function sourceLabel(source: string): string {
  const file = source.split("/").pop() ?? source;
  const stem = file.replace(/\.md$/, "").replace(/^\d+_/, "").replace(/^proj_/, "");
  const label = stem.replace(/_/g, " ");
  return label.length > 28 ? label.slice(0, 27) + "…" : label;
}

export function uniqueSources(sources: string[] | undefined): string[] {
  return Array.from(new Set(sources ?? [])).slice(0, 5);
}
