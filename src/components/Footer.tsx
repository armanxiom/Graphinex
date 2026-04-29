/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { siteConfig } from "../data/siteConfig";
import { Link } from "react-router-dom";

export const Footer = () => {
  const registrationLinks = siteConfig.trustCertificates || [];

  return (
    <footer className="bg-black text-white px-5 py-12 md:py-16" id="contact">
      <div className="max-w-6xl mx-auto pt-8 md:pt-12 border-t border-white/10 flex flex-col gap-10 md:grid md:grid-cols-3 md:gap-16">
        
        {/* Brand Section */}
        <div className="flex flex-col gap-3" id="footer-brand">
          <div className="flex items-center gap-2">
            <img 
              src={siteConfig.brand.logo} 
              alt={`${siteConfig.brand.name} logo`} 
              className="w-7 h-auto" 
            />
            <span className="text-base font-semibold tracking-tight uppercase">
              {siteConfig.brand.name}
            </span>
          </div>
          <p className="text-[13px] text-gray-400 leading-relaxed max-w-xs font-normal">
            Transforming your content into a client-acquisition machine. 
            We build high-growth digital identities through elite-level production.
          </p>
        </div>

        {/* Desktop Grouped Grid on Mobile */}
        <div className="grid grid-cols-2 gap-8 md:contents">
          {/* Navigation Block */}
          <div className="flex flex-col gap-2" id="footer-nav">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
              Navigation
            </span>
            <div className="flex flex-col gap-2">
              {siteConfig.navigation.map((item, i) => (
                <Link 
                  key={i}
                  to={item.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors w-fit"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <span className="mt-5 text-[10px] uppercase tracking-widest text-gray-500 font-medium">
              Services
            </span>
            <div className="flex flex-col gap-2">
              <Link to="/video-editing" className="text-sm text-gray-300 hover:text-white transition-colors w-fit">
                Video Editing
              </Link>
              <Link to="/logo-design" className="text-sm text-gray-300 hover:text-white transition-colors w-fit">
                Logo Design
              </Link>
              <Link to="/social-media-design" className="text-sm text-gray-300 hover:text-white transition-colors w-fit">
                Social Media Design
              </Link>
            </div>
          </div>

          {/* Contact Block */}
          <div className="flex flex-col gap-2" id="footer-contact">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
              Contact
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-white">
                {siteConfig.contact.phone}
              </span>
              <span className="text-xs text-gray-400 font-normal">
                {siteConfig.contact.email}
              </span>
            </div>
            <div className="flex flex-col gap-1 text-[11px] leading-relaxed text-gray-500">
              <span className="text-[10px] uppercase tracking-widest font-medium text-gray-500">
                Registered Business
              </span>
              <span>
                Graphinex Enterprises
              </span>
              <a
                href={registrationLinks[0]?.pdfUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit hover:text-white transition-colors"
                aria-label="Open GST certificate PDF"
              >
                GSTIN: 09FOXPA7667R1ZI
              </a>
              <a
                href={registrationLinks[1]?.pdfUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit hover:text-white transition-colors"
                aria-label="Open MSME certificate PDF"
              >
                Udyam: UDYAM-UP-04-0049600
              </a>
            </div>
            <div className="text-xs text-gray-500">
              <p>{siteConfig.brand.location}</p>
              <p className="mt-0.5 uppercase tracking-tighter">
                {siteConfig.brand.reach}
              </p>
            </div>
          </div>
        </div>

        {/* Social Section */}
        <div className="flex flex-wrap gap-4 text-[11px] text-gray-500 uppercase tracking-widest font-medium md:col-span-3 pt-2">
          <a
            href="https://www.instagram.com/graphinex.in?igsh=Z3cxYjZ0MDd3NmFq"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/in/graphinex-undefined-45a269407?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://youtube.com/@graphinexagency?si=REwhReV49mnBllr2"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            YouTube
          </a>
          <a
            href="https://x.com/Graphinex_in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Twitter
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-500 gap-4">
        <span className="font-normal text-center sm:text-left">© {new Date().getFullYear()} {siteConfig.brand.name} Agency. All rights reserved.</span>
        <div className="flex gap-6 font-normal">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
        </div>
      </div>
    </footer>
  );
};
