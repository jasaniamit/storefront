// src/app/[country]/[locale]/(storefront)/about/AboutClientPage.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { ArrowRight, History, Compass, Eye } from "lucide-react";

interface AboutClientPageProps {
    initialStoryImages?: string[];
    initialGalleryImages?: string[];
    initialLogoImages?: string[];
}

export default function AboutClientPage({
    initialStoryImages = [],
    initialGalleryImages = [],
    initialLogoImages = []
}: AboutClientPageProps) {
    const storyImages = initialStoryImages.length > 0 ? initialStoryImages : ["/images/about/story/story1.webp", "/images/about/story/story2.webp"];
    const galleryImages = initialGalleryImages.length > 0 ? initialGalleryImages : ["/images/about/gallery-buddha.webp", "/images/about/gallery-saraswati.webp", "/images/about/gallery-modern.webp"];
    const logoImages = initialLogoImages;

    const [activeStorySlide, setActiveStorySlide] = useState(0);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [itemsToShow, setItemsToShow] = useState(3);

    const infiniteGalleryItems = useMemo(() => {
        if (galleryImages.length === 0) return [];
        return [...galleryImages, ...galleryImages, ...galleryImages];
    }, [galleryImages]);

    useEffect(() => {
        setIsMounted(true);
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setItemsToShow(1);
            } else if (window.innerWidth < 1024) {
                setItemsToShow(2);
            } else {
                setItemsToShow(3);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const storyInterval = setInterval(() => {
            setActiveStorySlide((prev) => (prev === storyImages.length - 1 ? 0 : prev + 1));
        }, 5000);

        const galleryInterval = setInterval(() => {
            setGalleryIndex((prev) => {
                const nextIndex = prev + 1;
                if (nextIndex >= galleryImages.length) {
                    return 0;
                }
                return nextIndex;
            });
        }, 4000);

        return () => {
            clearInterval(storyInterval);
            clearInterval(galleryInterval);
        };
    }, [storyImages.length, galleryImages.length]);

    return (
        <div className="min-h-screen bg-white pb-16 sm:pb-24 font-sans antialiased selection:bg-gray-900 selection:text-white">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes infiniteMarquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-infiniteMarquee {
                    animation: infiniteMarquee 28s linear infinite;
                }
                .BrandEdgeMask {
                    mask-image: linear-gradient(to right, transparent, white 12%, white 88%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, white 12%, white 88%, transparent);
                }
            `}} />

            {/* SECTION 1: HERO DISPLAY BANNER */}
            <div className="relative w-full h-[55vh] min-h-[380px] sm:h-[65vh] flex items-center justify-start px-6 sm:px-12 lg:px-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/about/hero-bg.webp"
                        alt="Artolika Workshop Production Background"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div
                        className="absolute inset-0 transition-all duration-300"
                        style={{
                            opacity: 1,
                            background: "linear-gradient(52deg, rgb(6, 46, 77) 0%, rgb(201, 201, 201) 100%)",
                            mixBlendMode: "multiply"
                        }}
                    />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto">
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-tight max-w-2xl drop-shadow-sm">
                        From Garage to a <br />Leading Print Brand
                    </h1>
                </div>
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 space-y-24 sm:space-y-36">

                {/* SECTION 2: BRAND STORY BLOCK (SINCE 2014) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    <div className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200/60 px-3 py-1 rounded-full text-xs font-bold text-gray-800 w-fit">
                            <History className="w-3.5 h-3.5 text-gray-900" />
                            <span>OUR LEGACY</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-gray-400 uppercase block">
                                OUR BRAND STORY
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
                                Since 2014
                            </h2>
                        </div>
                        <div className="space-y-4 text-sm sm:text-base text-gray-500 font-medium leading-relaxed">
                            <p>
                                Since the first steps were taken in the year 2014, <strong className="text-gray-900 font-bold">Artolika</strong> has carved its niche as a consistently growing organisation with unparalleled innovation and passion rooted in simplicity.
                            </p>
                            <p>
                                We endure gratification for every experience that we offer, created to share something truly meaningful. It may not resonate with the majority, but that is what takes us a class apart. If only a handful were to understand the purpose of our existence, we would be proud to have found our believers. Rather, people with whom we can share our beliefs.
                            </p>
                        </div>
                        <div className="pt-2">
                            <a
                                href="#core-values"
                                className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-gray-900 uppercase hover:opacity-70 transition-opacity"
                            >
                                <span>Explore Core Pillars</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <div className="w-full aspect-[4/3] bg-gray-100 rounded-3xl border border-gray-200/80 shadow-xs relative overflow-hidden group">
                            {storyImages.map((src, idx) => (
                                <div
                                    key={src}
                                    className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
                                    style={{ opacity: activeStorySlide === idx ? 1 : 0, zIndex: activeStorySlide === idx ? 10 : 0 }}
                                >
                                    <Image
                                        src={src}
                                        alt={`Brand Story Legacy Frame ${idx + 1}`}
                                        fill
                                        sizes="(max-w-7xl) 50vw, 100vw"
                                        className="object-cover"
                                        priority={idx === 0}
                                        unoptimized
                                    />
                                </div>
                            ))}

                            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-2.5 py-1.5 rounded-full border border-white/40">
                                {storyImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveStorySlide(idx)}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${activeStorySlide === idx ? "w-4 bg-gray-900" : "w-1.5 bg-gray-400"}`}
                                        title={`Go to slide ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 3: EXCLUSIVELY ENDORSED FOR VALUES */}
                <div id="core-values" className="space-y-14">
                    <div className="text-center">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 tracking-wide">
                            We're Exclusively Endorsed For
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                        {["quality", "flexibility", "durability", "efficiency"].map((val) => (
                            <div key={val} className="flex flex-col items-center text-center space-y-4 group px-2">
                                <div className="w-14 h-14 relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                                    <Image src={`/images/about/icons/${val}.svg`} alt={`${val} Icon`} fill className="object-contain" unoptimized />
                                </div>
                                <div className="space-y-1.5 capitalize">
                                    <h4 className="text-base font-bold text-gray-900 tracking-tight">{val}</h4>
                                    <p className="text-xs text-gray-400 font-medium leading-relaxed normal-case">
                                        {val === "quality" && "We own consumers trust for over more than 8+ years maintaining seamless quality & output in print & media"}
                                        {val === "flexibility" && "From Tile to Glass we can print over more than 10+ items that can be useful in every architectural medium"}
                                        {val === "durability" && "All integral resources & ink's are 100% environment friendly & resistant to maximum known elements"}
                                        {val === "efficiency" && "With the state of technology, machinery and art, we reproduce maximum efficiency on our products"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SECTION 4: A LOVE FOR QUALITY SPLIT BLOCK */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start pt-4">
                    <div className="md:col-span-5">
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                            A Love for Quality
                        </h3>
                    </div>
                    <div className="md:col-span-7">
                        <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed">
                            At Artolika, Quality has always been a mission and profession. It has all started with an accusation and took miles of years to improve output and reach to a stage where immersive results and quality took its place.
                        </p>
                    </div>
                </div>

                {/* SECTION 5: INFINITE LOOPS GALLERY CAROUSEL TRACK */}
                <div className="space-y-6">
                    <div className="w-full relative overflow-hidden">
                        <div
                            className="flex -mx-2 sm:-mx-3 transition-transform duration-700 ease-in-out"
                            style={{
                                transform: isMounted ? `translateX(-${galleryIndex * (100 / itemsToShow)}%)` : "none"
                            }}
                        >
                            {infiniteGalleryItems.map((imgSrc, imgIdx) => (
                                <div
                                    key={`gallery-infinite-slide-${imgIdx}`}
                                    className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-2 sm:px-3 aspect-[4/3] sm:aspect-[3/4] lg:aspect-[4/3] relative rounded-xl overflow-hidden group"
                                >
                                    <div className="w-full h-full relative rounded-xl overflow-hidden border border-gray-100 shadow-2xs">
                                        <Image
                                            src={imgSrc}
                                            alt="Bespoke Luxury Setup Frame Showcase Asset"
                                            fill
                                            sizes="(max-w-7xl) 33vw, 100vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-102"
                                            unoptimized
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 pt-2">
                        {galleryImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setGalleryIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${galleryIndex % galleryImages.length === idx ? "bg-gray-800 scale-110 shadow-2xs" : "bg-gray-300 hover:bg-gray-400"}`}
                                title={`Maps to package frame asset index ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* SECTION 6: MISSION & VISION STRATUM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 pt-6">
                    <div className="flex gap-4 items-start">
                        <div className="p-2 bg-gray-50 rounded-xl border border-gray-100/80 shrink-0 text-gray-800">
                            <Compass className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-lg font-bold text-gray-900 tracking-tight">Our Mission</h4>
                            <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed">
                                We define our core purpose by striving as socially responsible partner for delivering the most affordable & valuable living by facilitating vast range of eco-friendly and highly sustainable products as well as innovative solutions developed by using deep customer insights to enrich customer with the sense of beyond satisfaction.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="p-2 bg-gray-50 rounded-xl border border-gray-100/80 shrink-0 text-gray-800">
                            <Eye className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-lg font-bold text-gray-900 tracking-tight">Our Vision</h4>
                            <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed">
                                To aspire the world with high living by providing complete aesthetic poster solution at fair & sensible price and availing it within reach of masses. At artolika, We ensure idyllic quality which defines our commitment towards ethical equitable & high business virtues.
                            </p>
                        </div>
                    </div>
                </div>

                {/* SECTION 7: DYNAMIC HEIGHT-ALIGNED LOGOS MARQUEE LOOP */}
                {logoImages.length > 0 && (
                    <div className="border-t border-gray-100 pt-14 space-y-6 overflow-hidden w-full">
                        <div className="text-center">
                            <span className="text-[12px] font-bold tracking-widest text-gray-400 pb-6 uppercase block">
                                Our achievements turned into modern brands exhibiting excellence, originality and finesse.
                            </span>
                        </div>

                        <div className="relative w-full overflow-hidden flex items-center BrandEdgeMask">
                            <div className="flex gap-16 items-center shrink-0 animate-infiniteMarquee min-w-full justify-around h-12">
                                {logoImages.map((src, idx) => (
                                    <div key={`logo-marq-a-${idx}`} className="h-full w-auto aspect-video relative grayscale opacity-35 hover:opacity-80 transition-all duration-300 flex items-center justify-center shrink-0">
                                        <Image
                                            src={src}
                                            alt="Artolika Enterprise Subbrand Logo Identifier"
                                            width={0}
                                            height={48}
                                            className="h-full w-auto object-contain"
                                            unoptimized
                                        />
                                    </div>
                                ))}
                            </div>
                            <div aria-hidden="true" className="flex gap-16 items-center shrink-0 animate-infiniteMarquee min-w-full justify-around h-12">
                                {logoImages.map((src, idx) => (
                                    <div key={`logo-marq-b-${idx}`} className="h-full w-auto aspect-video relative grayscale opacity-35 hover:opacity-80 transition-all duration-300 flex items-center justify-center shrink-0">
                                        <Image
                                            src={src}
                                            alt="Artolika Enterprise Subbrand Logo Clone"
                                            width={0}
                                            height={48}
                                            className="h-full w-auto object-contain"
                                            unoptimized
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
