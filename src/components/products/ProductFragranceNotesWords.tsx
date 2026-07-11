"use client";

interface ProductFragranceNotesWordsProps {
  topNotes: string | undefined;
  middleNotes: string | undefined;
  baseNotes: string | undefined;
}

const ROWS = [
  {
    key: "top",
    label: "Top",
    caption: "the first notes you smell",
    icon: "/icons/top.svg",
  },
  {
    key: "middle",
    label: "Middle",
    caption: "the heart of the perfume",
    icon: "/icons/middle.svg",
  },
  {
    key: "base",
    label: "Base",
    caption: "the notes that linger all day",
    icon: "/icons/base.svg",
  },
] as const;

export function ProductFragranceNotesWords({
  topNotes,
  middleNotes,
  baseNotes,
}: ProductFragranceNotesWordsProps) {
  const values: Record<(typeof ROWS)[number]["key"], string | undefined> = {
    top: topNotes,
    middle: middleNotes,
    base: baseNotes,
  };

  const hasAny = topNotes || middleNotes || baseNotes;
  if (!hasAny) return null;

  return (
    <div className="mt-10 border-t pt-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Fragrance notes
      </h2>
      <div className="space-y-3">
        {ROWS.map((row) => {
          const value = values[row.key];
          if (!value) return null;
          return (
            <div key={row.key} className="flex gap-3">
              <FlaskConical className="w-[18px] h-[18px] text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{row.label}</span>,{" "}
                  {row.caption}
                </p>
                <p
                  className="text-sm text-gray-500"
                  dangerouslySetInnerHTML={{ __html: value }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
