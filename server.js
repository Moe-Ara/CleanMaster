const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;
const iconPaths = {
  service: ["/public/icon-sparkle.svg", "/public/icon-shield.svg", "/public/icon-calendar.svg"],
  step: ["/public/icon-calendar.svg", "/public/icon-sparkle.svg", "/public/icon-shield.svg"],
  benefit: ["/public/icon-shield.svg", "/public/icon-sparkle.svg", "/public/icon-calendar.svg"]
};

const fallbackReviewsEn = [
  { name: "Sarah M.", text: "Outstanding quality and always on time.", rating: 5 },
  { name: "David R.", text: "Our office has never looked better.", rating: 5 },
  { name: "Lina K.", text: "Professional team and excellent communication.", rating: 4 }
];

const fallbackReviewsDe = [
  { name: "Anna B.", text: "Sehr zuverlaessig und gruendlich.", rating: 5 },
  { name: "Markus W.", text: "Top Service fuer unser Buero.", rating: 5 },
  { name: "Julia H.", text: "Professionell, schnell und freundlich.", rating: 4 }
];

function value(name, fallbackValue) {
  const envValue = process.env[name];
  if (typeof envValue === "string" && envValue.trim().length > 0) {
    return envValue.trim();
  }
  return fallbackValue;
}

function parsePipeList(name, fallbackList) {
  const raw = value(name, "");
  if (!raw) {
    return fallbackList;
  }
  const list = raw
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
  return list.length > 0 ? list : fallbackList;
}

function sanitizeImageUrl(url, fallbackUrl) {
  if (!url) {
    return fallbackUrl;
  }
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("./")
  ) {
    return trimmed;
  }
  return fallbackUrl;
}

function normalizeReview(rawReview, fallbackImage) {
  const numericRating = Number.parseInt(rawReview.rating, 10);
  return {
    name: (rawReview.name || "").trim() || "Anonymous",
    text: (rawReview.text || "").trim() || "Great service.",
    rating: Number.isNaN(numericRating) ? 5 : Math.max(1, Math.min(5, numericRating)),
    image: sanitizeImageUrl(rawReview.image || "", fallbackImage)
  };
}

function parseReviews(name, fallbackList, fallbackImage) {
  const raw = value(name, "");
  if (!raw) {
    return fallbackList.map((review) => normalizeReview(review, fallbackImage));
  }

  const reviews = raw
    .split(";;")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [reviewer = "", text = "", rating = "5", image = ""] = entry.split("||");
      return normalizeReview(
        {
          name: reviewer,
          text,
          rating,
          image
        },
        fallbackImage
      );
    });

  return reviews.length > 0 ? reviews : fallbackList.map((review) => normalizeReview(review, fallbackImage));
}

function sanitizeTel(phone) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function sanitizeWhatsapp(number) {
  return number.replace(/[^\d]/g, "");
}

