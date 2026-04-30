import type { Category } from "@spree/sdk";
import Link from "next/link";
import { POLICY_LINKS } from "@/lib/constants/policies";

interface FooterProps {
  rootCategories: Category[];
  basePath: string;
  locale: string;
}

export function Footer({ rootCategories, basePath }: FooterProps) {
  return (
    <footer className="bg-[#0F0F0F] text-gray-300">

      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">

        {/* Brand */}
        <div>
          {/* 🔥 Animated Logo */}
          <img
            src="/icons/noz_full_animated.svg"
            alt="Noz Fragrances"
            className="h-10 w-auto"
          />

          <p className="mt-4 text-sm text-gray-400 leading-relaxed whitespace-pre-line">
            The Perfume House for the NEXT GENERATION
            {"\n"}Premium-Quality fragrances.
            {"\n"}No excessive markups. Crafted with heart,
            {"\n"}Proud to be Indian Brand.
          </p>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">
            Categories
          </h4>
          <ul className="space-y-2 text-sm">
            {rootCategories.slice(0, 5).map((cat) => (
              <li key={cat.id}>
                <Link href={`${basePath}/c/${cat.permalink}`}>
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">
            Account
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href={`${basePath}/account`}>My Account</Link>
            </li>
            <li>
              <Link href={`${basePath}/account/orders`}>Order History</Link>
            </li>
            <li>
              <Link href={`${basePath}/cart`}>Cart</Link>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">
            Policies
          </h4>
          <ul className="space-y-2 text-sm">
            {POLICY_LINKS.map((policy) => (
              <li key={policy.slug}>
                <Link href={`${basePath}/${policy.slug}`}>
                  {policy.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">
            Follow Us
          </h4>

          <div className="flex space-x-4">

            <a href="https://www.instagram.com/noz.fragrances" target="_blank" rel="noopener noreferrer">
              <img src="/icons/instagram.svg" className="h-5 w-5 opacity-70 hover:opacity-100 invert brightness-0" />
            </a>

            <a href="https://www.facebook.com/nozfragrances" target="_blank" rel="noopener noreferrer">
              <img src="/icons/facebook.svg" className="h-5 w-5 opacity-70 hover:opacity-100 invert brightness-0" />
            </a>

            <a href="https://www.youtube.com/nozfragrances" target="_blank" rel="noopener noreferrer">
              <img src="/icons/youtube.svg" className="h-5 w-5 opacity-70 hover:opacity-100 invert brightness-0" />
            </a>

            <a href="https://wa.me/919499521425" target="_blank" rel="noopener noreferrer">
              <img src="/icons/whatsapp.svg" className="h-5 w-5 opacity-70 hover:opacity-100 invert brightness-0" />
            </a>

          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Payment Icons */}
          <div className="flex items-center space-x-4 opacity-80">
            <img src="/icons/visa.svg" className="h-6" />
            <img src="/icons/mastercard.svg" className="h-6" />
            <img src="/icons/rupay.svg" className="h-6" />
            <img src="/icons/upi.svg" className="h-6" />
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500 text-center">
            © 2017-{new Date().getFullYear()} NOZ Fragrances. All rights reserved.
          </div>

        </div>
      </div>

    </footer>
  );
}
