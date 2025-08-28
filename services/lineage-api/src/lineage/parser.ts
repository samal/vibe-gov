export interface ParsedLineage {
  upstreamAssets: string[];
}

// Very naive parser: extracts schema.table occurrences after FROM and JOIN
export function parseSqlToLineage(sql: string): ParsedLineage {
  const normalized = sql.replace(/\s+/g, ' ').trim().toLowerCase();
  const upstream = new Set<string>();
  const fromJoinRegex = /(from|join)\s+([a-zA-Z0-9_]+\.[a-zA-Z0-9_]+)/g;
  let match: RegExpExecArray | null;
  while ((match = fromJoinRegex.exec(normalized))) {
    upstream.add(match[2]);
  }
  return { upstreamAssets: Array.from(upstream) };
} 