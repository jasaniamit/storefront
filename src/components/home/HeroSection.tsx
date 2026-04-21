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
        .noz-hero {
          background-color: #ffffff;
          width: 100%;
        }

        /* ── MOBILE: image full-width on top, text below ── */
        .noz-hero-inner {
          display: flex;
          flex-direction: column;
        }

        .noz-hero-image-wrap {
          width: 100%;
          position: relative;
          /* Let image breathe — no hard height clamp on mobile */
        }

        .noz-hero-image-wrap img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
        }

        .noz-hero-text {
          padding: 28px 24px 40px;
        }

        .noz-hero-text h1 {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 1.55rem;
          font-weight: 400;
          line-height: 1.2;
          color: #1a1a1a;
          margin: 0 0 14px 0;
        }

        .noz-hero-text h1 strong {
          font-weight: 700;
          display: block;
        }

        .noz-hero-text p {
          font-size: 13px;
          color: #555555;
          line-height: 1.75;
          margin: 0 0 24px 0;
        }

        .noz-hero-btn {
          display: inline-block;
          background-color: #1a1a1a;
          color: #ffffff;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 13px 28px;
          text-decoration: none;
        }

        .noz-hero-btn:hover {
          background-color: #333333;
        }

        /* ── DESKTOP: side-by-side, text left, image right ── */
        @media (min-width: 768px) {
          .noz-hero-inner {
            flex-direction: row;
            align-items: center;
            min-height: 520px;
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 48px;
          }

          .noz-hero-text {
            flex: 0 0 42%;
            padding: 60px 40px 60px 16px;
          }

          .noz-hero-text h1 {
            font-size: clamp(1.7rem, 2.8vw, 2.5rem);
            margin-bottom: 18px;
          }

          .noz-hero-text p {
            font-size: 14px;
            margin-bottom: 32px;
          }

          .noz-hero-image-wrap {
            flex: 0 0 58%;
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            align-self: flex-end;
          }

          .noz-hero-image-wrap img {
            max-width: 600px;
            width: 100%;
          }
        }

        @media (min-width: 1024px) {
          .noz-hero-inner {
            padding: 0 64px;
          }
          .noz-hero-text {
            flex: 0 0 38%;
          }
          .noz-hero-image-wrap {
            flex: 0 0 62%;
          }
        }
      `}</style>

      <section className="noz-hero">
        <div className="noz-hero-inner">

          {/* TEXT — on mobile comes after image (order matters in flex column) */}
          {/* We render image first in DOM to match nozfragrances.com mobile layout */}

          {/* IMAGE */}
          <div className="noz-hero-image-wrap">
            <Image
              src="/hero-image.webp"
              alt="NOZ Fragrances - Premium Perfume"
              width={700}
              height={700}
              priority
            />
          </div>

          {/* TEXT */}
          <div className="noz-hero-text">
            <h1>
              The Perfume House for the{" "}
              <strong>NEXT GENERATION</strong>
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

        </div>
      </section>
    </>
  );
}
