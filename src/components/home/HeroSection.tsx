import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  basePath: string;
  locale: string;
}

export async function HeroSection({ basePath }: HeroSectionProps) {
  return (
    <>
      <style>{`
        .noz-hero { background: #F5F5F4; width: 100%; }

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
        }

        .noz-hero-text {
          order: 2;
          padding: 32px 20px 48px;
          max-width: 536px;
        }

        /* ✅ HEADING FIX */
        .noz-hero-text h1 {
          font-family: var(--font-inter), Inter, sans-serif;
          font-size: 30px;
          font-weight: 400;
          line-height: 1.3;
          color: #1a1a1a;
          margin: 0 0 16px 0;
        }

        .noz-hero-text h1 strong {
          font-weight: 500;
        }

        /* ✅ PARAGRAPH FIX */
        .noz-hero-text p {
          font-family: var(--font-inter), Inter, sans-serif;
          font-size: 14px;
          color: #4a4a4a;
          line-height: 1.6;
          margin: 0 0 24px 0;
        }

        /* ✅ BUTTON FIX */
        .noz-hero-btn {
          display: inline-block;
          background: #000000;
          color: #ffffff;
          font-family: var(--font-inter), Inter, sans-serif;
          font-size: 14px;
          font-weight: 500;
          padding: 12px 20px;
          border-radius: 6px;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .noz-hero-btn:hover {
          opacity: 0.85;
        }

        /* DESKTOP */
        @media (min-width: 768px) {
          .noz-hero-inner {
            flex-direction: row;
            align-items: center;
            min-height: 520px;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 64px;
          }

          .noz-hero-text {
            order: 1;
            flex: 0 0 40%;
            padding: 0;
          }

          .noz-hero-image-wrap {
            order: 2;
            flex: 0 0 60%;
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
          }

          .noz-hero-img {
            max-width: 600px !important;
          }
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
