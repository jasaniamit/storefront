import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { POLICY_LINKS } from "@/lib/constants/policies";
import { getStoreDescription, getStoreName } from "@/lib/store";

export default async function Footer() {
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

        {/* Shop */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">
            {t("shop")}
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products">{t("all_products")}</Link></li>
            <li><Link href="/categories">{t("categories")}</Link></li>
            <li><Link href="/brands">{t("brands")}</Link></li>
            <li><Link href="/collections">{t("collections")}</Link></li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">
            {t("account")}
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/account">{t("my_account")}</Link></li>
            <li><Link href="/account/orders">{t("order_history")}</Link></li>
            <li><Link href="/cart">{t("cart")}</Link></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">
            {t("policies")}
          </h4>
          <ul className="space-y-2 text-sm">
            {POLICY_LINKS.map((policy) => (
              <li key={policy.href}>
                <Link href={policy.href}>{policy.label}</Link>
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
