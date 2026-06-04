// src/components/home/HeroSection.tsx
import Image from "next/image";

interface HeroSectionProps {
  basePath: string;
  locale: string;
}

export async function HeroSection({ locale }: HeroSectionProps) {
  return (
    <section
      data-locale={locale}
      className="w-full bg-white font-sans antialiased text-slate-600 selection:bg-gray-900 selection:text-white"
    >

      {/* BLOCK 1: MASTER HERO BANNER WITH THEMED OVERLAY (CENTER-BOTTOM TEXT ALIGNMENT) */}
      <div className="relative w-full h-[65vh] min-h-[440px] sm:h-[75vh] flex items-end justify-center px-4 pb-12 sm:pb-16 md:pb-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/home/hero-main-bg.webp"
            alt="Artolika Master of Infinite Artistry Glass Installation Showcase"
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
          {/* Exact CSS styling injected to perfectly mirror your WordPress aesthetic filter */}
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{
              opacity: 0.90,
              background: "linear-gradient(10deg, rgb(2, 40, 78) 0%, rgba(33, 83, 135, 0.13) 100%)",
              mixBlendMode: "normal"
            }}
          />
        </div>

        {/* Adjusted to force absolute centering across mobile/desktop at the bottom barrier */}
        <div className="relative z-10 w-full max-w-4xl mx-auto space-y-3.5 text-center flex flex-col items-center justify-center">
          <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-white tracking-tight leading-tight max-w-2xl drop-shadow-sm">
            Master of Infinite Artistry
          </h1>
          <p className="text-xs sm:text-base lg:text-lg text-gray-200/90 font-medium max-w-2xl leading-relaxed tracking-wide">
            Feel the remarkable artistry & experience the splendour of modern design
          </p>
        </div>
      </div>

      {/* BLOCK 2: 4-COLUMN PREMIUM FEATURE ACCENTS ROW (DYNAMIC SVGs) */}
      <div className="border-b border-gray-100 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6 text-center sm:text-left">
          {/* Feature 1 */}
          <div className="flex flex-col sm:flex-row items-center gap-4 px-2">
            <div className="w-8 h-8 relative shrink-0">
              <Image src="/images/home/icons/features/first-time.svg" alt="First time in India Icon" fill className="object-contain" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 tracking-tight">1st time in India</h4>
              <p className="text-[13px] text-gray-400 font-medium mt-0.5">Lucide glass technology</p>
            </div>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col sm:flex-row items-center gap-4 px-2">
            <div className="w-8 h-8 relative shrink-0">
              <Image src="/images/home/icons/features/multi-layered.svg" alt="Multi Layered Icon" fill className="object-contain" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 tracking-tight">Multi Layered</h4>
              <p className="text-[13px] text-gray-400 font-medium mt-0.5">Deeply treated UV prints</p>
            </div>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col sm:flex-row items-center gap-4 px-2">
            <div className="w-8 h-8 relative shrink-0">
              <Image src="/images/home/icons/features/high-quality.svg" alt="High Quality Print Icon" fill className="object-contain" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 tracking-tight">High Quality Print</h4>
              <p className="text-[13px] text-gray-400 font-medium mt-0.5">Original resolution images</p>
            </div>
          </div>
          {/* Feature 4 */}
          <div className="flex flex-col sm:flex-row items-center gap-4 px-2">
            <div className="w-8 h-8 relative shrink-0">
              <Image src="/images/home/icons/features/long-lasting.svg" alt="Long Lasting Print Icon" fill className="object-contain" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 tracking-tight">Long Lasting Print</h4>
              <p className="text-[13px] text-gray-400 font-medium mt-0.5">Lasts longer for years</p>
            </div>
          </div>
        </div>
      </div>

      {/* UNIFIED DESIGN SYSTEMS WRAPPER */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 space-y-24 sm:space-y-36">

        {/* BLOCK 3: BEYOND IMAGINATION SPLIT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start w-full">
              <div className="w-10 h-10 relative">
                <Image src="/images/home/icons/blocks/beyond-imagination.svg" alt="Beyond Imagination Accent Icon" fill className="object-contain" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Beyond Imagination
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
              A product that turns your lifeless space into modern luxury and elegance that are actually futuristic
            </p>
          </div>
          <div className="lg:col-span-7 flex justify-center lg:justify-end w-full">
            <div className="w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] relative rounded-3xl overflow-hidden border border-gray-100 shadow-2xs">
              <Image
                src="/images/home/beyond-imagination.webp"
                alt="Luxury Living Room Architectural Mockup displaying Custom Frame Setup"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* BLOCK 4: MATERIALS CONFIGURATION GRID MATRIX (UN-BOXED ICONS) */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Materials
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed">
              To make your space more comfortable you can choose from ultimate range of materials that make your space likely beautiful
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Material 1 */}
            <div className="bg-[#f8fafc]/60 border border-slate-100 p-8 rounded-2xl flex flex-col items-center text-center space-y-4 transition-all duration-200 hover:bg-white hover:shadow-xs">
              <div className="w-14 h-14 relative flex items-center justify-center text-gray-900">
                <Image src="/images/home/icons/tile.svg" alt="Print on Tile" fill className="object-contain" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-gray-900 tracking-tight">Print on Tile</h4>
                <p className="text-[14px] text-gray-400 font-medium leading-relaxed">High Gloss finish that make your space aesthetic</p>
              </div>
            </div>

            {/* Material 2 */}
            <div className="bg-[#f8fafc]/60 border border-slate-100 p-8 rounded-2xl flex flex-col items-center text-center space-y-4 transition-all duration-200 hover:bg-white hover:shadow-xs">
              <div className="w-14 h-14 relative flex items-center justify-center text-gray-900">
                <Image src="/images/home/icons/glass.svg" alt="Print on Glass" fill className="object-contain" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-gray-900 tracking-tight">Print on Glass</h4>
                <p className="text-[14px] text-gray-400 font-medium leading-relaxed">Intensify the interior and décor of your space</p>
              </div>
            </div>

            {/* Material 3 */}
            <div className="bg-[#f8fafc]/60 border border-slate-100 p-8 rounded-2xl flex flex-col items-center text-center space-y-4 transition-all duration-200 hover:bg-white hover:shadow-xs">
              <div className="w-14 h-14 relative flex items-center justify-center text-gray-900">
                <Image src="/images/home/icons/pvc.svg" alt="Print on PVC" fill className="object-contain" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-gray-900 tracking-tight">Print on PVC</h4>
                <p className="text-[14px] text-gray-400 font-medium leading-relaxed">Delve into the versatility of light weight prints</p>
              </div>
            </div>

            {/* Material 4 */}
            <div className="bg-[#f8fafc]/60 border border-slate-100 p-8 rounded-2xl flex flex-col items-center text-center space-y-4 transition-all duration-200 hover:bg-white hover:shadow-xs">
              <div className="w-14 h-14 relative flex items-center justify-center text-gray-900">
                <Image src="/images/home/icons/more.svg" alt="And More" fill className="object-contain" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-gray-900 tracking-tight">And More</h4>
                <p className="text-[14px] text-gray-400 font-medium leading-relaxed">Give your space the class and exuberance</p>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCK 5: TECHNOLOGY SPLIT SEGMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4">
          <div className="lg:col-span-6 space-y-4 text-center lg:text-left order-2 lg:order-1 flex justify-center lg:justify-start w-full">
            <div className="w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] relative rounded-3xl overflow-hidden border border-gray-100 shadow-2xs">
              <Image
                src="/images/home/technology-display.webp"
                alt="Vibrant Colorful Structural Installation in Architectural Lounge Room"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left order-1 lg:order-2 lg:pl-10">
            <div className="flex items-center justify-center lg:justify-start w-full">
              <div className="w-10 h-10 relative">
                <Image src="/images/home/icons/blocks/technology.svg" alt="Technology Production Accent Icon" fill className="object-contain" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Technology
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              To achieve outstanding print quality our skilled graphic design and production team use robust industrial printer equipped with new Ricoh MH - Piezo Electric technology from Japan and all our products are printed using high quality inks from Belgium
            </p>
          </div>
        </div>

        {/* BLOCK 6: OUR BRAND PORTFOLIO PRESENTATION (FIXED ASSET MAPPINGS) */}
        <div className="border-t border-gray-100 pt-16 space-y-8 w-full">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Our Brands
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed">
              Our achievements turned into modern brands exhibiting excellence, originality and finesse.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 py-6 max-w-5xl mx-auto h-12">
            {[1, 2, 3, 4].map((num) => (
              <div key={`brand-token-${num}`} className="h-full w-auto aspect-video relative grayscale opacity-45 hover:opacity-100 transition-all duration-200 flex items-center justify-center shrink-0">
                <Image
                  src={`/images/about/logos/logo${num}.svg`}
                  alt={`Official Subbrand Framework logo${num} Identifier`}
                  width={0}
                  height={42}
                  className="h-full w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
