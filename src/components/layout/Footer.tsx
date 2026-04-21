import type { Category } from "@spree/sdk";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { POLICY_LINKS } from "@/lib/constants/policies";
import { getStoreDescription, getStoreName } from "@/lib/store";

interface FooterProps {
  rootCategories: Category[];
  basePath: string;
  locale: string;
}

export async function Footer({
  rootCategories,
  basePath,
}: FooterProps) {
  const t = await getTranslations("Footer");

  const storeName = getStoreName();
  const storeDescription = getStoreDescription();

  return (
    <footer className="bg-[#0F0F0F] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Store Info */}
        <div>
          <h3 className="text-lg font-semibold text-white">
            {storeName}
          </h3>

          <p className="mt-4 text-sm text-gray-400 leading-relaxed whitespace-pre-line">
            {storeDescription}
          </p>
        </div>

        {/* Categories (Dynamic from Spree) */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">
            {t("categories")}
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
            {t("account")}
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href={`${basePath}/account`}>
                {t("my_account")}
              </Link>
            </li>
            <li>
              <Link href={`${basePath}/account/orders`}>
                {t("order_history")}
              </Link>
            </li>
            <li>
              <Link href={`${basePath}/cart`}>
                {t("cart")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Policies (FIXED) */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">
            {t("policies")}
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
          © 2017-{new Date().getFullYear()} {storeName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
