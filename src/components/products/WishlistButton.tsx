"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  addToWishlist,
  getWishlistStatus,
  removeFromWishlist,
} from "@/lib/data/wishlist";

interface WishlistButtonProps {
  variantId: string | number;
  basePath: string;
  currentPath: string;
}

export function WishlistButton({
  variantId,
  basePath,
  currentPath,
}: WishlistButtonProps) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [wishlistToken, setWishlistToken] = useState<string | null>(null);
  const [wishedItemId, setWishedItemId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;
    let cancelled = false;
    getWishlistStatus(String(variantId)).then((status) => {
      if (cancelled || !status) return;
      setIsSaved(status.isSaved);
      setWishlistToken(status.wishlistToken);
      setWishedItemId(status.wishedItemId);
    });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, authLoading, variantId]);

  const handleClick = async () => {
    if (authLoading || busy) return;

    // Guests are prompted to log in before saving anything.
    if (!isAuthenticated) {
      const returnTo = encodeURIComponent(currentPath);
      router.push(`${basePath}/account?redirect=${returnTo}`);
      return;
    }

    setBusy(true);
    try {
      if (isSaved && wishlistToken && wishedItemId) {
        const ok = await removeFromWishlist(wishlistToken, wishedItemId);
        if (ok) {
          setIsSaved(false);
          setWishedItemId(null);
        }
      } else if (wishlistToken) {
        const ok = await addToWishlist(wishlistToken, String(variantId));
        if (ok) {
          // Re-fetch to get the new wished_item id for future removal.
          const status = await getWishlistStatus(String(variantId));
          if (status) {
            setIsSaved(status.isSaved);
            setWishedItemId(status.wishedItemId);
          }
        }
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isSaved}
      className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center shadow-sm hover:bg-white transition-colors disabled:opacity-60"
    >
      <Heart
        className="w-[18px] h-[18px]"
        strokeWidth={2}
        fill={isSaved ? "#F07867" : "none"}
        color={isSaved ? "#F07867" : "#1a1a1a"}
      />
    </button>
  );
}
