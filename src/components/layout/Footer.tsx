import type { Category } from "@spree/sdk";
import Link from "next/link";
import { POLICY_LINKS } from "@/lib/constants/policies";

interface FooterProps {
  rootCategories: Category[];
  basePath: string;
  locale: string;
}

export function Footer({
  rootCategories,
  basePath,
}: FooterProps) {
  return (
    <footer className="bg-[#0F0F0F] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h3 className="text-lg font-semibold text-white">
            Noz Fragrances
          </h3>

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
              <Link href={`${basePath}/account`}>
                My Account
              </Link>
            </li>
            <li>
              <Link href={`${basePath}/account/orders`}>
                Order History
              </Link>
            </li>
            <li>
              <Link href={`${basePath}/cart`}>
                Cart
              </Link>
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

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
          © 2017-{new Date().getFullYear()} NOZ Fragrances. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
