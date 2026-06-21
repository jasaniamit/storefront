// src/components/home/BrandHighlightsSection.tsx
import Image from "next/image";
import {
    Sparkles,
    Droplet,
    FlaskConical,
    Plane,
    Gift,
} from "lucide-react";

export function BrandHighlightsSection() {
    return (
        <section className="w-full bg-white font-sans antialiased text-slate-600">

            {/* BLOCK 1: 4-COLUMN FEATURE STRIP */}
            <div className="border-b border-gray-100 bg-white py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-4 px-2">
                        <div className="w-8 h-8 relative shrink-0">
                            <Image src="/images/home/icons/features/ifra-compliance.svg" alt="IFRA Compliance" fill className="object-contain" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 tracking-tight">IFRA Compliance</h4>
                            <p className="text-[13px] text-gray-400 font-medium mt-0.5">Compliant with IFRA&apos;s 50th Amendment</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 px-2">
                        <div className="w-8 h-8 relative shrink-0">
                            <Image src="/images/home/icons/features/cruelty-free.svg" alt="Cruelty Free" fill className="object-contain" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 tracking-tight">Cruelty Free</h4>
                            <p className="text-[13px] text-gray-400 font-medium mt-0.5">No animal testing, ever</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 px-2">
                        <div className="w-8 h-8 relative shrink-0">
                            <Image src="/images/home/icons/features/grain-ethanol.svg" alt="Grain Ethanol" fill className="object-contain" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 tracking-tight">Grain Ethanol</h4>
                            <p className="text-[13px] text-gray-400 font-medium mt-0.5">Sourced from grain ethanol across India</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 px-2">
                        <div className="w-8 h-8 relative shrink-0">
                            <Image src="/images/home/icons/features/globe.svg" alt="Globally Sourced" fill className="object-contain" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 tracking-tight">Globally Sourced</h4>
                            <p className="text-[13px] text-gray-400 font-medium mt-0.5">Premium ingredients procured worldwide</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 space-y-24 sm:space-y-36">

                {/* BLOCK 2: BEYOND IMAGINATION SPLIT SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start w-full">
                            <Sparkles className="w-9 h-9 text-gray-900" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                            Beyond Imagination
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
                            A fragrance that turns every moment into a lasting memory — elegant, timeless, and unmistakably you.
                        </p>
                    </div>
                    <div className="lg:col-span-7 flex justify-center lg:justify-end w-full">
                        <div className="w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] relative rounded-3xl overflow-hidden border border-gray-100 shadow-2xs bg-gray-50">
                            <Image
                                src="/images/home/beyond-imagination.webp"
                                alt="Noz Fragrances lifestyle shot"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    </div>
                </div>

                {/* BLOCK 3: OUR COLLECTIONS GRID */}
                <div className="space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-2.5">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                            Our Collections
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed">
                            Explore our range crafted for every mood and occasion, from everyday essentials to statement scents.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        <div className="bg-[#f8fafc]/60 border border-slate-100 p-8 rounded-2xl flex flex-col items-center text-center space-y-4 transition-all duration-200 hover:bg-white hover:shadow-xs">
                            <Droplet className="w-10 h-10 text-gray-900" strokeWidth={1.5} />
                            <div className="space-y-1">
                                <h4 className="text-lg font-bold text-gray-900 tracking-tight">Eau de Parfum</h4>
                                <p className="text-[14px] text-gray-400 font-medium leading-relaxed">Long-lasting, rich concentration for all-day wear</p>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc]/60 border border-slate-100 p-8 rounded-2xl flex flex-col items-center text-center space-y-4 transition-all duration-200 hover:bg-white hover:shadow-xs">
                            <FlaskConical className="w-10 h-10 text-gray-900" strokeWidth={1.5} />
                            <div className="space-y-1">
                                <h4 className="text-lg font-bold text-gray-900 tracking-tight">Attar Oils</h4>
                                <p className="text-[14px] text-gray-400 font-medium leading-relaxed">Pure, alcohol-free oils rooted in tradition</p>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc]/60 border border-slate-100 p-8 rounded-2xl flex flex-col items-center text-center space-y-4 transition-all duration-200 hover:bg-white hover:shadow-xs">
                            <Plane className="w-10 h-10 text-gray-900" strokeWidth={1.5} />
                            <div className="space-y-1">
                                <h4 className="text-lg font-bold text-gray-900 tracking-tight">Travel Minis (2ml)</h4>
                                <p className="text-[14px] text-gray-400 font-medium leading-relaxed">Try before you commit, perfect for on the go</p>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc]/60 border border-slate-100 p-8 rounded-2xl flex flex-col items-center text-center space-y-4 transition-all duration-200 hover:bg-white hover:shadow-xs">
                            <Gift className="w-10 h-10 text-gray-900" strokeWidth={1.5} />
                            <div className="space-y-1">
                                <h4 className="text-lg font-bold text-gray-900 tracking-tight">Gift Sets</h4>
                                <p className="text-[14px] text-gray-400 font-medium leading-relaxed">Curated bundles for every special occasion</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BLOCK 4: CRAFTSMANSHIP SPLIT SEGMENT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4">
                    <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center lg:justify-start w-full">
                        <div className="w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] relative rounded-3xl overflow-hidden border border-gray-100 shadow-2xs bg-gray-50">
                            <Image
                                src="/images/home/craftsmanship.webp"
                                alt="Noz Fragrances craftsmanship"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-6 space-y-5 text-center lg:text-left order-1 lg:order-2 lg:pl-10">
                        <div className="flex items-center justify-center lg:justify-start w-full">
                            <FlaskConical className="w-9 h-9 text-gray-900" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                            Craftsmanship
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Every Noz fragrance is blended by skilled perfumers using premium concentrated oils sourced internationally, then tested for consistency and lasting performance before it reaches you.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
