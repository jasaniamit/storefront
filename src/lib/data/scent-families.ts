/**
 * A product's "related products" tags live in a dedicated Taxonomy whose
 * taxons all use the permalink prefix "r/" (e.g. r/aqua-fresh, r/ladies,
 * r/teen, r/partyware, r/date, r/oud, r/office). This is separate from
 * the "Categories" taxonomy (Men, Female, 15ml, Brands, etc.) which is
 * not meaningful for "similar fragrances."
 *
 * A product can belong to several of these at once (e.g. both r/aqua-fresh
 * and r/office) — that's expected, not a mistake. Related Products
 * combines results from every matching tag, not just the first one.
 *
 * Adding a new taxon under this same taxonomy (e.g. r/woody) needs no
 * code change at all — it's picked up automatically by the "r/" prefix.
 */
export function isScentFamilyCategory(permalink: string | undefined): boolean {
  if (!permalink) return false;
  return permalink.startsWith("r/");
}
