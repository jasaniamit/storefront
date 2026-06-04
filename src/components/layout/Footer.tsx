// src/components/layout/Footer.tsx
import type { Category } from "@spree/sdk";
import Link from "next/link";
import {
  Facebook, Instagram, MessageCircle, Send, Twitter,
  AtSign, Smartphone, HeartHandshake, BadgeCheck, Sprout, Headset
} from "lucide-react";
import { getStoreName } from "@/lib/store";

interface FooterProps {
  rootCategories: Category[];
  basePath: string;
  locale: string;
}

export async function Footer({
  basePath,
}: FooterProps) {
  const storeName = getStoreName() || "Artolika.Inc";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full font-sans antialiased">

      {/* --- UPPER SEGMENT: TRUST BADGES --- */}
      <div className="w-full bg-white border-t border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {/* Prop 1 */}
            <div className="flex items-start gap-4 text-left">
              <HeartHandshake size={32} className="text-black shrink-0 mt-0.5" strokeWidth={1.8} />
              <div>
                <h4 className="text-slate-900 font-bold text-base tracking-tight">Empowering Creators</h4>
                <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
                  Every acquisition directly supports independent artists.
                </p>
              </div>
            </div>

            {/* Prop 2 */}
            <div className="flex items-start gap-4 text-left">
              <BadgeCheck size={32} className="text-black shrink-0 mt-0.5" strokeWidth={1.8} />
              <div>
                <h4 className="text-slate-900 font-bold text-base tracking-tight">Certified Original</h4>
                <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
                  Copyrighted masterworks with guaranteed provenance.
                </p>
              </div>
            </div>

            {/* Prop 3 */}
            <div className="flex items-start gap-4 text-left">
              <Sprout size={32} className="text-black shrink-0 mt-0.5" strokeWidth={1.8} />
              <div>
                <h4 className="text-slate-900 font-bold text-base tracking-tight">Sustainable Luxury</h4>
                <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
                  Eco-conscious craftsmanship using premium materials.
                </p>
              </div>
            </div>

            {/* Prop 4 */}
            <div className="flex items-start gap-4 text-left">
              <Headset size={32} className="text-black shrink-0 mt-0.5" strokeWidth={1.8} />
              <div>
                <h4 className="text-slate-900 font-bold text-base tracking-tight">24/7 Support</h4>
                <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
                  Expert guidance from custom design to delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- LOWER SEGMENT: MINIMALIST SINGLE-ROW FOOTER CONTENT --- */}
      <div className="w-full bg-[#f8fafc] border-t border-gray-200/50 text-slate-500 text-[13px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">

          {/* LEFT SECTION: POLICIES GRID MATRIX */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full md:w-auto text-center md:text-left justify-items-center md:justify-items-start order-1">
            <Link href={`${basePath}/contact`} className="hover:text-slate-900 transition-colors font-medium">
              Contact Us
            </Link>
            <Link href={`${basePath}/policies/privacy-policy`} className="hover:text-slate-900 transition-colors font-medium">
              Privacy Policy
            </Link>
            <Link href={`${basePath}/policies/terms-and-conditions`} className="hover:text-slate-900 transition-colors font-medium">
              Terms & Conditions
            </Link>
            <Link href={`${basePath}/policies/cookie-policy`} className="hover:text-slate-900 transition-colors font-medium">
              Cookies
            </Link>
          </div>

          {/* CENTER SECTION: COPYRIGHT METADATA LOG */}
          <div className="w-full md:w-auto text-center font-medium text-slate-500 order-3 md:order-2">
            <p>
              Copyright © {currentYear} <span className="text-slate-900 font-bold">{storeName}</span> - Since 2014
            </p>
          </div>

          {/* RIGHT SECTION: BRAND SOCIAL PLATFORMS */}
          <div className="flex items-center justify-center gap-5 text-slate-700 w-full md:w-auto order-2 md:order-3">
            <a href="https://www.facebook.com/artolika.inc/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors" title="Facebook">
              <Facebook className="w-4 h-4" strokeWidth={2.2} />
            </a>
            <a href="https://www.instagram.com/artolika.inc/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors" title="Instagram">
              <Instagram className="w-4 h-4" strokeWidth={2.2} />
            </a>
            <a href="https://wa.me/919390735447" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors" title="WhatsApp">
              <MessageCircle className="w-4 h-4" strokeWidth={2.2} />
            </a>
            <a href="https://t.me/artolikainc" target="_blank" rel="noopener noreferrer" className="hover:text-sky-500 transition-colors" title="Telegram">
              <Send className="w-4 h-4" strokeWidth={2.2} />
            </a>
            <a href="https://www.x.com/artolikainc/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" title="X (Twitter)">
              <Twitter className="w-4 h-4" strokeWidth={2.2} />
            </a>
            <a href="https://www.threads.net/@artolika.inc" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 transition-colors" title="Threads">
              <AtSign className="w-4 h-4" strokeWidth={2.2} />
            </a>
            <a href="tel:919390735447" className="hover:text-slate-900 transition-colors" title="Call Us">
              <Smartphone className="w-4 h-4" strokeWidth={2.2} />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
