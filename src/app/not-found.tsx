import { T } from "@/components/Preferences";
export default function NotFound() {
  return (
    <main className="empty">
      <div className="eyebrow">
        <T>404 · PAGE NOT FOUND</T>
      </div>
      <h1>
        <T>A different path awaits.</T>
      </h1>
      <p>
        <T>This page does not exist in the directory.</T>
      </p>
      <a href="/explore/" className="btn dark">
        <T>Explore services →</T>
      </a>
    </main>
  );
}
