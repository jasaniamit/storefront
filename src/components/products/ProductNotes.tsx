"use client";

import type { CustomField } from "@spree/sdk";
import Image from "next/image";

interface ProductNotesProps {
  customFields?: Array<CustomField>;
}

interface NoteItem {
  name: string;
  image?: string;
}

/**
 * ProductNotes
 * -----------
 * Reads from a custom field named "notes" on the Spree product.
 *
 * In Spree Admin → Product → Custom Fields, create a field:
 *   - Name: "notes"
 *   - Type: JSON
 *   - Value (example):
 *     [
 *       { "name": "Pear", "image": "https://cdn.../pear.jpg" },
 *       { "name": "Lavender", "image": "https://cdn.../lavender.jpg" }
 *     ]
 *
 * If no image is provided for a note, a text-only tile is shown.
 * The component is fully dynamic — each product can have different notes.
 */
export function ProductNotes({ customFields }: ProductNotesProps) {
  if (!customFields || customFields.length === 0) return null;

  // Find the "notes" custom field (case-insensitive)
  const notesField = customFields.find(
    (f) => f.name?.toLowerCase() === "notes",
  );
  if (!notesField) return null;

  // Parse JSON value — supports both string and object
  let notes: NoteItem[] = [];
  try {
    const raw =
      typeof notesField.value === "string"
        ? JSON.parse(notesField.value)
        : notesField.value;
    if (Array.isArray(raw)) {
      notes = raw.filter((n) => n && typeof n.name === "string");
    }
  } catch {
    return null;
  }

  if (notes.length === 0) return null;

  return (
    <div className="mt-8 border-t pt-6">
      <p
        style={{
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#888",
          marginBottom: "12px",
        }}
      >
        NOTES
      </p>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {notes.map((note, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {/* Note image tile */}
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "10px",
                overflow: "hidden",
                backgroundColor: "#f3f3f3",
                position: "relative",
                flexShrink: 0,
              }}
            >
              {note.image ? (
                <Image
                  src={note.image}
                  alt={note.name}
                  fill
                  sizes="70px"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                // Fallback: first letter of note name
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    color: "#aaa",
                    fontWeight: 500,
                  }}
                >
                  {note.name.charAt(0)}
                </div>
              )}
            </div>
            {/* Note label */}
            <span
              style={{
                fontSize: "11px",
                color: "#555",
                textAlign: "center",
                maxWidth: "70px",
                lineHeight: 1.3,
              }}
            >
              {note.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
