"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Languages, Sun, Moon, Monitor } from "lucide-react";
import translations from "@/data/translations.json";
export type Locale = "en" | "ur" | "roman";
type Theme = "light" | "dark" | "system";
const dictionary = translations as Record<
  string,
  { ur: string; roman: string }
>;
export function translate(text: string, locale: Locale) {
  if (locale === "en") return text;
  const key = text.trim();
  const row = dictionary[key];
  if (!row) return text;
  return text.replace(key, row[locale]);
}
const C = createContext({
  locale: "en" as Locale,
  theme: "light" as Theme,
  setLocale: (_v: Locale) => {},
  setTheme: (_v: Theme) => {},
  t: (s: string) => s,
});
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [theme, setTheme] = useState<Theme>("light");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const l = localStorage.getItem("raabta:locale");
      const th = localStorage.getItem("raabta:theme");
      if (l === "ur" || l === "roman" || l === "en") setLocale(l);
      if (th === "dark" || th === "light" || th === "system") setTheme(th);
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    document.documentElement.lang =
      locale === "ur" ? "ur" : locale === "roman" ? "ur-Latn" : "en";
    document.documentElement.dir = locale === "ur" ? "rtl" : "ltr";
    document.documentElement.dataset.locale = locale;
    if (loaded)
      try {
        localStorage.setItem("raabta:locale", locale);
      } catch {}
  }, [locale, loaded]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      document.documentElement.dataset.theme =
        theme === "system" ? (media.matches ? "dark" : "light") : theme;
    };
    apply();
    media.addEventListener("change", apply);
    if (loaded)
      try {
        localStorage.setItem("raabta:theme", theme);
      } catch {}
    return () => media.removeEventListener("change", apply);
  }, [theme, loaded]);
  return (
    <C.Provider
      value={{
        locale,
        theme,
        setLocale,
        setTheme,
        t: (s) => translate(s, locale),
      }}
    >
      {children}
    </C.Provider>
  );
}
export const usePreferences = () => useContext(C);
export function T({ children }: { children: ReactNode }) {
  const { t } = usePreferences();
  return <>{typeof children === "string" ? t(children) : children}</>;
}
export function PreferencesControls() {
  const { locale, setLocale, theme, setTheme, t } = usePreferences();
  return (
    <div className="preferences">
      <label className="pref-select">
        <Languages size={15} />
        <span className="sr-only">Language</span>
        <select
          aria-label="Language"
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
        >
          <option value="en">English</option>
          <option value="ur">اردو</option>
          <option value="roman">Roman Urdu</option>
        </select>
      </label>
      <label className="pref-select theme-select">
        {theme === "dark" ? (
          <Moon size={15} />
        ) : theme === "system" ? (
          <Monitor size={15} />
        ) : (
          <Sun size={15} />
        )}
        <span className="sr-only">Theme</span>
        <select
          aria-label="Theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
        >
          <option value="light">{t("Light")}</option>
          <option value="dark">{t("Dark")}</option>
          <option value="system">{t("System")}</option>
        </select>
      </label>
    </div>
  );
}
