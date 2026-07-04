"use client";

import { useState } from "react";
import { slugify, splitList } from "@/lib/utils/product-fields";

interface ProductNotesImageGridProps {
  mainNotes: string | undefined;
}

function NoteIcon({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);
  const src = `/icons/notes/${slugify(name)}.webp`;

  return (
    <div className="flex flex-col items-center gap-1.5 w-20">
      {failed ? (
        <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
          <span className="text-xl font-medium text-gray-400">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={name}
          width={80}
          height={80}
          className="w-20 h-20 rounded-xl object-cover border border-gray-200"
          onError={() => setFailed(true)}
        />
      )}
      <span className="text-xs text-center text-gray-500 leading-tight">
        {name}
      </span>
    </div>
  );
}

export function ProductNotesImageGrid({
  mainNotes,
}: ProductNotesImageGridProps) {
  const notes = splitList(mainNotes);

  if (notes.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="text-xs font-medium tracking-wide text-gray-500 mb-2.5">
        Notes
      </p>
      <div className="flex flex-wrap gap-4">
        {notes.map((note) => (
          <NoteIcon key={note} name={note} />
        ))}
      </div>
    </div>
  );
}
