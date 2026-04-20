import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  basePath: string;
  locale: string;
}

export async function HeroSection({ basePath }: HeroSectionProps) {
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        minHeight: "480px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "48px 48px 0 64px",
          minHeight: "480px",
        }}
      >
        {/* LEFT — Text content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingRight: "32px",
          }}
        >
          <h1
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              fontWeight: 400,
              lineHeight: 1.25,
              color: "#1a1a1a",
              margin: 0,
              marginBottom: "16px",
            }}
          >
            The Perfume House for the{" "}
            <span style={{ fontWeight: 700, display: "block" }}>
              NEXT GENERATION
            </span>
          </h1>

          <p
            style={{
              fontSize: "13px",
              color: "#555555",
              margin: 0,
              marginBottom: "28px",
              lineHeight: 1.7,
            }}
          >
            Premium-Quality fragrances.
            <br />
            No excessive markups. Crafted with heart,
            <br />
            Proud to be Indian Brand.
          </p>

          <div>
            <Link
              href={`${basePath}/products`}
              style={{
                display: "inline-block",
                backgroundColor: "#1a1a1a",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "12px 28px",
                textDecoration: "none",
              }}
            >
              Shop All
            </Link>
          </div>
        </div>

        {/* RIGHT — Hero image */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <Image
            src="/hero-image.webp"
            alt="NOZ Fragrances - Premium Perfume"
            width={600}
            height={620}
            priority
            style={{
              width: "100%",
              maxWidth: "560px",
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </div>
    </section>
  );
}
