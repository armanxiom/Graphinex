/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { siteConfig } from "../data/siteConfig";
import { Link } from "react-router-dom";

export const Footer = () => {
  const registrationLinks = siteConfig.trustCertificates || [];

  return (
    <footer className="bg-black text-white px-5 py-10 md:py-16" id="contact">
      <div className="max-w-6xl mx-auto flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-16">
        
        {/* Brand Section */}
        <div className="flex flex-col gap-3" id="footer-brand">
          <div className="flex items-center gap-2">
            <img 
              src={siteConfig.brand.logo} 
              alt="Logo" 
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
        <div className="grid grid-cols-2 gap-6 md:contents">
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
                GRAPHITO ENTERPRISES
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
        <div className="flex gap-4 text-[11px] text-gray-500 uppercase tracking-widest font-medium md:col-span-3">
          {["Instagram", "LinkedIn", "YouTube", "Twitter"].map((item, i) => (
            <a
              key={i}
              href="#"
              className="hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto mt-10 pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-500 gap-4">
        <span className="font-normal text-center sm:text-left">© {new Date().getFullYear()} {siteConfig.brand.name} Agency. All rights reserved.</span>
        <div className="flex gap-6 font-normal">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
        </div>
      </div>
    </footer>
  );
};
