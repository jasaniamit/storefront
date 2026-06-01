import { Metadata } from "next";
import { notFound } from "next/navigation";
import { STORES_DATA } from "../stores"; // Absolute local alignment import
import StoreLocatorClientPage from "../StoreLocatorClientPage"; // One-level-up relative layout import

interface StorePageProps {
    params: Promise<{
        slug: string;
        country: string;
        locale: string;
    }>;
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
    const { slug } = await params;
    const store = STORES_DATA.find((s) => s.slug === slug);

    if (!store) return {};

    return {
        title: `${store.name} - Official Showroom in ${store.city}`,
        description: `Visit our premium ${store.type} at ${store.address}. Experience our luxury architectural hardware and collections live.`,
        openGraph: {
            title: `${store.name} | ${store.city}`,
            description: `Find local contact details, layout routing maps, and view directions for our showroom center.`,
            type: "website",
        },
    };
}

export async function generateStaticParams() {
    return STORES_DATA.map((store) => ({
        slug: store.slug,
    }));
}

export default async function StoreDetailPage({ params }: StorePageProps) {
    const { slug } = await params;
    const store = STORES_DATA.find((s) => s.slug === slug);

    if (!store) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": store.type.includes("Tile") ? "HomeGoodsStore" : "HardwareStore",
        "name": store.name,
        "description": `Official presentation center located in ${store.city}.`,
        "telephone": store.phone,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": store.address,
            "addressLocality": store.city,
            "addressRegion": "Telangana",
            "addressCountry": "IN",
        },
        "url": `https://yourwebsite.com/locate-stores/${store.slug}`,
        "hasMap": store.googleMapsLink,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <StoreLocatorClientPage initialSelectedStore={store} />
        </>
    );
}