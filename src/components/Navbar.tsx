/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { siteConfig } from '../data/siteConfig';
import { useState, useEffect, type PointerEvent as ReactPointerEvent } from 'react';
import { Menu, Moon, SunMedium, X } from 'lucide-react';

const activityItems = [
  "Client from Dubai booked Branding Package",
  "YouTuber gained 2.1M+ views from our edits",
  "New reel project started for Real Estate brand",
  "Fitness creator increased engagement by 3X",
  "Client from Lucknow booked full package",
  "Thumbnail CTR boosted to 12%+",
];

function HoverNavItem({
  to,
  label
}: {
  to: string;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-full border border-transparent px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-dark/70 transition-colors duration-300 hover:border-black hover:bg-black hover:text-white"
    >
      <span className="relative block h-4 overflow-hidden">
        <span className="block translate-y-0 transition-transform duration-300 ease-in-out group-hover:-translate-y-full motion-optimised">
          {label}
        </span>
        <span className="absolute left-0 top-0 block translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0 motion-optimised">
          {label}
        </span>
      </span>
    </Link>
  );
}

type ThemeMode = 'light' | 'dark';

function ThemeToggle({
  theme,
  onToggle,
  compact = false
}: {
  theme: ThemeMode;
  onToggle: () => void;
  compact?: boolean;
}) {
  const darkMode = theme === 'dark';
  const indicatorTone = darkMode ? 'text-white/35' : 'text-black/35';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={darkMode}
      className={`relative inline-flex items-center overflow-hidden rounded-full border border-[color:var(--nav-border)] bg-[color:var(--toggle-track)] p-[3px] transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_12px_22px_rgba(17,17,17,0.08)] ${
        compact ? 'h-9 w-[4.85rem]' : 'h-10 w-[5.15rem]'
      }`}
    >
      <span className={`absolute left-2 z-[1] text-[10px] ${indicatorTone}`}>
        <SunMedium size={compact ? 11 : 12} />
      </span>
      <span className={`absolute right-2 z-[1] text-[10px] ${indicatorTone}`}>
        <Moon size={compact ? 11 : 12} />
      </span>

      <span
        className={`absolute left-[3px] top-[3px] bottom-[3px] z-[2] flex w-[calc(50%-3px)] items-center justify-center rounded-full bg-[linear-gradient(180deg,#ffffff_0%,#f4efe6_100%)] text-black shadow-[0_10px_24px_rgba(17,17,17,0.14),inset_0_1px_0_rgba(255,255,255,0.72)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          darkMode ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        {darkMode ? <Moon size={compact ? 12 : 13} /> : <SunMedium size={compact ? 12 : 13} />}
      </span>
    </button>
  );
}

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const storedTheme = window.localStorage.getItem('graphinex-theme');

    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    window.localStorage.setItem('graphinex-theme', theme);

    const themeColor = theme === 'dark' ? '#0c0c0c' : '#faf6f0';
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    metaThemeColor?.setAttribute('content', themeColor);
  }, [theme]);

  const handleLiquidPointer = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    el.style.setProperty('--pointer-x', `${Math.min(100, Math.max(0, x))}%`);
    el.style.setProperty('--pointer-y', `${Math.min(100, Math.max(0, y))}%`);
    el.style.setProperty('--fill-progress', '1');
  };

  const resetLiquidPointer = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty('--fill-progress', '0');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[90]">
      {/* 2. TOP ACTIVITY BAR (SCROLLING) */}
      <div className="flex h-8 w-full items-center overflow-hidden border-b border-[color:var(--nav-border)] bg-[color:var(--nav-surface)] text-[10px] uppercase tracking-widest text-[color:var(--page-text)]">
        <div className="whitespace-nowrap flex animate-scroll gap-10">
          {[...activityItems, ...activityItems].map((item, i) => (
            <span key={i} className="flex items-center gap-3 opacity-70">
              <span className="w-1 h-1 bg-brand-orange rounded-full"></span>
              {item}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden border-b border-[color:var(--nav-border)] bg-[color:var(--nav-surface)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.35),transparent_28%),radial-gradient(circle_at_right,rgba(255,106,0,0.18),transparent_22%)]" />
        <div className="relative mx-auto flex w-[min(94vw,1120px)] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 items-center rounded-full bg-gradient-to-r from-[#ff8a2a] to-[#ff2d55] px-4 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_14px_28px_rgba(255,106,0,0.22)]">
              50% OFF
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[color:var(--page-text)] opacity-70 sm:text-[11px]">
              Limited launch offer for selected projects
            </p>
          </div>

          <a
            href={siteConfig.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onPointerEnter={handleLiquidPointer}
            onPointerMove={handleLiquidPointer}
            onPointerLeave={resetLiquidPointer}
            onFocus={(event) => {
              event.currentTarget.style.setProperty('--pointer-x', '50%');
              event.currentTarget.style.setProperty('--pointer-y', '50%');
              event.currentTarget.style.setProperty('--fill-progress', '1');
            }}
            onBlur={(event) => {
              event.currentTarget.style.setProperty('--fill-progress', '0');
            }}
            className="liquid-fill-button shrink-0 self-start px-4 py-2.5 sm:self-auto"
          >
            <span className="liquid-fill-button__label">Claim Offer</span>
          </a>
        </div>
      </motion.div>

      {/* 3. NAVBAR BELOW TOP BAR */}
      <nav className="flex items-center justify-center py-3 md:py-4" id="navbar">
        <div className="hidden md:flex w-[min(94vw,1120px)] items-center justify-between gap-4 rounded-full border border-[color:var(--nav-border)] bg-[color:var(--nav-surface)] px-4 py-3 shadow-[0_22px_64px_rgba(15,15,15,0.12)] backdrop-blur-2xl">
          <Link to="/" className="flex items-center gap-2 group z-[60] shrink-0" id="nav-logo">
            <img
              src={siteConfig.brand.logo}
              alt={siteConfig.brand.name}
              className="w-8 h-auto transition-transform duration-300 group-hover:scale-105 motion-optimised"
              loading="eager"
              decoding="async"
            />
            <span className="ios-bold text-sm uppercase whitespace-nowrap text-brand-dark">
              {siteConfig.brand.name}
            </span>
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-[color:var(--nav-border)] bg-[color:var(--nav-chip-surface)] px-2 py-2 shadow-[0_12px_40px_rgba(15,15,15,0.08)] backdrop-blur-xl">
            {siteConfig.navigation.map((item) => (
              <HoverNavItem key={item.href} to={item.href} label={item.name} />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} />
            <a
              href={siteConfig.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={handleLiquidPointer}
              onPointerMove={handleLiquidPointer}
              onPointerLeave={resetLiquidPointer}
              onFocus={(event) => {
                event.currentTarget.style.setProperty('--pointer-x', '50%');
                event.currentTarget.style.setProperty('--pointer-y', '50%');
                event.currentTarget.style.setProperty('--fill-progress', '1');
              }}
            onBlur={(event) => {
              event.currentTarget.style.setProperty('--fill-progress', '0');
            }}
            className="liquid-fill-button shrink-0 px-5 py-3"
          >
              <span className="liquid-fill-button__label">Get in touch</span>
            </a>
          </div>
        </div>

        <div className="flex w-full items-center justify-between px-4 md:hidden">
          <Link to="/" className="flex items-center gap-2 group z-[60]">
            <img
              src={siteConfig.brand.logo}
              alt={siteConfig.brand.name}
              className="w-8 h-auto transition-transform duration-300 group-hover:scale-105 motion-optimised"
              loading="eager"
              decoding="async"
            />
            <span className="text-sm font-semibold text-brand-dark tracking-tight uppercase whitespace-nowrap">
              {siteConfig.brand.name}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle compact theme={theme} onToggle={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} />
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-dark z-[60] flex items-center justify-center p-2" aria-label="Toggle menu">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* FULL SCREEN DARK OVERLAY */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black z-[90]"
              />

              {/* SIDE MENU DRAWER */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed top-0 right-0 z-[100] flex h-full w-[70%] max-w-[280px] flex-col rounded-l-2xl bg-[color:var(--page-surface)] shadow-2xl"
              >
                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-[color:var(--nav-border)] px-6 py-5">
                  <span className="text-lg font-bold tracking-tight uppercase text-brand-dark">Menu</span>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 -mr-2 text-brand-dark"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* LINKS */}
                <div className="flex flex-col gap-6 px-6 py-8">
                  {siteConfig.navigation.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-[1.1rem] font-semibold text-brand-dark transition-colors hover:text-brand-orange"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-auto px-6 pb-8">
            <a
              href={siteConfig.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="block rounded-full bg-brand-orange py-3.5 text-center font-bold text-white shadow-lg shadow-brand-orange/20 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] active:scale-[0.98]"
            >
              Get in touch
            </a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

