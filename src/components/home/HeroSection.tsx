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

  /* ✅ HEADING FIX */
  .noz-hero-text h1 {
    font-family: var(--font-inter), Inter, sans-serif;
    font-size: 30px;           /* updated */
    font-weight: 400;
    line-height: 1.3;          /* updated */
    color: ${BRAND};
    margin: 0 0 16px 0;        /* updated */
  }

  .noz-hero-text h1 strong {
    font-weight: 500;          /* updated (was 700) */
    color: ${BRAND};
    display: inline;
  }

  /* ✅ PARAGRAPH FIX */
  .noz-hero-text p {
    font-family: var(--font-inter), Inter, sans-serif;
    font-size: 14px;           /* updated */
    color: ${BRAND};
    line-height: 1.6;          /* updated */
    margin: 0 0 24px 0;        /* updated */
  }

  /* ✅ BUTTON FIX */
  .noz-hero-btn {
    display: inline-block !important;
    background-color: #000000 !important;   /* updated */
    color: #ffffff !important;
    font-family: var(--font-inter), Inter, sans-serif !important;
    font-size: 14px !important;             /* updated */
    font-weight: 500 !important;            /* updated */
    padding: 12px 20px !important;          /* updated */
    border-radius: 6px !important;
    text-decoration: none !important;
    transition: opacity 0.2s !important;
    border: none !important;
    outline: none !important;

    /* removed noz-style uppercase look */
    letter-spacing: normal !important;
    text-transform: none !important;
  }

  .noz-hero-btn:hover {
    opacity: 0.82 !important;
  }

  /* DESKTOP (unchanged layout, only font sizes removed overrides) */
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

    /* ❌ removed clamp override to keep 30px consistent */
    .noz-hero-text h1 {
      margin-bottom: 16px;
    }

    .noz-hero-text p {
      margin-bottom: 24px;
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
