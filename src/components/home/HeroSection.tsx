import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  basePath: string;
  locale: string;
}

const BRAND = "#546470";

export function HeroSection({ basePath }: HeroSectionProps) {
  return (
    <>
      <style>{`
        .noz-hero { background: #fff; width: 100%; }

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
        }

        /* ✅ EXACT TEXT FIX */
        .noz-hero-text h1 {
          font-family: var(--font-inter), Inter, sans-serif;
          font-size: 30px;
          font-weight: 400;
          line-height: 1.2;
          color: ${BRAND};
          margin: 0 0 12px 0;
        }

        .noz-hero-text h1 strong {
          font-weight: 700;
        }

        .noz-hero-text p {
          font-family: var(--font-inter), Inter, sans-serif;
          font-size: 30px;
          line-height: 1.2;
          color: ${BRAND};
          margin: 0 0 22px 0;
        }

        /* ✅ BUTTON FIX */
        .noz-hero-btn {
          display: inline-block !important;
          background-color: #000000 !important;
          color: #ffffff !important;
          font-family: var(--font-inter), Inter, sans-serif !important;
          font-size: 14px !important;
          padding: 12px 20px !important;
          border-radius: 6px !important;
          text-decoration: none !important;
          border: none !important;
        }

        .noz-hero-btn:hover { opacity: 0.85 !important; }

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
          .noz-hero-inner { padding: 0 80px; }
          .noz-hero-img { max-width: 650px !important; }
        }
      `}</style>

      <section className="noz-hero">
        <div className="noz-hero-inner">

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
