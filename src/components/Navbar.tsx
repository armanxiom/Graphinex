/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { siteConfig } from '../data/siteConfig';
import { useState, useEffect, type PointerEvent as ReactPointerEvent } from 'react';
import { ChevronRight, Menu, Moon, SunMedium, X } from 'lucide-react';

const activityItems = [
  "Client from Dubai booked Branding Package",
  "YouTuber gained 2.1M+ views from our edits",
  "New reel project started for Real Estate brand",
  "Fitness creator increased engagement by 3X",
  "Client from Lucknow booked full package",
  "Thumbnail CTR boosted to 12%+",
];

const mobileNavMeta: Record<string, string> = {
  Services: 'Jump to services',
  Portfolio: 'Open case studies',
  About: 'Meet the studio',
  Contact: 'Start a conversation'
};

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

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsOpen(false);
      }
    };

    if (mediaQuery.matches) {
      setIsOpen(false);
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const closeMenu = () => setIsOpen(false);

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
    <header className="fixed inset-x-0 top-0 z-[150] isolate backdrop-blur-2xl">
      {/* 2. TOP ACTIVITY BAR (SCROLLING) */}
      <div className="hidden h-8 w-full items-center overflow-hidden border-b border-[color:var(--nav-border)] bg-[color:var(--nav-surface)] text-[10px] uppercase tracking-widest text-[color:var(--page-text)] md:flex">
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
        className="relative overflow-hidden border-b border-[color:var(--nav-border)] bg-[color:var(--nav-surface)] backdrop-blur-2xl"
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
            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--nav-border)] bg-[color:var(--nav-chip-surface)] text-brand-dark shadow-[0_12px_26px_rgba(17,17,17,0.08)] backdrop-blur-xl transition-transform duration-300 active:scale-[0.97]"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu-panel"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* FULL SCREEN DARK OVERLAY */}
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMenu}
                aria-label="Close menu"
                className="mobile-menu-overlay fixed inset-0 z-[160] md:hidden"
              />

              {/* MOBILE SHEET */}
              <motion.div
                id="mobile-menu-panel"
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 28, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                className="mobile-menu-shell fixed inset-2 z-[170] md:hidden"
              >
                <div className="mobile-menu-header">
                  <div className="mobile-menu-grabber" />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="mobile-menu-title">Menu</p>
                      <p className="mt-1 text-[0.78rem] text-[color:var(--page-muted)]">
                        Browse the studio
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closeMenu}
                      className="mobile-menu-close"
                      aria-label="Close menu"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="mobile-menu-brand mt-4">
                    <img
                      src={siteConfig.brand.logo}
                      alt={siteConfig.brand.name}
                      className="h-10 w-10 shrink-0 rounded-full object-contain"
                      loading="eager"
                      decoding="async"
                    />
                    <div className="min-w-0">
                      <p className="mobile-menu-brand__name">{siteConfig.brand.name}</p>
                      <p className="mobile-menu-brand__meta">{siteConfig.brand.tagline}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-[color:var(--page-muted)]">
                    <span>{siteConfig.brand.location}</span>
                    <span className="h-1 w-1 rounded-full bg-brand-orange" aria-hidden="true" />
                    <span>{siteConfig.brand.reach}</span>
                  </div>
                </div>

                <div className="mobile-menu-scroll flex-1 overflow-y-auto">
                  <div className="px-4 pb-4">
                    <p className="mobile-menu-section">Quick links</p>
                    <nav className="mobile-menu-nav mt-3" aria-label="Mobile navigation">
                      {siteConfig.navigation.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={closeMenu}
                          className="mobile-menu-link"
                        >
                          <span className="min-w-0">
                            <span className="mobile-menu-link__label">{item.name}</span>
                            <span className="mobile-menu-link__meta">
                              {mobileNavMeta[item.name] ?? 'Open section'}
                            </span>
                          </span>
                          <span className="mobile-menu-link__icon" aria-hidden="true">
                            <ChevronRight size={16} />
                          </span>
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>

                <div className="mobile-menu-footer">
                  <a
                    href={siteConfig.contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className="mobile-menu-cta"
                  >
                    Get in touch
                  </a>
                  <p className="mobile-menu-note">
                    Prefer WhatsApp? We usually reply quickly during business hours.
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

