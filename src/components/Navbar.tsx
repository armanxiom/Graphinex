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
        className="bg-white/92 backdrop-blur-md border-b border-black/5 h-14 flex items-center shadow-[0_12px_40px_rgba(15,15,15,0.04)]"
        id="navbar"
      >
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-5 lg:px-6 flex items-center justify-between">
          {/* 4. LOGO + TEXT FIX (VISIBLE) */}
          <Link to="/" className="flex items-center gap-2 group z-[60]" id="nav-logo">
            <img 
              src={siteConfig.brand.logo} 
              alt={`${siteConfig.brand.name} logo`} 
              className="w-8 h-auto transition-transform group-hover:scale-105" 
            />
            <span className="text-sm font-semibold text-black tracking-tight uppercase whitespace-nowrap">
              {siteConfig.brand.name}
            </span>
          </Link>
          
          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8" id="nav-links-desktop">
            {siteConfig.navigation.map((item) => (
              <Link 
                key={item.href} 
                to={item.href}
                className="text-sm font-medium text-brand-dark/70 hover:text-brand-dark transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <a 
              href={siteConfig.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-button bg-brand-orange text-white shadow-[0_12px_30px_rgba(255,106,0,0.2)] hover:shadow-[0_18px_40px_rgba(255,106,0,0.28)] hover:-translate-y-0.5 focus-visible:ring-offset-white"
            >
              Get in touch
            </a>
          </div>
          
          {/* 5. MOBILE MENU ICON FIX */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-brand-dark z-[60] p-2 flex items-center justify-center"
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
                      className="text-lg font-semibold text-black hover:text-brand-orange transition-colors"
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
                    className="block text-center bg-brand-orange text-white py-3.5 rounded-full font-bold shadow-[0_12px_30px_rgba(255,106,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(255,106,0,0.28)]"
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