function versionedAssetUrl(url, version) {
  if (!url || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${url}${url.includes("?") ? "&" : "?"}v=${version}`;
}

function safeJson(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function averageRating(reviews) {
  if (!reviews.length) {
    return 5;
  }
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Number((sum / reviews.length).toFixed(1));
}

function iconFor(type, index) {
  const list = iconPaths[type] || [];
  if (!list.length) {
    return "";
  }
  return list[index % list.length];
}

function buildLanguageBlock(lang) {
  const suffix = lang.toUpperCase();
  const isEnglish = lang === "en";
  const fallbackImage = value("DEFAULT_REVIEW_AVATAR", "/public/avatar-placeholder.svg");
  return {
    heroEyebrow: value(`HERO_EYEBROW_${suffix}`, isEnglish ? "Trusted Cleaning Experts" : "Ihr Reinigungsprofi"),
    heroTitle: value(
      `HERO_TITLE_${suffix}`,
      isEnglish ? "Professional Cleaning For Home And Business" : "Professionelle Reinigung Fuer Zuhause Und Buero"
    ),
    heroSubtitle: value(
      `HERO_SUBTITLE_${suffix}`,
      isEnglish
        ? "CleanMaster delivers reliable, high-quality cleaning with transparent pricing."
        : "CleanMaster bietet zuverlaessige, hochwertige Reinigung mit klaren Preisen."
    ),
    heroVisualTag: value(`HERO_VISUAL_TAG_${suffix}`, isEnglish ? "Background-Checked Team" : "Geprueftes Team"),
    heroVisualSubtag: value(
      `HERO_VISUAL_SUBTAG_${suffix}`,
      isEnglish ? "Eco-friendly products and insured service." : "Umweltfreundliche Produkte und versicherter Service."
    ),
    contactTitle: value(`CONTACT_TITLE_${suffix}`, isEnglish ? "Contact Us" : "Kontakt"),
    contactSubtitle: value(
      `CONTACT_SUBTITLE_${suffix}`,
      isEnglish ? "Reach us today for a fast quote." : "Kontaktieren Sie uns fuer ein schnelles Angebot."
    ),
    servicesTitle: value(`SERVICES_TITLE_${suffix}`, isEnglish ? "Our Services" : "Unsere Leistungen"),
    servicesSubtitle: value(
      `SERVICES_SUBTITLE_${suffix}`,
      isEnglish ? "Flexible plans for private and commercial spaces." : "Flexible Pakete fuer private und gewerbliche Flaechen."
    ),
    reviewsTitle: value(`REVIEWS_TITLE_${suffix}`, isEnglish ? "Customer Reviews" : "Kundenbewertungen"),
    reviewsSubtitle: value(
      `REVIEWS_SUBTITLE_${suffix}`,
      isEnglish ? "Owner-managed testimonials slider (placeholders for now)." : "Vom Inhaber gepflegte Slider-Bewertungen (derzeit Platzhalter)."
    ),
    ctaWhatsapp: value(`CTA_WHATSAPP_${suffix}`, isEnglish ? "Chat On WhatsApp" : "WhatsApp Chat"),
    ctaEmail: value(`CTA_EMAIL_${suffix}`, isEnglish ? "Send Email" : "E-Mail Senden"),
    phoneLabel: value(`PHONE_LABEL_${suffix}`, isEnglish ? "Phone" : "Telefon"),
    emailLabel: value(`EMAIL_LABEL_${suffix}`, isEnglish ? "Email" : "E-Mail"),
    addressLabel: value(`ADDRESS_LABEL_${suffix}`, isEnglish ? "Address" : "Adresse"),
    hoursLabel: value(`HOURS_LABEL_${suffix}`, isEnglish ? "Business Hours" : "Oeffnungszeiten"),
    serviceAreaLabel: value(`SERVICE_AREA_LABEL_${suffix}`, isEnglish ? "Service Area" : "Einsatzgebiet"),
    footerLine: value(
      `FOOTER_LINE_${suffix}`,
      isEnglish ? "Clean spaces. Professional standards." : "Saubere Raeume. Professionelle Standards."
    ),
    businessHours: value(`BUSINESS_HOURS_${suffix}`, isEnglish ? "Mon-Sat: 07:00 - 19:00" : "Mo-Sa: 07:00 - 19:00"),
    serviceArea: value(`SERVICE_AREA_${suffix}`, isEnglish ? "Greater City Area" : "Grossraum Stadt"),
    whatsappMessage: value(
      `WHATSAPP_MESSAGE_${suffix}`,
      isEnglish ? "Hello CleanMaster, I would like a cleaning quote." : "Hallo CleanMaster, ich moechte ein Reinigungsangebot."
    ),
    emailSubject: value(
      `EMAIL_SUBJECT_${suffix}`,
      isEnglish ? "Cleaning Service Request" : "Anfrage Reinigungsservice"
    ),
    trustPoints: parsePipeList(
      `TRUST_POINTS_${suffix}`,
      isEnglish
        ? ["4.9/5 Customer Rating", "Insured & Verified Cleaners", "Flexible Weekly Or One-Time Plans"]
        : ["4,9/5 Kundenbewertung", "Versicherte und gepruefte Reinigungskraefte", "Flexible Wochen- oder Einmaltermine"]
    ),
    stepsTitle: value(`STEPS_TITLE_${suffix}`, isEnglish ? "How It Works" : "So Funktioniert Es"),
    stepsSubtitle: value(
      `STEPS_SUBTITLE_${suffix}`,
      isEnglish ? "Simple booking process, clear communication, spotless result." : "Einfach buchen, klar kommunizieren, gruendlich reinigen."
    ),
    steps: parsePipeList(
      `STEPS_${suffix}`,
      isEnglish
        ? ["Tell us your needs", "Pick your preferred schedule", "Enjoy your clean space"]
        : ["Bedarf mitteilen", "Wunschtermin auswaehlen", "Sauberen Raum geniessen"]
    ),
    benefitsTitle: value(`BENEFITS_TITLE_${suffix}`, isEnglish ? "Why Clients Choose CleanMaster" : "Warum Kunden CleanMaster Waehlen"),
    benefitsSubtitle: value(
      `BENEFITS_SUBTITLE_${suffix}`,
      isEnglish ? "Reliable service quality inspired by top modern cleaning brands." : "Zuverlaessige Servicequalitaet, inspiriert von modernen Top-Reinigungsmarken."
    ),
    benefits: parsePipeList(
      `BENEFITS_${suffix}`,
      isEnglish
        ? ["Fast online response and clear pricing", "Professional equipment and safe products", "Consistent quality with owner-managed reviews"]
        : ["Schnelle Online-Antwort und klare Preise", "Professionelle Ausruestung und sichere Produkte", "Konstante Qualitaet mit inhabergefuehrten Bewertungen"]
    ),
    services: parsePipeList(
      `SERVICES_${suffix}`,
      isEnglish
        ? ["Home Cleaning", "Office Cleaning", "Deep Cleaning", "Move In / Move Out", "Post-Construction Cleaning"]
        : ["Wohnungsreinigung", "Bueroreinigung", "Grundreinigung", "Einzugs- und Auszugsreinigung", "Baureinigung"]
    ),
    reviews: parseReviews(`REVIEWS_${suffix}`, isEnglish ? fallbackReviewsEn : fallbackReviewsDe, fallbackImage)
  };
}

function buildConfig() {
  const defaultLanguage = value("DEFAULT_LANGUAGE", "en").toLowerCase() === "de" ? "de" : "en";
  const siteUrl = value("SITE_URL", "https://www.cleanmaster.example");
  return {
    assetVersion: value("ASSET_VERSION", "1"),
    company: {
      name: value("COMPANY_NAME", "CleanMaster"),
      phone: value("PHONE_NUMBER", "+49 30 12345678"),
      telLink: sanitizeTel(value("PHONE_NUMBER", "+49 30 12345678")),
      email: value("EMAIL", "info@cleanmaster.example"),
      whatsappNumber: sanitizeWhatsapp(value("WHATSAPP_NUMBER", "493012345678")),
      logoUrl: value("LOGO_URL", "/public/logo-placeholder.svg"),
      logoAlt: value("LOGO_ALT", "CleanMaster logo"),
      defaultReviewAvatar: value("DEFAULT_REVIEW_AVATAR", "/public/avatar-placeholder.svg"),
      addressStreet: value("ADDRESS_STREET", "Musterstrasse 10"),
      addressCity: value("ADDRESS_CITY", "Berlin"),
      addressCountry: value("ADDRESS_COUNTRY", "Germany")
    },
    siteUrl,
    defaultLanguage,
    seo: {
      en: {
        title: value("SEO_TITLE_EN", "CleanMaster | Professional Cleaning Services"),
        description: value(
          "SEO_DESCRIPTION_EN",
          "CleanMaster offers reliable residential and commercial cleaning services with transparent pricing."
        ),
        keywords: value(
          "SEO_KEYWORDS_EN",
          "cleaning company, home cleaning, office cleaning, deep cleaning, professional cleaners"
        )
      },
      de: {
        title: value("SEO_TITLE_DE", "CleanMaster | Professionelle Reinigungsservices"),
        description: value(
          "SEO_DESCRIPTION_DE",
          "CleanMaster bietet zuverlaessige Reinigungsservices fuer Privat- und Gewerbekunden."
        ),
        keywords: value(
          "SEO_KEYWORDS_DE",
          "reinigungsfirma, wohnungsreinigung, bueroreinigung, grundreinigung, professionelle reinigung"
        )
      },
      ogImage: value("SEO_OG_IMAGE", "")
    },
    content: {
      en: buildLanguageBlock("en"),
      de: buildLanguageBlock("de")
    }
  };
}

function renderPage(config) {
  const lang = config.defaultLanguage;
  const text = config.content[lang];
  const seo = config.seo[lang];
  const assetVersion = encodeURIComponent(config.assetVersion || "1");
  const logoSrc = versionedAssetUrl(config.company.logoUrl, assetVersion);
  const canonical = `${config.siteUrl.replace(/\/$/, "")}/`;
  const ogImage = config.seo.ogImage ? `${escapeHtml(config.seo.ogImage)}` : "";
  const reviewAverage = averageRating(text.reviews);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: config.company.name,
    url: canonical,
    telephone: config.company.phone,
    email: config.company.email,
    logo: config.company.logoUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: config.company.addressStreet,
      addressLocality: config.company.addressCity,
      addressCountry: config.company.addressCountry
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: reviewAverage,
      reviewCount: text.reviews.length
    }
  };

  const initialServices = text.services
    .map(
      (service, index) => `
      <li class="service-item">
        <img class="list-icon" src="${escapeHtml(iconFor("service", index))}" alt="" aria-hidden="true">
        <span>${escapeHtml(service)}</span>
      </li>`
    )
    .join("");
  const initialTrust = text.trustPoints
    .map((point) => `<li class="trust-item">${escapeHtml(point)}</li>`)
    .join("");
  const initialSteps = text.steps
    .map(
      (step, index) => `
      <article class="flow-card">
        <div class="card-top">
          <span class="step-index">0${index + 1}</span>
          <img class="flow-icon" src="${escapeHtml(iconFor("step", index))}" alt="" aria-hidden="true">
        </div>
        <p class="flow-text">${escapeHtml(step)}</p>
      </article>`
    )
    .join("");
  const initialBenefits = text.benefits
    .map(
      (benefit, index) => `
      <article class="benefit-card">
        <div class="card-top">
          <img class="flow-icon" src="${escapeHtml(iconFor("benefit", index))}" alt="" aria-hidden="true">
        </div>
        <p class="benefit-text">${escapeHtml(benefit)}</p>
      </article>`
    )
    .join("");
  const initialReviews = text.reviews
    .map(
      (review) => `
        <article class="review-card">
          <div class="review-header">
            <img class="review-avatar" src="${escapeHtml(review.image || config.company.defaultReviewAvatar)}" alt="${escapeHtml(review.name)} profile picture" loading="lazy">
            <div>
              <p class="review-name">${escapeHtml(review.name)}</p>
              <p class="review-rating">${"&#9733;".repeat(review.rating)}${"&#9734;".repeat(5 - review.rating)}</p>
            </div>
          </div>
          <p class="review-text">"${escapeHtml(review.text)}"</p>
        </article>
      `
    )
    .join("");

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(seo.title)}</title>
    <meta id="meta-description" name="description" content="${escapeHtml(seo.description)}">
    <meta id="meta-keywords" name="keywords" content="${escapeHtml(seo.keywords)}">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <link rel="canonical" href="${escapeHtml(canonical)}">

    <meta id="og-title" property="og:title" content="${escapeHtml(seo.title)}">
    <meta id="og-description" property="og:description" content="${escapeHtml(seo.description)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    ${ogImage ? `<meta property="og:image" content="${ogImage}">` : ""}

    <meta name="twitter:card" content="summary_large_image">
    <meta id="twitter-title" name="twitter:title" content="${escapeHtml(seo.title)}">
    <meta id="twitter-description" name="twitter:description" content="${escapeHtml(seo.description)}">
    ${ogImage ? `<meta name="twitter:image" content="${ogImage}">` : ""}

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Source+Sans+3:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/public/index.css?v=${assetVersion}">

    <script type="application/ld+json">${safeJson(structuredData)}</script>
  </head>
  <body>
    <div class="page-bg" aria-hidden="true"></div>
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="/" aria-label="${escapeHtml(config.company.name)} home">
          <img class="brand-logo" src="${escapeHtml(logoSrc)}" alt="${escapeHtml(config.company.logoAlt)}" loading="eager">
          <span class="brand-text">${escapeHtml(config.company.name)}</span>
        </a>
        <div class="language-switch" role="group" aria-label="Language switcher">
          <button class="lang-btn ${lang === "en" ? "active" : ""}" data-lang="en" type="button">EN</button>
          <button class="lang-btn ${lang === "de" ? "active" : ""}" data-lang="de" type="button">DE</button>
        </div>
      </div>
    </header>

    <main>
      <section class="hero container reveal">
        <div class="hero-grid">
          <div class="hero-copy">
            <p class="eyebrow" id="hero-eyebrow">${escapeHtml(text.heroEyebrow)}</p>
            <h1 id="hero-title">${escapeHtml(text.heroTitle)}</h1>
            <p class="hero-subtitle" id="hero-subtitle">${escapeHtml(text.heroSubtitle)}</p>
            <div class="cta-row">
              <a id="whatsapp-btn" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer" href="https://wa.me/${config.company.whatsappNumber}?text=${encodeURIComponent(text.whatsappMessage)}">
                <img class="btn-icon" src="/public/icon-whatsapp.svg?v=${assetVersion}" alt="" aria-hidden="true">
                <span id="whatsapp-btn-label">${escapeHtml(text.ctaWhatsapp)}</span>
              </a>
              <a id="email-btn" class="btn btn-secondary" href="mailto:${escapeHtml(config.company.email)}?subject=${encodeURIComponent(text.emailSubject)}">
                <span id="email-btn-label">${escapeHtml(text.ctaEmail)}</span>
              </a>
            </div>
            <ul id="trust-list" class="trust-list">${initialTrust}</ul>
          </div>
          <div class="hero-visual" aria-hidden="true">
            <img class="hero-illustration" src="/public/hero-cleaning.svg?v=${assetVersion}" alt="">
            <div class="hero-note">
              <p id="hero-visual-tag">${escapeHtml(text.heroVisualTag)}</p>
              <p id="hero-visual-subtag">${escapeHtml(text.heroVisualSubtag)}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="flow container reveal">
        <div class="section-panel flow-panel">
          <div class="section-head">
            <h2 id="steps-title">${escapeHtml(text.stepsTitle)}</h2>
            <p id="steps-subtitle">${escapeHtml(text.stepsSubtitle)}</p>
          </div>
          <div id="steps-list" class="flow-grid">${initialSteps}</div>
        </div>
      </section>

      <section class="benefits container reveal">
        <div class="section-panel benefits-panel">
          <div class="section-head">
            <h2 id="benefits-title">${escapeHtml(text.benefitsTitle)}</h2>
            <p id="benefits-subtitle">${escapeHtml(text.benefitsSubtitle)}</p>
          </div>
          <div id="benefits-list" class="benefits-grid">${initialBenefits}</div>
        </div>
      </section>

      <section class="info-grid container reveal">
        <article class="card">
          <h2 id="contact-title">${escapeHtml(text.contactTitle)}</h2>
          <p id="contact-subtitle">${escapeHtml(text.contactSubtitle)}</p>
          <ul class="detail-list">
            <li><span id="phone-label">${escapeHtml(text.phoneLabel)}</span><a id="phone-link" href="${escapeHtml(config.company.telLink)}">${escapeHtml(config.company.phone)}</a></li>
            <li><span id="email-label">${escapeHtml(text.emailLabel)}</span><a id="email-link" href="mailto:${escapeHtml(config.company.email)}">${escapeHtml(config.company.email)}</a></li>
            <li>
              <span id="address-label">${escapeHtml(text.addressLabel)}</span>
              <address id="address-text">${escapeHtml(config.company.addressStreet)}, ${escapeHtml(config.company.addressCity)}, ${escapeHtml(config.company.addressCountry)}</address>
            </li>
            <li><span id="hours-label">${escapeHtml(text.hoursLabel)}</span><p id="hours-text">${escapeHtml(text.businessHours)}</p></li>
            <li><span id="service-area-label">${escapeHtml(text.serviceAreaLabel)}</span><p id="service-area-text">${escapeHtml(text.serviceArea)}</p></li>
          </ul>
        </article>

        <article class="card">
          <h2 id="services-title">${escapeHtml(text.servicesTitle)}</h2>
          <p id="services-subtitle">${escapeHtml(text.servicesSubtitle)}</p>
          <ul id="services-list" class="services-list">${initialServices}</ul>
        </article>
      </section>

      <section class="reviews container reveal">
        <h2 id="reviews-title">${escapeHtml(text.reviewsTitle)}</h2>
        <p id="reviews-subtitle">${escapeHtml(text.reviewsSubtitle)}</p>
        <div class="reviews-viewport" aria-live="polite">
          <div id="reviews-track" class="reviews-track">${initialReviews}</div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <p>${escapeHtml(config.company.name)}</p>
        <p id="footer-line">${escapeHtml(text.footerLine)}</p>
      </div>
    </footer>

    <script>window.CLEANMASTER_CONFIG = ${safeJson(config)};</script>
    <script src="/public/app.js?v=${assetVersion}" defer></script>
  </body>
</html>`;
}

const staticAssetCacheSeconds = Number(value("STATIC_ASSET_CACHE_SECONDS", "0"));
app.use(
  "/public",
  express.static(path.join(__dirname, "public"), {
    maxAge: staticAssetCacheSeconds * 1000,
    setHeaders(res) {
      if (staticAssetCacheSeconds <= 0) {
        res.setHeader("Cache-Control", "no-store");
      }
    }
  })
);

app.get("/", (_req, res) => {
  const config = buildConfig();
  res.status(200).type("html").send(renderPage(config));
});

app.get("/robots.txt", (_req, res) => {
  const siteUrl = value("SITE_URL", "https://www.cleanmaster.example").replace(/\/$/, "");
  const body = `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`;
  res.type("text/plain").send(body);
});

app.get("/sitemap.xml", (_req, res) => {
  const siteUrl = value("SITE_URL", "https://www.cleanmaster.example").replace(/\/$/, "");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeHtml(siteUrl)}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
  res.type("application/xml").send(body);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`CleanMaster landing page running on http://localhost:${port}`);
});
