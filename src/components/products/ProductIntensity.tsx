"use client";

import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProductIntensityProps {
  intensity: string | undefined;
}

const LEVELS = [
  {
    label: "Subtle",
    filled: 1,
    description:
      "Delicate, close-to-skin scents you notice up close, not across a room.",
  },
  {
    label: "Moderate",
    filled: 2,
    description:
      "A noticeable presence that lasts through the day without overwhelming a room.",
  },
  {
    label: "Intense",
    filled: 3,
    description:
      "Bold, long-lasting fragrances that make a statement with every spritz.",
  },
] as const;

function Dots({ filled }: { filled: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full inline-block"
          style={{
            backgroundColor: i < filled ? "#F07867" : "#E5E7EB",
          }}
        />
      ))}
    </span>
  );
}

export function ProductIntensity({ intensity }: ProductIntensityProps) {
  const level = LEVELS.find(
    (l) => l.label.toLowerCase() === intensity?.trim().toLowerCase(),
  );

  if (!level) return null;

  return (
    <div className="mt-4">
      <p className="text-xs font-medium tracking-wide text-gray-500 mb-1.5">
        Intensity
      </p>
      <div className="flex items-center gap-2">
        <Dots filled={level.filled} />
        <span className="text-sm font-medium text-gray-900">
          {level.label}
        </span>
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label="What does scent intensity mean"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-medium">
                What is the scent intensity scale?
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-500 -mt-2 mb-1">
              It ranks how strong a fragrance feels and how long it lasts on
              skin, based on how it was created, not on the oil percentage
              alone.
            </p>
            <div className="space-y-2.5">
              {LEVELS.map((l) => (
                <div
                  key={l.label}
                  className="bg-gray-50 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Dots filled={l.filled} />
                    <span className="text-sm font-medium text-gray-900">
                      {l.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-snug">
                    {l.description}
                  </p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
