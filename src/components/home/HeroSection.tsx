import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  basePath: string;
  locale: string;
}

const BRAND = "#546470";

export async function HeroSection({ basePath }: HeroSectionProps) {
  return (
    <>
      <style>{`
        .noz-hero { background: #fff; width: 100%; }

        /* ── MOBILE: column layout, image on top ── */
        .noz-hero-inner {
          display: flex;
          flex-direction: column;
        }

        /* Image wrap — order 1 = top on mobile */
        .noz-hero-image-wrap {
          order: 1;
          width: 100%;
        }
        /* Target Next.js generated img directly via className */
        .noz-hero-img {
          width: 100% !important;
          height: auto !important;
          display: block !important;
          object-fit: contain !important;
          max-width: 100% !important;
        }

        /* Text — order 2 = below image on mobile */
        .noz-hero-text {
          order: 2;
          padding: 24px 20px 40px;
        }

        .noz-hero-text h1 {
          font-family: var(--font-inter), Inter, sans-serif;
          font-size: 1.45rem;
          font-weight: 400;
          line-height: 1.22;
          color: ${BRAND};
          margin: 0 0 12px 0;
        }
        .noz-hero-text h1 strong {
          font-weight: 700;
          color: ${BRAND};
          display: inline;
        }
        .noz-hero-text p {
          font-family: var(--font-inter), Inter, sans-serif;
          font-size: 12.5px;
          color: ${BRAND};
          line-height: 1.75;
          margin: 0 0 22px 0;
        }

        /* Button — #546470 bg, white text, slight radius */
        .noz-hero-btn {
          display: inline-block !important;
          background-color: ${BRAND} !important;
          color: #ffffff !important;
          font-family: var(--font-inter), Inter, sans-serif !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          letter-spacing: 0.12em !important;
          text-transform: uppercase !important;
          padding: 12px 26px !important;
          border-radius: 6px !important;
          text-decoration: none !important;
          transition: opacity 0.2s !important;
          border: none !important;
          outline: none !important;
        }
        .noz-hero-btn:hover { opacity: 0.82 !important; }

        /* ── DESKTOP (768px+): side by side ── */
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
          .noz-hero-text h1 {
            font-size: clamp(1.3rem, 2.0vw, 2.0rem);
            margin-bottom: 14px;
          }
          .noz-hero-text p {
            font-size: 13px;
            margin-bottom: 28px;
          }
          .noz-hero-image-wrap {
            order: 2;
            flex: 0 0 62%;
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            align-self: flex-end;
          }
          .noz-hero-img {
            max-width: 560px !important;
            width: 100% !important;
          }
        }

        @media (min-width: 1200px) {
          .noz-hero-inner { padding: 0 80px; }
          .noz-hero-img { max-width: 650px !important; }
        }
      `}</style>

      <section className="noz-hero">
        <div className="noz-hero-inner">

          {/* TEXT — order 2 mobile (below), order 1 desktop (left) */}
          <div className="noz-hero-text">
            <h1>
              The Perfume House for the <strong>NEXT GENERATION</strong>
            </h1>
            <p>
              Premium-Quality fragrances.<br />
              No excessive markups. Crafted with heart,<br />
              Proud to be Indian Brand.
            </p>
            <Link href={`${basePath}/products`} className="noz-hero-btn">
              Shop All
            </Link>
          </div>

          {/* IMAGE — order 1 mobile (top), order 2 desktop (right) */}
          <div className="noz-hero-image-wrap">
            <Image
              src="/hero-image.webp"
              alt="NOZ Fragrances - Premium Perfume"
              width={700}
              height={700}
              priority
              className="noz-hero-img"
            />
          </div>

        </div>
      </section>
    </>
  );
}
