/**
 * Permalinks of categories that represent a "scent family" grouping used
 * for the Related Products section — as opposed to other categories a
 * product might also belong to (Men, Female, 15ml, 2ml Samples, Brands,
 * New Arrivals, etc.) which are not meaningful for "similar fragrances."
 *
 * Add a new permalink here whenever a new scent-family category is
 * created in Spree Admin (e.g. Woody, Gourmand, Citrus Floral). No other
 * code changes are needed — Related Products will pick it up
 * automatically for any product tagged into it.
 */
export const SCENT_FAMILY_PERMALINKS: readonly string[] = [
  "categories/aqua-fresh",
];

export function isScentFamilyCategory(permalink: string | undefined): boolean {
  if (!permalink) return false;
  return SCENT_FAMILY_PERMALINKS.includes(permalink);
}
