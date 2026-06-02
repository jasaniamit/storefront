// src/app/[country]/[locale]/(storefront)/locate-stores/StoreLocatorClientPage.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, MapPin, Map, Signpost, ChevronDown, ArrowRight, Phone, ChevronLeft, MessageCircle } from "lucide-react";
import { STORES_DATA, Store, ITEMS_PER_PAGE } from "./stores";

interface StoreLocatorClientPageProps {
    initialSelectedStore?: Store;
}

// Local projection type decoration to clean up template computations
interface ComputedStore extends Store {
    distance: string;
    distanceValue: number;
}

function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius radius metric constants
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function formatDistanceValue(kmValue: number): string {
    return `${kmValue.toFixed(1).replace(".", ",")} KM`;
}

export default function StoreLocatorClientPage({ initialSelectedStore }: StoreLocatorClientPageProps) {
    const [searchLocation, setSearchLocation] = useState("");
    const [selectedStore, setSelectedStore] = useState<Store>(initialSelectedStore || STORES_DATA[0]);
    const [maxDistance, setMaxDistance] = useState<string>("all");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

    // Dynamic Client-side Geolocation Prompt Evaluation
    useEffect(() => {
        if (typeof window !== "undefined" && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserCoords({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.warn("Location services access omitted by browser parameters:", error.message);
                },
                { enableHighAccuracy: true, timeout: 12000 }
            );
        }
    }, []);

    useEffect(() => {
        if (initialSelectedStore) {
            setSelectedStore(initialSelectedStore);
            const storeIndex = STORES_DATA.findIndex((s) => s.id === initialSelectedStore.id);
            if (storeIndex !== -1) {
                const targetPage = Math.floor(storeIndex / ITEMS_PER_PAGE) + 1;
                setCurrentPage(targetPage);
            }
        }
    }, [initialSelectedStore]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchLocation, maxDistance]);

    // Live Geodesic Computations & Search Pipeline
    const filteredStores = useMemo<ComputedStore[]>(() => {
        return STORES_DATA.map((store) => {
            if (!userCoords) {
                return {
                    ...store,
                    distanceValue: Infinity,
                    distance: "— KM",
                };
            }

            const computedDistance = getHaversineDistance(
                userCoords.lat,
                userCoords.lng,
                store.latitude,
                store.longitude
            );

            return {
                ...store,
                distanceValue: computedDistance,
                distance: formatDistanceValue(computedDistance),
            };
        })
            .filter((store) => {
                const matchesSearch =
                    store.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
                    store.address.toLowerCase().includes(searchLocation.toLowerCase()) ||
                    store.type.toLowerCase().includes(searchLocation.toLowerCase());

                const numericMax = maxDistance === "all" ? Infinity : parseFloat(maxDistance);
                const matchesDistance = !userCoords || store.distanceValue <= numericMax;

                return matchesSearch && matchesDistance;
            });
    }, [searchLocation, maxDistance, userCoords]);

    const totalPages = Math.ceil(filteredStores.length / ITEMS_PER_PAGE);
    const paginatedStores = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredStores.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredStores, currentPage]);

    // Track state to preserve coordinates properties inside map views card overlays
    const activeStoreDetails = useMemo(() => {
        if (!selectedStore) return null;
        return filteredStores.find((s) => s.id === selectedStore.id) || {
            ...selectedStore,
            distanceValue: Infinity,
            distance: "— KM"
        };
    }, [filteredStores, selectedStore]);

    useEffect(() => {
        const isVisibleInPagination = paginatedStores.some((s) => s.id === selectedStore?.id);
        const isStillInFilteredPool = filteredStores.some((s) => s.id === selectedStore?.id);

        if (!isVisibleInPagination && !isStillInFilteredPool && paginatedStores.length > 0) {
            setSelectedStore(paginatedStores[0]);
        }
    }, [paginatedStores, filteredStores, selectedStore]);

    const handleNativeMapRedirect = (link: string, e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(link, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="min-h-screen bg-[#fafafa] py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
            <div className="w-full max-w-7xl mx-auto bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col">

                {/* Top Operational Bar */}
                <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
                    <div className="max-w-xl">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Find us</h1>
                        <p className="text-s text-gray-400 mt-1 leading-normal">
                            Find our official stores to experience our luxurious products near you
                        </p>
                    </div>

                    {/* Clean Pill Search Bar */}
                    <div className="w-full sm:w-auto bg-[#f4f4f6] rounded-full p-1 pr-1.5 pl-5 flex items-center justify-between gap-2 border border-gray-100 shrink-0 relative self-center sm:self-auto">
                        <input
                            type="text"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            className="bg-transparent text-xs font-semibold text-gray-700 outline-none placeholder-gray-400 w-full min-w-[140px] sm:w-48 py-2"
                            placeholder="Enter location..."
                        />

                        <div className="h-4 w-[1px] bg-gray-300 mx-1 shrink-0" />

                        {/* Range Configuration Menu */}
                        <div className="relative">
                            <button
                                disabled={!userCoords}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`flex items-center gap-0.5 text-[11px] font-bold tracking-wider uppercase bg-transparent px-1 transition-opacity whitespace-nowrap py-2 ${!userCoords ? "text-gray-400 cursor-not-allowed" : "text-gray-800 hover:opacity-80"}`}
                            >
                                <span>{!userCoords ? "No Location" : maxDistance === "all" ? "Distance" : `< ${maxDistance} KM`}</span>
                                {userCoords && <ChevronDown className={`w-3 h-3 text-gray-600 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />}
                            </button>

                            {/* Float Options Dropdown Context Overlay */}
                            {isDropdownOpen && userCoords && (
                                <>
                                    <div className="fixed inset-0 z-20" onClick={() => setIsDropdownOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-30 text-left animate-in fade-in slide-in-from-top-1 duration-100">
                                        {[
                                            { label: "All Distances", value: "all" },
                                            { label: "Within 5 KM", value: "5" },
                                            { label: "Within 30 KM", value: "30" },
                                            { label: "Within 100 KM", value: "100" },
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => {
                                                    setMaxDistance(opt.value);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full px-4 py-2 text-xs font-semibold block transition-colors text-left ${maxDistance === opt.value
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="bg-[#1c1c1e] text-white p-2 rounded-full shrink-0 shadow-xs flex items-center justify-center">
                            <Search className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </div>

                {/* Workspace Display Separation Viewports */}
                <div className="flex flex-col lg:grid lg:grid-cols-12 lg:h-[620px] overflow-hidden">

                    {/* MAP CANVAS PANEL */}
                    <div className="w-full h-[360px] sm:h-[450px] lg:h-full lg:col-span-7 relative bg-gray-100 overflow-hidden shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100">
                        <div className="absolute inset-0 z-0 overflow-hidden">
                            <iframe
                                title="Active Store Geolocation Viewport"
                                src={activeStoreDetails?.mapEmbedUrl || `https://maps.google.com/maps?q=Navrang%20Tile%20Studio%20Karimnagar&t=&z=15&ie=UTF8&iwloc=near&output=embed`}
                                className="absolute w-[calc(100%+380px)] h-[calc(100%+200px)] -left-[340px] -top-[100px] border-0"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        {/* Float Label Map Overlay Card Block */}
                        {activeStoreDetails && (
                            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10 w-[calc(100%-32px)] sm:w-fit sm:max-w-sm drop-shadow-md">
                                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                                    <span className="inline-flex items-center justify-center bg-gray-900 text-white font-bold tracking-wider text-[9px] uppercase px-2.5 h-5 rounded-full mb-1.5 leading-none pt-[1px]">
                                        {activeStoreDetails.type}
                                    </span>
                                    <h3 className="text-base font-bold text-gray-900 tracking-tight leading-tight">
                                        {activeStoreDetails.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 font-medium mt-1 leading-normal max-w-xs">
                                        {activeStoreDetails.address}
                                    </p>
                                    <div className="flex items-center justify-between border-t border-gray-100 mt-3 pt-3">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                                            <MapPin className="w-3.5 h-3.5 text-gray-900" strokeWidth={2.5} />
                                            <span>{activeStoreDetails.distance} Away</span>
                                        </div>
                                        <button
                                            onClick={(e) => handleNativeMapRedirect(activeStoreDetails.googleMapsLink, e)}
                                            className="flex items-center gap-1 bg-[#1c1c1e] hover:bg-black text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all"
                                        >
                                            <span>Open in Maps</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SIDE CARDS PANELS LIST */}
                    <div className="flex-1 lg:col-span-5 flex flex-col h-auto lg:h-full bg-white p-4 sm:p-6 overflow-hidden">
                        <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-1"
                        >
                            {paginatedStores.length > 0 ? (
                                paginatedStores.map((store) => {
                                    const isSelected = selectedStore?.id === store.id;
                                    const cleanPhoneForWhatsApp = store.phone.replace(/[^0-9]/g, "");

                                    return (
                                        <div
                                            key={store.id}
                                            onClick={() => setSelectedStore(store)}
                                            className={`w-full p-4 sm:p-5 rounded-2xl flex flex-col gap-4 transition-all duration-200 border-2 select-none cursor-pointer ${isSelected
                                                ? "bg-[#f4f4f6] border-gray-900/10 shadow-xs"
                                                : "bg-[#f4f4f6] border-transparent hover:bg-[#eaeaea]/60"
                                                }`}
                                        >
                                            <div className="space-y-1.5 flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-tight truncate">
                                                        {store.name}
                                                    </h3>
                                                    <span className="inline-flex items-center justify-center bg-gray-200 text-gray-800 font-extrabold tracking-wider text-[8px] uppercase px-2 py-0.5 rounded-md leading-none">
                                                        {store.type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold tracking-wide uppercase">
                                                    <MapPin className="w-3.5 h-3.5 text-gray-800 shrink-0" strokeWidth={2.5} />
                                                    <span className="truncate max-w-[220px] md:max-w-xs">
                                                        {store.displayAddress}
                                                    </span>
                                                </div>

                                                <a
                                                    href={`tel:${store.phone}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="hidden sm:inline-flex items-center gap-1.5 mt-1 bg-white hover:bg-gray-200 px-2.5 py-1 rounded-lg border border-gray-200 text-[11px] font-bold text-gray-800 transition-colors shadow-2xs"
                                                >
                                                    <Phone className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                                                    <span>Call: {store.phone}</span>
                                                </a>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-6 shrink-0 text-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-200/60 w-full sm:w-auto">
                                                <a
                                                    href={`tel:${store.phone}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex sm:hidden flex-col items-center justify-center gap-1.5 group outline-none min-w-[54px] flex-1 sm:flex-none"
                                                    title="Call Showroom"
                                                >
                                                    <div className="w-5 h-5 flex items-center justify-center">
                                                        <Phone className="w-[18px] h-[18px] text-gray-900 active:text-emerald-600 transition-colors" strokeWidth={2.2} />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-500 tracking-tight whitespace-nowrap">Call</span>
                                                </a>

                                                <a
                                                    href={`https://wa.me/${cleanPhoneForWhatsApp}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex sm:hidden flex-col items-center justify-center gap-1.5 group outline-none min-w-[54px] flex-1 sm:flex-none"
                                                    title="Chat via WhatsApp"
                                                >
                                                    <div className="w-5 h-5 flex items-center justify-center">
                                                        <MessageCircle className="w-5 h-5 text-gray-900 active:text-emerald-500 transition-colors" strokeWidth={2.2} />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-500 tracking-tight whitespace-nowrap">WhatsApp</span>
                                                </a>

                                                <button
                                                    onClick={(e) => handleNativeMapRedirect(store.googleMapsLink, e)}
                                                    className="flex flex-col items-center justify-center gap-1 group outline-none min-w-[54px] flex-1 sm:flex-none"
                                                    title="Open Map Coordinates"
                                                >
                                                    <div className="w-5 h-5 flex items-center justify-center">
                                                        <Map className="w-[18px] h-[18px] text-gray-900 group-hover:text-blue-600 transition-colors" strokeWidth={2} />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-500 tracking-tight whitespace-nowrap">
                                                        {store.distance}
                                                    </span>
                                                </button>

                                                <button
                                                    onClick={(e) => handleNativeMapRedirect(store.googleMapsLink, e)}
                                                    className="flex flex-col items-center justify-center gap-1 group outline-none min-w-[54px] flex-1 sm:flex-none"
                                                    title="View Indications"
                                                >
                                                    <div className="w-5 h-5 flex items-center justify-center">
                                                        <Signpost className="w-[18px] h-[18px] text-gray-900 group-hover:text-blue-600 transition-colors" strokeWidth={2} />
                                                    </div>
                                                    <span className="text-[9px] font-extrabold text-gray-500 tracking-wider uppercase block">
                                                        Indications
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center text-gray-400 text-sm">
                                    No showrooms match your location search filters.
                                </div>
                            )}
                        </div>

                        {/* Pagination Controls Footer Segment */}
                        {totalPages > 1 && (
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between shrink-0 bg-white">
                                <span className="text-xs font-semibold text-gray-500">
                                    Page <span className="text-gray-900">{currentPage}</span> of {totalPages}
                                </span>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center"
                                        title="Previous Page"
                                    >
                                        <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
                                    </button>

                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center rotate-180"
                                        title="Next Page"
                                    >
                                        <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
