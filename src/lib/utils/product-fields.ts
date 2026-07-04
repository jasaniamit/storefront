import type { CustomField } from "@spree/sdk";

/**
 * Keys managed by the dedicated storefront sections below. Kept in one place
 * so ProductCustomFields.tsx can exclude them from the generic properties
 * dump and avoid showing the same data twice on the page.
 */
export const MANAGED_CUSTOM_FIELD_KEYS = [
  "notes.top_notes",
  "notes.middle_notes",
  "notes.base_notes",
  "notes.main_notes",
  "oil_concentration.oil_concentration",
  "scent.intensity",
  "ingredients.list",
  "ingredients.badges",
] as const;

export function getCustomField(
  customFields: Array<CustomField> | undefined,
  key: string,
): CustomField | undefined {
  return customFields?.find((field) => field.key === key);
}

/**
 * Strips HTML tags from a Rich Text metafield value so it can be used as
 * plain text (e.g. split by commas, or shown as a bare number/percentage).
 * The source is admin-authored content from the Spree CMS (trusted).
 */
export function stripHtml(value: string | undefined | null): string {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Splits a plain comma-separated list into trimmed, non-empty items.
 */
export function splitList(value: string | undefined | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Converts a note or badge name into the slug used for its shared icon
 * file, e.g. "Sea Notes" -> "sea-notes" -> /icons/notes/sea-notes.webp
 */
export function slugify(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}
