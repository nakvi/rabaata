import fs from "node:fs";
import assert from "node:assert/strict";
const read = (n) =>
  JSON.parse(
    fs.readFileSync(new URL(`../src/data/${n}.json`, import.meta.url)),
  );
const locations = read("locations"),
  categories = read("categories"),
  resources = read("resources");
for (const [name, rows] of Object.entries({
  locations,
  categories,
  resources,
})) {
  assert.equal(
    new Set(rows.map((x) => x.id)).size,
    rows.length,
    `${name}: duplicate IDs`,
  );
}
for (const l of locations) {
  assert(
    !l.parentId || locations.some((p) => p.id === l.parentId),
    `Invalid parent: ${l.id}`,
  );
  let id = l.id,
    seen = new Set();
  while (id) {
    assert(!seen.has(id), "Location cycle");
    seen.add(id);
    id = locations.find((x) => x.id === id)?.parentId;
  }
}
for (const r of resources) {
  assert(r.name && r.department && r.description);
  assert(categories.some((c) => c.id === r.categoryId));
  assert(
    r.coverage.length &&
      r.coverage.every((id) => locations.some((l) => l.id === id)),
  );
  for (const key of ["url", "sourceUrl"])
    assert.equal(new URL(r[key]).protocol, "https:");
  assert(["website", "app"].includes(r.type));
  assert(/^[a-z0-9-]+$/.test(r.id));
}
assert.equal(
  new Set(resources.map((r) => r.url + "|" + r.type)).size,
  resources.length,
  "Duplicate URL/type",
);
console.log(
  `Validated ${resources.length} resources, ${locations.length} locations, ${categories.length} categories.`,
);

const manifest = read("import-manifest");
assert.equal(manifest.sourceCount, 194);
assert.equal(manifest.entries.length, 194);
for (const entry of manifest.entries) {
  assert(
    resources.some((r) => r.id === entry.resourceId),
    `Missing imported resource: ${entry.name}`,
  );
}
console.log("All 194 source directory entries accounted for.");
const translations = read("translations");
for (const r of resources) {
  assert(translations[r.name]?.ur && translations[r.name]?.roman);
  assert(translations[r.description]?.ur && translations[r.description]?.roman);
}
const metadata = read("location-metadata");
for (const [region, count] of Object.entries(metadata.counts))
  assert.equal(
    locations.filter((l) => l.type === "district" && l.parentId === region)
      .length,
    count,
  );
console.log("Translation catalogue and district reference counts validated.");
