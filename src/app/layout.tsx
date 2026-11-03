import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { PreferencesProvider, T } from "@/components/Preferences";
export const metadata: Metadata = {
  title: {
    default: "Raabta — Pakistan, within reach",
    template: "%s | Raabta",
  },
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
  description:
    "An independent directory of Pakistan government websites, apps and citizen services. Find your province, district and next step.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PreferencesProvider>
          <div className="flag-watermark" aria-hidden="true" />
          <Header />
          {children}
          <footer className="footer">
            <div>
              <a className="brand" href="/">
                رابطہ{" "}
                <span>
                  Raabta<span className="brand-dot">.</span>
                </span>
              </a>
              <p>
                <T>Public services. A clearer path.</T>
              </p>
            </div>
            <div>
              <a href="/explore/">
                <T>Explore directory</T>
              </a>
              <a href="/explore/?saved=1">
                <T>Your saved links</T>
              </a>
              <a href="/about/">
                <T>About & sources</T>
              </a>
            </div>
            <small>
              <T>
                Independent directory. Not affiliated with the Government of
                Pakistan.
              </T>
              <br />
              <T>Applications and payments take place on official websites.</T>
            </small>
          </footer>
        </PreferencesProvider>
      </body>
    </html>
  );
}
