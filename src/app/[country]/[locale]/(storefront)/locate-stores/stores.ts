// src/app/[country]/[locale]/(storefront)/locate-stores/stores.ts

export interface Store {
    id: string;
    slug: string;
    name: string;
    address: string;
    displayAddress: string;
    phone: string;
    type: string;
    latitude: number;
    longitude: number;
    mapEmbedUrl: string;
    googleMapsLink: string;
    city: string;
}

export const STORES_DATA: Store[] = [
    {
        id: "navrang-tile-studio",
        slug: "navrang-tile-studio-karimnagar",
        name: "Navrang Tile Studio",
        address: "2-232/3/A, Jagtiyal Road, Sitarampur, Karimnagar 505001",
        displayAddress: "2-232/3/A, JAGTIYAL ROAD, SITARAMPUR • KARIMNAGAR",
        phone: "+91 7331135447",
        type: "Official Display",
        latitude: 18.4482,
        longitude: 79.1174,
        mapEmbedUrl: `https://maps.google.com/maps?q=Navrang%20Tile%20Studio%20Karimnagar&t=&z=15&ie=UTF8&iwloc=near&output=embed`,
        googleMapsLink: "https://goo.gl/maps/B5evXvguF9TRqRCe6",
        city: "Karimnagar",
    },
    {
        id: "nagendra-hardware",
        slug: "nagendra-hardware-glass-mart-karimnagar",
        name: "Nagendra Hardware & Glass Mart",
        address: "Christian Colony Rd, Christian Colony, Karimnagar, Telangana 505001",
        displayAddress: "CHRISTIAN COLONY RD, CHRISTIAN COLONY • KARIMNAGAR",
        phone: "+91 8555040672",
        type: "Glass Printing",
        latitude: 18.4312,
        longitude: 79.1305,
        mapEmbedUrl: `https://maps.google.com/maps?q=Nagendra%20Hardware%20Glass%20Karimnagar&t=&z=15&ie=UTF8&iwloc=near&output=embed`,
        googleMapsLink: "https://goo.gl/maps/K2ZpxaYQTUnnvhe79",
        city: "Karimnagar",
    },
    {
        id: "sri-umiya-doors",
        slug: "sri-umiya-doors-sultanabad",
        name: "Sri Umiya Doors & Hardware",
        address: "Poosala Rd, Swapna Colony, Sultanabad, Telangana 505185",
        displayAddress: "POOSALA RD, SWAPNA COLONY • SULTANABAD",
        phone: "+91 9177484600",
        type: "WPC Printing",
        latitude: 18.5255,
        longitude: 79.3214,
        mapEmbedUrl: `https://maps.google.com/maps?q=Sri%20Umiya%20Doors%20Hardware%20Sultanabad&t=&z=15&ie=UTF8&iwloc=near&output=embed`,
        googleMapsLink: "https://maps.app.goo.gl/y4pCgxAc7YYtbVnC8",
        city: "Sultanabad",
    },
    {
        id: "bajrang-tiles",
        name: "Bajrang Tiles",
        slug: "bajrang-tiles-hanamkonda-warangal",
        address: "23-6-253/A/8, New Shayampet, Hanamkonda, Warangal – 506001, Near JSM High School",
        displayAddress: "23-6-253/A/8, NEW SHAYAMPET • HANAMKONDA",
        phone: "+91 9951728280",
        type: "Vitrified Printing",
        latitude: 18.0118,
        longitude: 79.5542,
        mapEmbedUrl: `https://maps.google.com/maps?q=Bajrang%20Tiles%20Hanamkonda&t=&z=15&ie=UTF8&iwloc=near&output=embed`,
        googleMapsLink: "https://goo.gl/maps/rLim6bhLwnTC4kjAA",
        city: "Warangal",
    },
];

export const ITEMS_PER_PAGE = 6;