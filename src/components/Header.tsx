"use client";
import { useState } from "react";
import { PreferencesControls, T } from "@/components/Preferences";
import { Menu, X, ArrowUpRight, Bookmark } from "lucide-react";
export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <a href="/" className="brand" aria-label="Raabta home">
        رابطہ{" "}
        <span>
          Raabta<span className="brand-dot">.</span>
        </span>
      </a>
      <button
        className="mobile-menu icon-btn"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <PreferencesControls />
      <nav className={open ? "nav open" : "nav"}>
        <a href="/explore/">
          <T>Explore services</T>
        </a>
        <a href="/explore/?type=app">
          <T>Government apps</T>
        </a>
        <a href="/about/">
          <T>How it works</T>
        </a>
        <a className="saved-nav" href="/explore/?saved=1">
          <Bookmark size={16} />
          <T> Saved</T>
        </a>
        <a className="btn dark" href="/explore/">
          <T>Find a service </T>
          <ArrowUpRight size={16} />
        </a>
      </nav>
    </header>
  );
}
