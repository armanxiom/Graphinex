import { siteConfig } from "../data/siteConfig";
import { Link } from "react-router-dom";

export const Footer = () => {
  const registrationLinks = siteConfig.trustCertificates || [];

  return (
    <footer className="bg-black px-5 py-10 text-white md:py-16" id="contact">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:grid md:grid-cols-3 md:gap-16">
        <div className="flex flex-col gap-3" id="footer-brand">
          <div className="flex items-center gap-2">
            <img
              src={siteConfig.brand.logo}
              alt="Logo"
              className="motion-optimised h-auto w-7"
              loading="lazy"
              decoding="async"
            />
            <span className="text-base font-semibold uppercase tracking-tight">
              {siteConfig.brand.name}
            </span>
          </div>
          <p className="max-w-xs text-[13px] font-normal leading-relaxed text-gray-400">
            Transforming your content into a client-acquisition machine.
            We build high-growth digital identities through elite-level production.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:contents">
          <div className="flex flex-col gap-2" id="footer-nav">
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">
              Navigation
            </span>
            <div className="flex flex-col gap-2">
              {siteConfig.navigation.map((item, i) => (
                <Link
                  key={i}
                  to={item.href}
                  className="w-fit text-sm text-gray-300 transition-colors duration-300 hover:text-white"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2" id="footer-contact">
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">
              Contact
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-white">
                {siteConfig.contact.phone}
              </span>
              <span className="text-xs font-normal text-gray-400">
                {siteConfig.contact.email}
              </span>
            </div>
            <div className="flex flex-col gap-1 text-[11px] leading-relaxed text-gray-500">
              <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">
                Registered Business
              </span>
              <span>Graphinex Enterprises</span>
              <a
                href={registrationLinks[0]?.pdfUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit transition-colors duration-300 hover:text-white"
                aria-label="Open GST certificate PDF"
              >
                GSTIN: 09FOXPA7667R1ZI
              </a>
              <a
                href={registrationLinks[1]?.pdfUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit transition-colors duration-300 hover:text-white"
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

        <div className="flex gap-4 text-[11px] font-medium uppercase tracking-widest text-gray-500 md:col-span-3">
          {["Instagram", "LinkedIn", "YouTube", "Twitter"].map((item, i) => (
            <a
              key={i}
              href="#"
              className="transition-colors duration-300 hover:text-white"
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-4 text-[11px] text-gray-500 md:flex-row">
        <span className="font-normal text-center sm:text-left">
          © {new Date().getFullYear()} {siteConfig.brand.name} Agency. All rights reserved.
        </span>
        <div className="flex gap-6 font-normal">
          <span className="cursor-pointer transition-colors duration-300 hover:text-white">Privacy Policy</span>
          <span className="cursor-pointer transition-colors duration-300 hover:text-white">Terms</span>
        </div>
      </div>
    </footer>
  );
};
