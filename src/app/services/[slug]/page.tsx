import { T } from "@/components/Preferences";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Building2,
  ExternalLink,
} from "lucide-react";
import resources from "@/data/resources.json";
import locations from "@/data/locations.json";
import categories from "@/data/categories.json";
import Checklist from "@/components/Checklist";
import ResourceIcon from "@/components/ResourceIcon";
export function generateStaticParams() {
  return resources.map((r) => ({ slug: r.id }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = resources.find((r) => r.id === slug);
  return { title: r?.name || "Resource not found" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = resources.find((r) => r.id === slug);
  if (!r) notFound();
  return (
    <main className="detail">
      <a className="text-link" href="/explore/">
        <ArrowLeft size={16} />
        <T>Back to directory</T>
      </a>
      <div className="detail-head">
        <div>
          <div className="eyebrow">
            <T>{categories.find((c) => c.id === r.categoryId)?.name}</T> ·{" "}
            <T>{r.type}</T>
          </div>
          <div className="detail-brand">
            <ResourceIcon
              name={r.name}
              url={r.iconUrl}
              category={r.categoryId}
            />
            <h1>
              <T>{r.name}</T>
            </h1>
          </div>
          <p className="lead">
            <T>{r.description}</T>
          </p>
          <div className="detail-meta">
            <span>
              <Building2 size={17} />
              <T>{r.department}</T>
            </span>
            <span>
              <MapPin size={17} />
              {r.coverage.map((c) => (
                <span key={c}>
                  <T>{locations.find((l) => l.id === c)?.name}</T>
                </span>
              ))}
            </span>
          </div>
        </div>
        <a
          className="btn dark"
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <T>
            {r.type === "app"
              ? "Official app download page"
              : "Continue to official website"}
          </T>
          <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="detail-columns">
        <div>
          <Checklist />
          <section className="detail-section">
            <h2>
              <T>Your next steps</T>
            </h2>
            <ol>
              <li>
                <T>
                  Open the official department website using the link above.
                </T>
              </li>
              <li>
                <T>
                  Choose the service you need and check its current
                  instructions.
                </T>
              </li>
              <li>
                <T>
                  Confirm whether the process is online, appointment-based, or
                  requires a visit.
                </T>
              </li>
            </ol>
            <p>
              <T>
                Fees, eligibility, required documents and processing times are
                not reproduced here because they require service-specific
                editorial verification.
              </T>
            </p>
          </section>
        </div>
        <aside className="source-box">
          <div className="eyebrow">
            <T>DESTINATION & SOURCES</T>
          </div>
          <h3>
            <T>Know where you’re going.</T>
          </h3>
          <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer">
            {new URL(r.sourceUrl).hostname}
            <ExternalLink size={14} />
          </a>
          <dl>
            {"directorySource" in r && (
              <>
                <dt>
                  <T>Directory discovery</T>
                </dt>
                <dd>
                  <a
                    href={String(r.directorySource)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <T>Discovery source ↗</T>
                  </a>
                </dd>
              </>
            )}
            <dt>
              <T>Editorial status</T>
            </dt>
            <dd>
              <T>{r.reviewStatus}</T>
            </dd>
            <dt>
              <T>Source reviewed</T>
            </dt>
            <dd>
              <T>{r.reviewedAt || "Not individually reviewed"}</T>
            </dd>
            <dt>
              <T>Location classification</T>
            </dt>
            <dd>
              <T>Directory grouping; service eligibility not verified</T>
            </dd>
            <dt>
              <T>Availability</T>
            </dt>
            <dd>
              <T>Not monitored live</T>
            </dd>
          </dl>
          <p>
            <T>
              This directory does not process applications, collect identity
              documents, or accept government payments.
            </T>
          </p>
          <a className="text-link" href="/about/#corrections">
            <T>How to suggest a correction →</T>
          </a>
        </aside>
      </div>
      <section className="detail-section">
        <h2>
          <T>Related resources</T>
        </h2>
        <div className="related">
          {resources
            .filter((x) => x.id !== r.id && x.categoryId === r.categoryId)
            .slice(0, 3)
            .map((x) => (
              <a key={x.id} href={`/services/${x.id}/`}>
                <T>{x.name}</T>
                <ArrowUpRight size={16} />
              </a>
            ))}
        </div>
      </section>
    </main>
  );
}
