import { T } from "@/components/Preferences";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  MapPin,
  ShieldCheck,
  Globe2,
  Layers,
  Fingerprint,
  Car,
  GraduationCap,
  BriefcaseBusiness,
  House,
  LifeBuoy,
  Landmark,
} from "lucide-react";
import RegionArt from "@/components/RegionArt";
import { CategoryIcon } from "@/components/ResourceIcon";
import categories from "@/data/categories.json";
import resources from "@/data/resources.json";
export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span />
            <T> YOUR GATEWAY TO PUBLIC SERVICES</T>
          </div>
          <h1>
            <T>Pakistan.</T>
            <br />
            <T>A little more</T>
            <br />
            <em>
              <T>within reach.</T>
            </em>
          </h1>
          <p className="lead">
            <T>Your government directory. Thoughtfully connected.</T>
            <br />
            <T>A simpler way to find what you need, wherever you live.</T>
          </p>
          <form action="/explore/" className="hero-search">
            <Search size={21} />
            <input
              name="q"
              aria-label="Search government services"
              placeholder="CNIC, electricity bill, jobs…"
            />
            <button aria-label="Search">
              <ArrowRight />
            </button>
          </form>
          <div className="popular">
            <T>Try </T>
            <a href="/explore/?q=cnic">
              <T>CNIC</T>
            </a>
            <a href="/explore/?q=jobs">
              <T>Government jobs</T>
            </a>
            <a href="/explore/?category=transport">
              <T>Vehicle services</T>
            </a>
          </div>
          <div className="hero-foot">
            <ShieldCheck size={17} />
            <T> Official destinations </T>
            <span>·</span>
            <T> No account needed</T>
          </div>
        </div>
        <RegionArt />
      </section>
      <div className="trust-strip">
        <span>
          <Globe2 /> {resources.length} directory resources
        </span>
        <span>
          <MapPin />
          <T> 7 provinces & territories</T>
        </span>
        <span>
          <Layers />
          <T> Websites & mobile apps</T>
        </span>
        <a href="/about/">
          <T>Independent. Transparent. </T>
          <ArrowUpRight size={16} />
        </a>
      </div>
      <section className="section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <T>START WITH WHAT YOU NEED</T>
            </div>
            <h2>
              <T>Everyday needs.</T>
              <br />
              <T>Clearer directions.</T>
            </h2>
          </div>
          <p>
            <T>You shouldn’t need to know the department name.</T>
            <br />
            <T>Start with the thing you want to get done.</T>
          </p>
        </div>
        <div className="category-grid">
          {categories.map((c, i) => {
            return (
              <a
                href={`/explore/?category=${c.id}`}
                className="category-card"
                key={c.id}
              >
                <div className="category-top">
                  <CategoryIcon category={c.id} size={27} />
                  <ArrowUpRight size={18} />
                </div>
                <span className="urdu" lang="ur">
                  {c.urdu}
                </span>
                <h3>
                  <T>{c.name}</T>
                </h3>
                <small>
                  {resources.filter((r) => r.categoryId === c.id).length}{" "}
                  resources
                </small>
              </a>
            );
          })}
          <a href="/explore/" className="category-card all-card">
            <ArrowUpRight size={32} />
            <h3>
              <T>A place for</T>
              <br />
              <T>every next step.</T>
            </h3>
            <span>
              <T>Explore all resources →</T>
            </span>
          </a>
        </div>
      </section>
      <section className="region-section">
        <div>
          <div className="eyebrow">
            <T>CLOSER TO HOME</T>
          </div>
          <h2>
            <T>Your province.</T>
            <br />
            <T>Your starting point.</T>
          </h2>
          <p>
            <T>
              Find regional resources alongside national services available in
              your area.
            </T>
          </p>
          <a className="text-link" href="/explore/">
            <T>Explore by district </T>
            <ArrowRight size={17} />
          </a>
        </div>
        <div className="region-list">
          {[
            ["punjab", "Punjab", "پنجاب"],
            ["sindh", "Sindh", "سندھ"],
            ["kp", "Khyber Pakhtunkhwa", "خیبر پختونخوا"],
            ["balochistan", "Balochistan", "بلوچستان"],
            ["ict", "Islamabad", "اسلام آباد"],
            ["ajk", "Azad Jammu & Kashmir", "آزاد کشمیر"],
            ["gb", "Gilgit-Baltistan", "گلگت بلتستان"],
          ].map(([id, name, ur], i) => (
            <a key={id} href={`/explore/?region=${id}`}>
              <span className="region-index">0{i + 1}</span>
              <strong>
                <T>{name}</T>
              </strong>
              <span className="urdu" lang="ur">
                {ur}
              </span>
              <ArrowUpRight size={18} />
            </a>
          ))}
        </div>
      </section>
      <section className="section how">
        <div className="eyebrow">
          <T>A SHORTER PATH</T>
        </div>
        <h2>
          <T>Find it. Understand it. Get started.</T>
        </h2>
        <div className="steps">
          {[
            [
              "01",
              "Choose your area",
              "Select a province and district to bring relevant resources into focus.",
            ],
            [
              "02",
              "Find your service",
              "Search by task, browse a category, or discover an official mobile app.",
            ],
            [
              "03",
              "Continue with confidence",
              "See the destination and open the official website to take your next step.",
            ],
          ].map(([n, t, d]) => (
            <article key={n}>
              <span>{n}</span>
              <h3>
                <T>{t}</T>
              </h3>
              <p>
                <T>{d}</T>
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="bottom-cta">
        <div>
          <span className="eyebrow">
            <T>LESS SEARCHING. MORE DOING.</T>
          </span>
          <h2>
            <T>Your next step starts here.</T>
          </h2>
        </div>
        <a className="btn cream" href="/explore/">
          <T>Explore the directory </T>
          <ArrowUpRight size={18} />
        </a>
      </section>
    </main>
  );
}
