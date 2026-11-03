"use client";
import { useEffect, useMemo, useState } from "react";
import { T, usePreferences } from "@/components/Preferences";
import {
  Search,
  ArrowUpRight,
  Bookmark,
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";
import searchConfig from "@/data/search-config.json";
import ResourceIcon from "@/components/ResourceIcon";
import resources from "@/data/resources.json";
import locations from "@/data/locations.json";
import categories from "@/data/categories.json";
import { filterResources, type Filters } from "@/lib/filters";
const defaults: Filters = {
  q: "",
  region: "",
  district: "",
  category: "",
  type: "",
  localOnly: false,
};
export default function Directory() {
  const { t, locale } = usePreferences();
  const [f, setF] = useState<Filters>(defaults);
  const [saved, setSaved] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [ready, setReady] = useState(false);
  const [list, setList] = useState(false);
  const [message, setMessage] = useState("");
  const [sort, setSort] = useState("recommended");
  const [page, setPage] = useState(1);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const region = locations.some(
      (l) => l.type === "region" && l.id === p.get("region"),
    )
      ? p.get("region") || ""
      : "";
    const district = locations.some(
      (l) =>
        l.type === "district" &&
        l.id === p.get("district") &&
        l.parentId === region,
    )
      ? p.get("district") || ""
      : "";
    setF({
      q: p.get("q") || "",
      region,
      district,
      category: categories.some((c) => c.id === p.get("category"))
        ? p.get("category") || ""
        : "",
      type: ["website", "app"].includes(p.get("type") || "")
        ? p.get("type") || ""
        : "",
      localOnly: p.get("localOnly") === "1",
    });
    setSavedOnly(p.get("saved") === "1");
    try {
      const v = JSON.parse(localStorage.getItem("raabta:saved") || "[]");
      if (Array.isArray(v)) setSaved(v.filter((x) => typeof x === "string"));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => {
      if (v) p.set(k, v === true ? "1" : String(v));
    });
    if (savedOnly) p.set("saved", "1");
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${p.size ? "?" + p.toString() : ""}`,
    );
  }, [f, savedOnly, ready]);
  const results = useMemo(() => {
    let rows = filterResources(resources, locations, f, searchConfig).filter(
      (r) => !savedOnly || saved.includes(r.id),
    );
    if (sort === "name")
      rows = rows.sort((a, b) => a.name.localeCompare(b.name));
    return rows;
  }, [f, savedOnly, saved, sort]);
  useEffect(() => setPage(1), [f, savedOnly, sort]);
  const pageSize = 18;
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const visible = results.slice((page - 1) * pageSize, page * pageSize);
  function toggle(id: string) {
    const next = saved.includes(id)
      ? saved.filter((x) => x !== id)
      : [...saved, id];
    setSaved(next);
    try {
      localStorage.setItem("raabta:saved", JSON.stringify(next));
      setMessage(
        next.includes(id)
          ? "Saved on this browser."
          : "Removed from saved links.",
      );
    } catch {
      setMessage("Browser storage unavailable. Saved for this visit only.");
    }
  }
  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("Filter link copied.");
    } catch {
      setMessage("Copy the address from your browser to share these filters.");
    }
  }
  function reset() {
    setF(defaults);
    setSavedOnly(false);
  }
  return (
    <main className="directory">
      <div className="directory-intro">
        <div className="eyebrow">
          <T>THE PUBLIC SERVICE DIRECTORY</T>
        </div>
        <h1>
          {t(
            savedOnly
              ? "Your useful little collection."
              : "Find your way forward.",
          )}
        </h1>
        <p>
          {resources.length}{" "}
          <T>
            <T>
              resources. One clearer starting point. Search by task, department
              or a saved keyword.
            </T>
          </T>
        </p>
      </div>
      <div className="search-suggestions">
        <span>
          <T>POPULAR SEARCHES</T>
        </span>
        {searchConfig.suggestions.map((item) => (
          <button
            key={item.query}
            onClick={() => setF({ ...f, q: item.query })}
          >
            {t(item.label)}
          </button>
        ))}
      </div>
      <div className="directory-layout">
        <aside className="filter-panel">
          <div className="filter-title">
            <SlidersHorizontal size={18} />
            <strong>
              <T>Refine your search</T>
            </strong>
            <button onClick={reset}>
              <T>Reset</T>
            </button>
          </div>
          <label>
            <T>Province / territory</T>
            <select
              value={f.region}
              onChange={(e) =>
                setF({ ...f, region: e.target.value, district: "" })
              }
            >
              <option value="">
                <T>All Pakistan</T>
              </option>
              {locations
                .filter((l) => l.type === "region")
                .map((l) => (
                  <option key={l.id} value={l.id}>
                    {t(l.name)}
                  </option>
                ))}
            </select>
          </label>
          <label>
            <T>District</T>
            <select
              disabled={!f.region}
              value={f.district}
              onChange={(e) => setF({ ...f, district: e.target.value })}
            >
              <option value="">
                {t(
                  f.region ? "All listed districts" : "Select a province first",
                )}
              </option>
              {locations
                .filter((l) => l.type === "district" && l.parentId === f.region)
                .map((l) => (
                  <option key={l.id} value={l.id}>
                    {t(l.name)}
                  </option>
                ))}
            </select>
          </label>
          {locations.find((l) => l.id === f.district)?.status ===
            "status-under-review" && (
            <p className="coverage-note">
              <T>Status under review</T>
            </p>
          )}
          <p className="filter-note">
            <T>
              District reference set. Regional and federal resources remain
              available unless local-only is selected.
            </T>
          </p>
          <label>
            <T>Category</T>
            <select
              value={f.category}
              onChange={(e) => setF({ ...f, category: e.target.value })}
            >
              <option value="">
                <T>All categories</T>
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {t(c.name)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <T>Resource type</T>
            <select
              value={f.type}
              onChange={(e) => setF({ ...f, type: e.target.value })}
            >
              <option value="">
                <T>Websites & apps</T>
              </option>
              <option value="website">
                <T>Websites</T>
              </option>
              <option value="app">
                <T>Mobile apps</T>
              </option>
            </select>
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              checked={f.localOnly}
              disabled={!f.region}
              onChange={(e) => setF({ ...f, localOnly: e.target.checked })}
            />
            <T>Only this area's listings</T>
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              checked={savedOnly}
              onChange={(e) => setSavedOnly(e.target.checked)}
            />
            <T>Saved resources</T> ({saved.length})
          </label>
          <div className="filter-help">
            <MapPin size={22} />
            <strong>
              <T>A note on coverage</T>
            </strong>
            <p>
              <T>
                “Punjab-wide” resources remain visible when you select Lahore.
                Local-only mode excludes broader coverage.
              </T>
            </p>
          </div>
        </aside>
        <section className="results">
          <div className="results-search">
            <Search size={20} />
            <input
              list="directory-keywords"
              autoComplete="off"
              aria-label="Search directory"
              placeholder={
                locale === "ur"
                  ? "شناختی کارڈ، بجلی کا بل یا محکمہ تلاش کریں…"
                  : locale === "roman"
                    ? "CNIC, bijli ka bill ya mehkama talash karein…"
                    : "Try “mujhe CNIC banwana hai” or “electricity bill”…"
              }
              value={f.q}
              onChange={(e) => setF({ ...f, q: e.target.value })}
            />
            {f.q && (
              <button
                className="icon-btn"
                aria-label="Clear search"
                onClick={() => setF({ ...f, q: "" })}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <datalist id="directory-keywords">
            {Array.from(
              new Set([
                ...searchConfig.suggestions.map((t) => t.query),
                ...resources.map((r) => r.name),
                ...resources.flatMap((r) => r.keywords),
              ]),
            ).map((k) => (
              <option key={k} value={k} />
            ))}
          </datalist>
          <div className="results-toolbar">
            <span aria-live="polite">
              <strong>{results.length}</strong>
              <T> resources found</T>
            </span>
            <div>
              <select
                aria-label="Sort results"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="recommended">
                  <T>Best match / directory order</T>
                </option>
                <option value="name">
                  <T>Name A–Z</T>
                </option>
              </select>
              <button
                className="icon-btn"
                onClick={share}
                aria-label="Copy filtered page link"
              >
                <LinkIcon size={18} />
              </button>
              <button
                className="icon-btn"
                aria-label={list ? "Use grid layout" : "Use list layout"}
                onClick={() => setList(!list)}
              >
                {list ? <LayoutGrid size={18} /> : <List size={18} />}
              </button>
            </div>
          </div>
          <div className="active-filters">
            {[
              f.region && locations.find((l) => l.id === f.region)?.name,
              f.district && locations.find((l) => l.id === f.district)?.name,
              f.category && categories.find((c) => c.id === f.category)?.name,
              f.type,
            ]
              .filter(Boolean)
              .map((label) => (
                <span key={String(label)}>{t(String(label))}</span>
              ))}
          </div>
          {!ready ? (
            <p>
              <T>Loading your directory…</T>
            </p>
          ) : results.length === 0 ? (
            <div className="empty">
              <Search size={32} />
              <h2>
                <T>No matches yet.</T>
              </h2>
              <p>
                {t(
                  savedOnly
                    ? "Save a resource using its bookmark button, or broaden your filters."
                    : "Try one of the keyword suggestions above, or include provincial and nationwide resources. Search uses the saved directory data only.",
                )}
              </p>
              <button className="btn dark" onClick={reset}>
                <T>Clear filters</T>
              </button>
            </div>
          ) : (
            <div className={list ? "resource-grid list-view" : "resource-grid"}>
              {visible.map((r) => (
                <article className="resource-card" key={r.id}>
                  <div className="resource-top">
                    <ResourceIcon
                      name={t(r.name)}
                      url={r.iconUrl}
                      category={r.categoryId}
                    />
                    <span className="type-label">
                      {t(r.type === "app" ? "MOBILE APP" : "WEBSITE")}
                    </span>
                    <button
                      className={
                        "icon-btn bookmark " +
                        (saved.includes(r.id) ? "is-saved" : "")
                      }
                      aria-label={`${t(saved.includes(r.id) ? "Unsave" : "Save")} ${t(r.name)}`}
                      aria-pressed={saved.includes(r.id)}
                      onClick={() => toggle(r.id)}
                    >
                      <Bookmark
                        size={19}
                        fill={saved.includes(r.id) ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                  <div className="resource-content">
                    <span className="resource-category">
                      {t(
                        categories.find((c) => c.id === r.categoryId)?.name ||
                          "",
                      )}
                    </span>
                    <h2>
                      <a href={`/services/${r.id}/`}>{t(r.name)}</a>
                    </h2>
                    <p>{t(r.description)}</p>
                  </div>
                  <span className="resource-domain">
                    {new URL(r.url).hostname.replace(/^www\./, "")}
                  </span>
                  <div className="coverage">
                    <MapPin size={13} />
                    {r.coverage
                      .map((c) =>
                        c === "pakistan"
                          ? t("Federal / national listing")
                          : t(locations.find((l) => l.id === c)?.name || c) +
                            " " +
                            t("listing"),
                      )
                      .join(" · ")}
                  </div>
                  <div className="resource-actions">
                    <a href={`/services/${r.id}/`}>
                      <T>View details</T>
                    </a>
                    <a href={r.url} target="_blank" rel="noopener noreferrer">
                      {t(r.type === "app" ? "Get app links" : "Open website")}
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
          {ready && results.length > 0 && (
            <div className="pagination">
              <span>
                <T>Showing</T> {(page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, results.length)} <T>of</T>{" "}
                {results.length}
              </span>
              <div>
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <T>← Previous</T>
                </button>
                <strong>
                  {page} / {totalPages}
                </strong>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <T>Next →</T>
                </button>
              </div>
            </div>
          )}
          <p className="results-foot">
            <T>
              Static keyword search · No AI or live government data · Confirm
              details with the department.
            </T>
          </p>
        </section>
      </div>
      <div className={"toast " + (message ? "visible" : "")} role="status">
        {t(message)}
        {message && (
          <button
            className="icon-btn"
            aria-label="Dismiss notification"
            onClick={() => setMessage("")}
          >
            <X size={15} />
          </button>
        )}
      </div>
    </main>
  );
}
