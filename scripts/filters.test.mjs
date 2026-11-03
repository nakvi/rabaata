import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { filterResources } from "../src/lib/filters.ts";
const load = (n) =>
  JSON.parse(
    fs.readFileSync(new URL(`../src/data/${n}.json`, import.meta.url)),
  );
const rows = load("resources"),
  locations = load("locations");
const f = {
  q: "",
  region: "",
  district: "",
  category: "",
  type: "",
  localOnly: false,
};
test("Lahore inherits Punjab and national coverage but excludes Sindh", () => {
  const ids = filterResources(rows, locations, {
    ...f,
    region: "punjab",
    district: "punjab-lahore",
  }).map((r) => r.id);
  assert(ids.includes("nadra"));
  assert(ids.includes("punjab-portal"));
  assert(!ids.includes("sindh-portal"));
});
test("local-only excludes inherited resources and finds direct district coverage", () => {
  const fixture = { ...rows[0], id: "local", coverage: ["punjab-lahore"] };
  const out = filterResources([...rows, fixture], locations, {
    ...f,
    region: "punjab",
    district: "punjab-lahore",
    localOnly: true,
  });
  assert(out.some((r) => r.id === "local"));
  assert(out.some((r) => r.id === "lahore-district"));
  assert(out.every((r) => r.coverage.includes("punjab-lahore")));
  assert(!out.some((r) => r.id === "nadra"));
});
test("Roman Urdu alias search", () =>
  assert(
    filterResources(rows, locations, { ...f, q: "shikayat" }).some(
      (r) => r.id === "citizen-portal",
    ),
  ));
test("combined category, type and geography filters", () => {
  const out = filterResources(rows, locations, {
    ...f,
    region: "punjab",
    category: "support",
    type: "app",
  });
  assert.deepEqual(
    out.map((r) => r.id),
    ["citizen-portal-app"],
  );
});
test("no matches stay empty", () =>
  assert.equal(
    filterResources(rows, locations, { ...f, q: "zzzz-nonexistent" }).length,
    0,
  ));

test("province includes district-specific listings", () =>
  assert(
    filterResources(rows, locations, { ...f, region: "punjab" }).some(
      (r) => r.id === "lahore-district",
    ),
  ));

const config = load("search-config");
test("natural Roman Urdu sentence searches only stored keywords", () => {
  const out = filterResources(
    rows,
    locations,
    { ...f, q: "mujhe CNIC banwana hai" },
    config,
  );
  assert.equal(out[0].id, "nadra");
  assert(!out.some((r) => r.id === "passport"));
});
test("Urdu phrase synonym", () => {
  assert.equal(
    filterResources(
      rows,
      locations,
      { ...f, q: "مجھے شناختی کارڈ چاہیے" },
      config,
    )[0].id,
    "nadra",
  );
});
test("licence spelling normalized", () => {
  const r = {
    ...rows[0],
    name: "Driving license",
    keywords: ["driving license"],
  };
  assert.equal(
    filterResources([r], locations, { ...f, q: "driving licence" }, config)
      .length,
    1,
  );
});
test("empty words do not return unrelated results", () =>
  assert.equal(
    filterResources(rows, locations, { ...f, q: "I want to" }, config).length,
    0,
  ));
test("unknown keyword produces no fabricated result", () =>
  assert.equal(
    filterResources(rows, locations, { ...f, q: "xyzunlistedservice" }, config)
      .length,
    0,
  ));

test("electricity bill excludes railway, gas and post listings", () => {
  const out = filterResources(
    rows,
    locations,
    { ...f, q: "electricity bill" },
    config,
  );
  assert(out.length > 5);
  assert(!out.some((r) => /railways|post|gas/i.test(r.name)));
});
test("government jobs finds commissions", () =>
  assert(
    filterResources(
      rows,
      locations,
      { ...f, q: "government jobs" },
      config,
    ).some((r) => r.id === "fpsc"),
  ));

test("all region reference district counts are represented", () => {
  const expected = {
    punjab: 41,
    sindh: 30,
    kp: 40,
    balochistan: 37,
    ajk: 10,
    gb: 14,
    ict: 1,
  };
  for (const [region, count] of Object.entries(expected))
    assert.equal(
      locations.filter((l) => l.type === "district" && l.parentId === region)
        .length,
      count,
    );
});
test("local matches rank before national resources", () => {
  const out = filterResources(rows, locations, {
    ...f,
    region: "punjab",
    district: "punjab-lahore",
  });
  assert(out[0].coverage.includes("punjab-lahore"));
  assert(
    out.findIndex((r) => r.id === "lahore-district") <
      out.findIndex((r) => r.id === "nadra"),
  );
});
test("Faisalabad power resource does not leak into Lahore results", () => {
  const out = filterResources(rows, locations, {
    ...f,
    region: "punjab",
    district: "punjab-lahore",
    category: "utilities",
  });
  assert(!out.some((r) => r.name.includes("Faisalabad Electric")));
});
test("Karachi-only resources do not leak into Hyderabad", () => {
  const out = filterResources(rows, locations, {
    ...f,
    region: "sindh",
    district: "sindh-hyderabad",
  });
  assert(!out.some((r) => r.name === "Karachi Police"));
});
test("all directory names and descriptions have Urdu and Roman Urdu values", () => {
  const dictionary = load("translations");
  for (const r of rows)
    for (const key of [r.name, r.description]) {
      assert(dictionary[key]?.ur);
      assert(dictionary[key]?.roman);
    }
});
