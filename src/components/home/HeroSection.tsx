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
        /* ── Hero wrapper ── */
        .noz-hero {
          background-color: #ffffff;
          width: 100%;
        }

        .noz-hero-inner {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        /* ── TEXT block ── */
        .noz-hero-text {
          order: 2;          /* on mobile: text BELOW image */
          padding: 28px 24px 44px;
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
          margin: 0 0 26px 0;
        }

        .noz-hero-btn {
          display: inline-block;
          background-color: #1a1a1a;
          color: #ffffff !important;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 13px 28px;
          text-decoration: none !important;
          transition: background-color 0.2s;
        }
        .noz-hero-btn:hover {
          background-color: #333333;
        }

        /* ── IMAGE block ── */
        .noz-hero-image-wrap {
          order: 1;          /* on mobile: image ON TOP */
          width: 100%;
        }
        .noz-hero-image-wrap img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
        }

        /* ── DESKTOP: side by side ── */
        @media (min-width: 768px) {
          .noz-hero-inner {
            flex-direction: row;
            align-items: center;
            min-height: 500px;
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 48px;
          }

          /* text on LEFT */
          .noz-hero-text {
            order: 1;
            flex: 0 0 40%;
            padding: 60px 40px 60px 0;
          }

          .noz-hero-text h1 {
            font-size: clamp(1.6rem, 2.5vw, 2.3rem);
            margin-bottom: 16px;
          }

          .noz-hero-text p {
            font-size: 13.5px;
            margin-bottom: 32px;
          }

          /* image on RIGHT */
          .noz-hero-image-wrap {
            order: 2;
            flex: 0 0 60%;
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            align-self: flex-end;
          }

          .noz-hero-image-wrap img {
            max-width: 580px;
          }
        }

        @media (min-width: 1200px) {
          .noz-hero-inner {
            padding: 0 80px;
          }
          .noz-hero-text {
            flex: 0 0 36%;
          }
          .noz-hero-image-wrap {
            flex: 0 0 64%;
          }
          .noz-hero-image-wrap img {
            max-width: 660px;
          }
        }
      `}</style>

      <section className="noz-hero">
        <div className="noz-hero-inner">

          {/* TEXT — left on desktop, below on mobile (via CSS order) */}
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

          {/* IMAGE — right on desktop, top on mobile (via CSS order) */}
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
