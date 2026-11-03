"use client";
import { T } from "@/components/Preferences";
import { useState } from "react";
import { Printer } from "lucide-react";
export default function Checklist() {
  const [checks, setChecks] = useState<number[]>([]);
  return (
    <section className="checklist">
      <h2>
        <T>Before you continue</T>
      </h2>
      <p>
        <T>
          A general preparation checklist—not an official document requirement
          list.
        </T>
      </p>
      {[
        "Check eligibility and service coverage on the official website.",
        "Read the current document requirements and fees.",
        "Confirm the official website address before entering personal information.",
        "Save your application reference after submitting.",
      ].map((s, i) => (
        <label className="check-label" key={s}>
          <input
            type="checkbox"
            checked={checks.includes(i)}
            onChange={() =>
              setChecks(
                checks.includes(i)
                  ? checks.filter((x) => x !== i)
                  : [...checks, i],
              )
            }
          />
          <T>{s}</T>
        </label>
      ))}
      <button className="btn outline" onClick={() => window.print()}>
        <Printer size={17} />
        <T>Print this guide</T>
      </button>
    </section>
  );
}
