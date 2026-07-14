import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

interface HeroSectionProps {
  basePath: string;
  locale: string;
}

const BRAND = "#53665d";
const ACCENT = "#F07867"; // logo colour, used for the button

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
});

// Local custom display font, already uploaded to public/fonts
const nextGenerationFont = localFont({
  src: "../../../public/fonts/next-generation-font.otf",
  variable: "--font-next-generation",
  display: "swap",
});

export function HeroSection({ basePath }: HeroSectionProps) {
  return (
    <>
      <style>{`
        .noz-hero {
          background: #fff;
          width: 100%;
        }

        .noz-hero-inner {
          display: flex;
          flex-direction: column;
        }

        .noz-hero-image-wrap {
          order: 1;
          width: 100%;
        }

        .noz-hero-img {
          width: 100% !important;
          height: auto !important;
          display: block !important;
          object-fit: contain !important;
          max-width: 100% !important;
        }

        .noz-hero-text {
          order: 2;
          padding: 24px 20px 40px;
          max-width: 536px;
        }

        /* ✅ HEADING — label line */
        .noz-hero-text h1 {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 24px;
          font-weight: 400;
          line-height: 1.3;
          letter-spacing: -0.01em;
          color: ${BRAND};
          margin: 0 0 4px 0;
        }

        /* ✅ HEADING — display words (custom font) */
        .noz-hero-text h1 strong {
          display: block;
          font-family: var(--font-next-generation), serif;
          font-weight: 700;
          font-size: 48px;
          line-height: 1.1;
          color: ${BRAND};
        }

        @media (min-width: 768px) {
          .noz-hero-text h1 {
            font-size: 24px;
          }
          .noz-hero-text h1 strong {
            font-size: 56px;
          }
        }

        /* ✅ PARAGRAPH */
        .noz-hero-text p {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.7;
          color: ${BRAND};
          margin: 24px 0 28px 0;
        }

        /* ✅ BUTTON */
        .noz-hero-btn {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;

          background-color: ${ACCENT} !important;
          color: #ffffff !important;

          font-family: var(--font-inter), system-ui, sans-serif !important;
          font-size: 16px !important;
          font-weight: 500 !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;

          height: 54px !important;
          padding: 0 28px !important;

          border-radius: 9999px !important;

          text-decoration: none !important;
          border: none !important;

          transition: opacity 0.2s ease !important;
        }

        .noz-hero-btn:hover {
          opacity: 0.88 !important;
        }

        /* DESKTOP */
        @media (min-width: 768px) {
          .noz-hero-inner {
            flex-direction: row;
            align-items: center;
            min-height: 500px;
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 64px;
          }

          .noz-hero-text {
            order: 1;
            flex: 0 0 38%;
            padding: 56px 36px 56px 0;
          }

          .noz-hero-image-wrap {
            order: 2;
            flex: 0 0 62%;
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
          }

          .noz-hero-img {
            max-width: 560px !important;
          }
        }

        @media (min-width: 1200px) {
          .noz-hero-inner {
            padding: 0 80px;
          }

          .noz-hero-img {
            max-width: 650px !important;
          }
        }
      `}</style>

      <section className={`noz-hero ${inter.variable} ${nextGenerationFont.variable}`}>
        <div className="noz-hero-inner">

          {/* TEXT */}
          <div className="noz-hero-text">
            <h1>
              Perfume house for the
              <strong>
                next
                <br />
                generation
              </strong>
            </h1>

            <p>
              Premium-Quality fragrances.
              <br />
              No excessive markups. Crafted with heart,
              <br />
              Proud to be Indian Brand.
            </p>

            <Link href={`${basePath}/products`} className="noz-hero-btn">
              SHOP ALL
            </Link>
          </div>

          {/* IMAGE */}
          <div className="noz-hero-image-wrap">
            <Image
              src="/hero-image.webp"
              alt="NOZ Fragrances - Premium Perfume"
              width={700}
              height={700}
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, 650px"
              className="noz-hero-img"
            />
          </div>

        </div>
      </section>
    </>
  );
}
