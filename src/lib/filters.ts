export type Location = {
  id: string;
  name: string;
  urdu: string;
  type: string;
  parentId: string | null;
};
export type Resource = {
  id: string;
  name: string;
  department: string;
  categoryId: string;
  coverage: string[];
  type: string;
  url: string;
  description: string;
  aliases: string;
  sourceUrl: string;
  reviewStatus: string;
  reviewedAt: string | null;
  appPage: string | null;
  keywords?: string[];
  iconUrl?: string;
  directorySource?: string;
  sourceSection?: string;
  importedAt?: string;
};
export type Filters = {
  q: string;
  region: string;
  district: string;
  category: string;
  type: string;
  localOnly: boolean;
};
export type SearchConfig = {
  stopWords: string[];
  synonyms: Record<string, string>;
};
export function ancestors(id: string, locations: Location[]): string[] {
  const result: string[] = [];
  let current = locations.find((l) => l.id === id);
  while (current && !result.includes(current.id)) {
    result.push(current.id);
    current = locations.find((l) => l.id === current?.parentId);
  }
  return result;
}
export function normalize(text: string, config?: SearchConfig): string {
  let value = text
    .toLocaleLowerCase()
    .normalize("NFKC")
    .replace(/[’']/g, "")
    .replace(/[^\p{L}\p{N}\s.-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  for (const [from, to] of Object.entries(config?.synonyms || {}).sort(
    (a, b) => b[0].length - a[0].length,
  )) {
    value = value.split(" ").join(" ");
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    value = value.replace(
      new RegExp(`(^|\\s)${escaped}(?=\\s|$)`, "gu"),
      (_, space) => space + to,
    );
  }
  return value;
}
export function searchTerms(q: string, config?: SearchConfig): string[] {
  const words = normalize(q, config).split(" ").filter(Boolean);
  return [...new Set(words.filter((w) => !config?.stopWords.includes(w)))];
}
export function searchScore(
  r: Resource,
  q: string,
  config?: SearchConfig,
): number {
  if (!q.trim()) return 1;
  const terms = searchTerms(q, config);
  if (!terms.length) return 0;
  const title = normalize(r.name, config),
    dept = normalize(r.department, config),
    keys = normalize([r.aliases, ...(r.keywords || [])].join(" "), config),
    desc = normalize(r.description, config);
  let score = 0;
  for (const t of terms) {
    if (title.includes(t)) score += 12;
    else if (dept.includes(t)) score += 8;
    else if (keys.includes(t)) score += 5;
    else if (desc.includes(t)) score += 1;
    else return 0;
  }
  const phrase = terms.join(" ");
  if (title.includes(phrase)) score += 20;
  if ((r.keywords || []).some((k) => normalize(k, config) === phrase))
    score += 10;
  return score;
}
export function filterResources(
  resources: Resource[],
  locations: Location[],
  f: Filters,
  config?: SearchConfig,
): Resource[] {
  const selected = f.district || f.region;
  const scope = selected ? ancestors(selected, locations) : [];
  return resources
    .filter(
      (r) =>
        (!f.category || r.categoryId === f.category) &&
        (!f.type || r.type === f.type) &&
        (!selected ||
          r.coverage.some((c) =>
            f.localOnly
              ? c === selected
              : scope.includes(c) || ancestors(c, locations).includes(selected),
          )) &&
        searchScore(r, f.q, config) > 0,
    )
    .sort((a, b) => {
      const score = f.q.trim()
        ? searchScore(b, f.q, config) - searchScore(a, f.q, config)
        : 0;
      if (score) return score;
      if (!selected) return 0;
      const rank = (r: Resource) =>
        Math.max(
          ...r.coverage.map((c) =>
            c === selected
              ? 100
              : scope.includes(c)
                ? 50 - scope.indexOf(c)
                : 30,
          ),
        );
      return rank(b) - rank(a);
    });
}
