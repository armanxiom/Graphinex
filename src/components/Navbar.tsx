/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { siteConfig } from '../data/siteConfig';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

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

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* 2. TOP ACTIVITY BAR (SCROLLING) */}
      <div className="w-full bg-black text-white text-[10px] uppercase tracking-widest overflow-hidden border-b border-white/10 h-8 flex items-center">
        <div className="whitespace-nowrap flex animate-scroll gap-10">
          {[...activityItems, ...activityItems].map((item, i) => (
            <span key={i} className="flex items-center gap-3 opacity-70">
              <span className="w-1 h-1 bg-brand-orange rounded-full"></span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* 3. NAVBAR BELOW TOP BAR */}
      <nav 
        className="pt-3 pb-3 md:pt-4 md:pb-0 flex items-center justify-center"
        id="navbar"
      >
        <div className="hidden md:flex w-full max-w-6xl items-center justify-between gap-4 px-4">
          <Link to="/" className="flex items-center gap-2 group z-[60] shrink-0" id="nav-logo">
            <img
              src={siteConfig.brand.logo}
              alt={siteConfig.brand.name}
              className="w-8 h-auto transition-transform duration-300 group-hover:scale-105 motion-optimised"
              loading="eager"
              decoding="async"
            />
            <span className="text-sm font-semibold text-black tracking-tight uppercase whitespace-nowrap">
              {siteConfig.brand.name}
            </span>
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-black/8 bg-white/75 px-2 py-2 shadow-[0_12px_40px_rgba(15,15,15,0.08)] backdrop-blur-xl">
            {siteConfig.navigation.map((item) => (
              <HoverNavItem key={item.href} to={item.href} label={item.name} />
            ))}
          </div>

          <a
            href={siteConfig.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button shrink-0 rounded-full bg-black px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-transform duration-300 hover:scale-[1.05]"
          >
            Get in touch
          </a>
        </div>

        <div className="flex md:hidden w-full items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 group z-[60]">
            <img
              src={siteConfig.brand.logo}
              alt={siteConfig.brand.name}
              className="w-8 h-auto transition-transform duration-300 group-hover:scale-105 motion-optimised"
              loading="eager"
              decoding="async"
            />
            <span className="text-sm font-semibold text-black tracking-tight uppercase whitespace-nowrap">
              {siteConfig.brand.name}
            </span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-brand-dark z-[60] p-2 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
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
                className="fixed top-0 right-0 h-full w-[70%] max-w-[280px] bg-white z-[100] flex flex-col shadow-2xl rounded-l-2xl"
              >
                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-black/5">
                  <span className="text-lg font-bold text-black tracking-tight uppercase">Menu</span>
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
                      className="text-[1.1rem] font-semibold text-black hover:text-brand-orange transition-colors"
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
                    className="block text-center bg-brand-orange text-white py-3.5 rounded-full font-bold shadow-lg shadow-brand-orange/20 hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
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

