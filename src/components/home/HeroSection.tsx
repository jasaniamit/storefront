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

        /* ── Mobile: image top, text below ── */
        .noz-hero-inner {
          display: flex;
          flex-direction: column;
        }

        .noz-hero-image-wrap {
          order: 1;
          width: 100%;
          line-height: 0;
        }
        .noz-hero-image-wrap img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
        }

        .noz-hero-text {
          order: 2;
          padding: 28px 24px 44px;
        }
        .noz-hero-text h1 {
          font-family: var(--font-inter), Inter, sans-serif;
          font-size: 1.6rem;
          font-weight: 400;
          line-height: 1.2;
          color: ${BRAND};
          margin: 0 0 14px 0;
        }
        .noz-hero-text h1 strong {
          font-weight: 700;
          color: ${BRAND};
        }
        .noz-hero-text p {
          font-family: var(--font-inter), Inter, sans-serif;
          font-size: 13px;
          color: ${BRAND};
          line-height: 1.75;
          margin: 0 0 26px 0;
        }
        .noz-hero-btn {
          display: inline-block;
          background-color: ${BRAND};
          color: #ffffff !important;
          font-family: var(--font-inter), Inter, sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 13px 28px;
          border-radius: 6px;
          text-decoration: none !important;
          transition: opacity 0.2s;
        }
        .noz-hero-btn:hover { opacity: 0.82; }

        /* ── Desktop: text LEFT, image RIGHT ── */
        @media (min-width: 768px) {
          .noz-hero-inner {
            flex-direction: row;
            align-items: center;
            min-height: 520px;
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 64px;
          }
          .noz-hero-text {
            order: 1;
            flex: 0 0 38%;
            padding: 60px 40px 60px 0;
          }
          .noz-hero-text h1 {
            /* Force clean single-line break: "The Perfume House for the NEXT GENERATION" */
            font-size: clamp(1.35rem, 2.2vw, 2.1rem);
            margin-bottom: 16px;
          }
          .noz-hero-text p { font-size: 13.5px; margin-bottom: 32px; }
          .noz-hero-image-wrap {
            order: 2;
            flex: 0 0 62%;
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            align-self: flex-end;
          }
          .noz-hero-image-wrap img { max-width: 580px; }
        }

        @media (min-width: 1200px) {
          .noz-hero-inner { padding: 0 80px; }
          .noz-hero-image-wrap img { max-width: 660px; }
        }
      `}</style>

      <section className="noz-hero">
        <div className="noz-hero-inner">

          {/* TEXT — left desktop / below mobile */}
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

          {/* IMAGE — right desktop / top mobile */}
          <div className="noz-hero-image-wrap">
            <Image
              src="/hero-image.webp"
              alt="NOZ Fragrances - Premium Perfume"
              width={700}
              height={700}
              priority
            />
          </div>

        </div>
      </section>
    </>
  );
}
