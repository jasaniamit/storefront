import { Heart } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import { Button } from "@/components/ui/button";
import { WishlistList } from "@/components/account/WishlistList";
import { listWishlistItems } from "@/lib/data/wishlist";

interface WishlistPageProps {
  params: Promise<{ country: string; locale: string }>;
}

export default async function WishlistPage({ params }: WishlistPageProps) {
  await connection();
  const { country, locale } = await params;
  const basePath = `/${country}/${locale}`;

  const items = await listWishlistItems();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Wishlist</h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-500 mb-6">
            Tap the heart icon on any product to save it here.
          </p>
          <Button asChild>
            <Link href={`${basePath}/products`}>Start shopping</Link>
          </Button>
        </div>
      ) : (
        <WishlistList items={items} basePath={basePath} />
      )}
    </div>
  );
}
