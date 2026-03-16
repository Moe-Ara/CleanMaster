const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

const iconPaths = {
  service: ["/public/icon-sparkle.svg", "/public/icon-shield.svg", "/public/icon-calendar.svg"]
};

const fallbackReviewsEn = [
  { name: "Sarah M.", text: "Outstanding quality and always on time.", rating: 5 },
  { name: "David R.", text: "Our office has never looked better.", rating: 5 },
  { name: "Lina K.", text: "Professional team and excellent communication.", rating: 5 }
];

const fallbackReviewsDe = [
  { name: "Anna B.", text: "Sehr zuverlaessig und gruendlich.", rating: 5 },
  { name: "Markus W.", text: "Top Service fuer unser Buero.", rating: 5 },
  { name: "Julia H.", text: "Professionell, schnell und freundlich.", rating: 5 }
];

const fallbackServiceCardsEn = [
  { title: "House Cleaning", description: "Regular or one-time home cleaning tailored to your schedule." },
  { title: "Office Cleaning", description: "Consistent and discreet cleaning for productive workspaces." },
  { title: "Deep Cleaning", description: "Thorough detail cleaning for kitchens, bathrooms, and high-touch zones." },
  { title: "Move Out Cleaning", description: "End-of-tenancy cleaning to leave the property spotless." },
  { title: "Window Cleaning", description: "Streak-free interior window cleaning for a brighter home." }
];

const fallbackServiceCardsDe = [
  { title: "Hausreinigung", description: "Regelmaessige oder einmalige Reinigung nach Ihrem Zeitplan." },
  { title: "Bueroreinigung", description: "Zuverlaessige Reinigung fuer ein professionelles Arbeitsumfeld." },
  { title: "Grundreinigung", description: "Intensive Reinigung fuer Kueche, Bad und stark genutzte Bereiche." },
  { title: "Auszugsreinigung", description: "Sorgfaeltige Endreinigung fuer eine problemlose Uebergabe." },
  { title: "Fensterreinigung", description: "Streifenfreie Fenster fuer mehr Licht und einen besseren Eindruck." }
];

const fallbackTrustStatsEn = [
  { value: "10+", label: "Years of Experience" },
  { value: "2,500+", label: "Homes Cleaned" },
  { value: "100%", label: "Satisfaction Guarantee" },
  { value: "Fully", label: "Insured & Reliable" }
];

const fallbackTrustStatsDe = [
  { value: "10+", label: "Jahre Erfahrung" },
  { value: "2.500+", label: "Gereinigte Haushalte" },
  { value: "100%", label: "Zufriedenheitsgarantie" },
  { value: "Voll", label: "Versichert & Zuverlaessig" }
];

const fallbackFaqsEn = [
  {
    question: "How quickly can I get a quote?",
    answer: "Most quote requests are answered within one business day."
  },
  {
    question: "Do I need to provide cleaning supplies?",
    answer: "No, our team can bring professional cleaning supplies and equipment."
  },
  {
    question: "Are your cleaners insured?",
    answer: "Yes, our cleaners are fully insured and background-checked."
  }
];

const fallbackFaqsDe = [
  {
    question: "Wie schnell erhalte ich ein Angebot?",
    answer: "Die meisten Angebotsanfragen beantworten wir innerhalb eines Werktags."
  },
  {
    question: "Muss ich Reinigungsmittel bereitstellen?",
    answer: "Nein, unser Team bringt auf Wunsch professionelle Reinigungsmittel und Geraete mit."
  },
  {
    question: "Sind Ihre Reinigungskraefte versichert?",
    answer: "Ja, unsere Reinigungskraefte sind voll versichert und geprueft."
  }
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
  return list.length ? list : fallbackList;
}

function parseCardList(name, fallbackList) {
  const raw = value(name, "");
  if (!raw) {
    return fallbackList;
  }

  const cards = raw
    .split(";;")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [title = "", description = ""] = entry.split("||");
      return {
        title: title.trim(),
        description: description.trim()
      };
    })
    .filter((item) => item.title && item.description);

  return cards.length ? cards : fallbackList;
}

function parseStatsList(name, fallbackList) {
  const raw = value(name, "");
  if (!raw) {
    return fallbackList;
  }

  const stats = raw
    .split(";;")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [statValue = "", statLabel = ""] = entry.split("||");
      return {
        value: statValue.trim(),
        label: statLabel.trim()
      };
    })
    .filter((item) => item.value && item.label);

  return stats.length ? stats : fallbackList;
}

function parseFaqList(name, fallbackList) {
  const raw = value(name, "");
  if (!raw) {
    return fallbackList;
  }

  const faqs = raw
    .split(";;")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [question = "", answer = ""] = entry.split("||");
      return {
        question: question.trim(),
        answer: answer.trim()
      };
    })
    .filter((item) => item.question && item.answer);

  return faqs.length ? faqs : fallbackList;
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

  return reviews.length ? reviews : fallbackList.map((review) => normalizeReview(review, fallbackImage));
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

function absoluteUrl(siteUrl, maybeRelativeUrl) {
  if (!maybeRelativeUrl) {
    return "";
  }
  if (maybeRelativeUrl.startsWith("http://") || maybeRelativeUrl.startsWith("https://")) {
    return maybeRelativeUrl;
  }
  const base = siteUrl.replace(/\/$/, "");
  const rel = maybeRelativeUrl.startsWith("/") ? maybeRelativeUrl : `/${maybeRelativeUrl}`;
  return `${base}${rel}`;
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
    heroEyebrow: value(`HERO_EYEBROW_${suffix}`, isEnglish ? "Trusted Local Cleaning Team" : "Ihr Lokaler Reinigungsservice"),
    heroTitle: value(
      `HERO_TITLE_${suffix}`,
      isEnglish ? "A Spotless Home Without The Stress" : "Ein Sauberes Zuhause Ohne Stress"
    ),
    heroSubtitle: value(
      `HERO_SUBTITLE_${suffix}`,
      isEnglish
        ? "Professional, insured cleaners with transparent pricing and reliable appointments."
        : "Professionelle, versicherte Reinigungskraefte mit transparenten Preisen und zuverlaessigen Terminen."
    ),
    ctaQuote: value(`CTA_QUOTE_${suffix}`, isEnglish ? "Get a Free Quote" : "Kostenloses Angebot"),
    ctaCall: value(`CTA_CALL_${suffix}`, isEnglish ? "Call Now" : "Jetzt Anrufen"),
    heroBadges: parsePipeList(
      `HERO_BADGES_${suffix}`,
      isEnglish ? ["Insured", "Professional Cleaners", "5 Star Service"] : ["Versichert", "Professionelle Reinigung", "5-Sterne-Service"]
    ),

    servicesTitle: value(`SERVICES_TITLE_${suffix}`, isEnglish ? "Our Cleaning Services" : "Unsere Reinigungsleistungen"),
    servicesSubtitle: value(
      `SERVICES_SUBTITLE_${suffix}`,
      isEnglish ? "Choose the service that fits your home, office, or move." : "Waehlen Sie den Service, der zu Zuhause, Buero oder Umzug passt."
    ),
    serviceCards: parseCardList(`SERVICE_CARDS_${suffix}`, isEnglish ? fallbackServiceCardsEn : fallbackServiceCardsDe),

    trustTitle: value(`TRUST_TITLE_${suffix}`, isEnglish ? "Trusted By Homeowners Across The Area" : "Vertrauen Von Haushalten In Der Region"),
    trustSubtitle: value(
      `TRUST_SUBTITLE_${suffix}`,
      isEnglish ? "Proof that your property is in safe and experienced hands." : "Belege dafuer, dass Ihr Zuhause in sicheren und erfahrenen Haenden ist."
    ),
    trustStats: parseStatsList(`TRUST_STATS_${suffix}`, isEnglish ? fallbackTrustStatsEn : fallbackTrustStatsDe),

    reviewsTitle: value(`REVIEWS_TITLE_${suffix}`, isEnglish ? "Customer Testimonials" : "Kundenstimmen"),
    reviewsSubtitle: value(
      `REVIEWS_SUBTITLE_${suffix}`,
      isEnglish ? "Real feedback from clients who trust CleanMaster." : "Echtes Feedback von Kundinnen und Kunden, die CleanMaster vertrauen."
    ),
    reviews: parseReviews(`REVIEWS_${suffix}`, isEnglish ? fallbackReviewsEn : fallbackReviewsDe, fallbackImage),

    beforeAfterTitle: value(`BEFORE_AFTER_TITLE_${suffix}`, isEnglish ? "See The Difference" : "Sehen Sie Den Unterschied"),
    beforeAfterSubtitle: value(
      `BEFORE_AFTER_SUBTITLE_${suffix}`,
      isEnglish ? "Before and after examples of our detailed cleaning work." : "Vorher-Nachher-Beispiele unserer gruendlichen Reinigungsarbeit."
    ),
    beforeLabel: value(`BEFORE_LABEL_${suffix}`, isEnglish ? "Before" : "Vorher"),
    afterLabel: value(`AFTER_LABEL_${suffix}`, isEnglish ? "After" : "Nachher"),

    serviceAreaTitle: value(`SERVICE_AREA_TITLE_${suffix}`, isEnglish ? "Service Area" : "Einsatzgebiet"),
    serviceAreaSubtitle: value(
      `SERVICE_AREA_SUBTITLE_${suffix}`,
      isEnglish ? "We proudly serve these cities and nearby neighborhoods." : "Wir bedienen diese Staedte und umliegenden Gebiete."
    ),
    serviceCities: parsePipeList(
      `SERVICE_CITIES_${suffix}`,
      isEnglish ? ["Berlin", "Potsdam", "Charlottenburg", "Mitte", "Prenzlauer Berg"] : ["Berlin", "Potsdam", "Charlottenburg", "Mitte", "Prenzlauer Berg"]
    ),

    faqTitle: value(`FAQ_TITLE_${suffix}`, isEnglish ? "Frequently Asked Questions" : "Haeufige Fragen"),
    faqItems: parseFaqList(`FAQS_${suffix}`, isEnglish ? fallbackFaqsEn : fallbackFaqsDe),

    formTitle: value(`FORM_TITLE_${suffix}`, isEnglish ? "Request Your Free Quote" : "Kostenloses Angebot Anfordern"),
    formSubtitle: value(
      `FORM_SUBTITLE_${suffix}`,
      isEnglish ? "Tell us what you need and we will get back to you quickly." : "Teilen Sie uns Ihren Bedarf mit und wir melden uns schnell bei Ihnen."
    ),
    formNameLabel: value(`FORM_NAME_LABEL_${suffix}`, isEnglish ? "Name" : "Name"),
    formPhoneLabel: value(`FORM_PHONE_LABEL_${suffix}`, isEnglish ? "Phone" : "Telefon"),
    formEmailLabel: value(`FORM_EMAIL_LABEL_${suffix}`, isEnglish ? "Email" : "E-Mail"),
    formAddressLabel: value(`FORM_ADDRESS_LABEL_${suffix}`, isEnglish ? "Address" : "Adresse"),
    formCleaningTypeLabel: value(`FORM_CLEANING_TYPE_LABEL_${suffix}`, isEnglish ? "Cleaning Type" : "Reinigungsart"),
    formMessageLabel: value(`FORM_MESSAGE_LABEL_${suffix}`, isEnglish ? "Message" : "Nachricht"),
    formSubmit: value(`FORM_SUBMIT_${suffix}`, isEnglish ? "Get My Free Quote" : "Mein Kostenloses Angebot"),
    cleaningTypes: parsePipeList(
      `CLEANING_TYPES_${suffix}`,
      isEnglish
        ? ["House Cleaning", "Office Cleaning", "Deep Cleaning", "Move Out Cleaning", "Window Cleaning"]
        : ["Hausreinigung", "Bueroreinigung", "Grundreinigung", "Auszugsreinigung", "Fensterreinigung"]
    ),

    finalCtaTitle: value(`FINAL_CTA_TITLE_${suffix}`, isEnglish ? "Ready for a Spotless Home?" : "Bereit Fuer Ein Makellos Sauberes Zuhause?"),
    finalCtaSubtitle: value(
      `FINAL_CTA_SUBTITLE_${suffix}`,
      isEnglish ? "Book your cleaning today and enjoy your free time again." : "Buchen Sie noch heute und geniessen Sie wieder Ihre freie Zeit."
    ),
    finalCtaQuote: value(`FINAL_CTA_QUOTE_${suffix}`, isEnglish ? "Get Free Quote" : "Kostenloses Angebot"),
    finalCtaCall: value(`FINAL_CTA_CALL_${suffix}`, isEnglish ? "Call Now" : "Jetzt Anrufen"),

    footerTagline: value(
      `FOOTER_TAGLINE_${suffix}`,
      isEnglish ? "Clean spaces. Reliable service. Professional standards." : "Saubere Raeume. Zuverlaessiger Service. Professionelle Standards."
    ),
    footerContactLabel: value(`FOOTER_CONTACT_LABEL_${suffix}`, isEnglish ? "Contact" : "Kontakt"),
    footerHoursLabel: value(`FOOTER_HOURS_LABEL_${suffix}`, isEnglish ? "Business Hours" : "Oeffnungszeiten"),
    footerServiceAreaLabel: value(`FOOTER_SERVICE_AREA_LABEL_${suffix}`, isEnglish ? "Service Area" : "Einsatzgebiet"),
    footerSocialLabel: value(`FOOTER_SOCIAL_LABEL_${suffix}`, isEnglish ? "Follow Us" : "Folgen Sie Uns"),

    businessHours: value(`BUSINESS_HOURS_${suffix}`, isEnglish ? "Mon-Sat: 07:00 - 19:00" : "Mo-Sa: 07:00 - 19:00"),
    serviceArea: value(`SERVICE_AREA_${suffix}`, isEnglish ? "Greater Berlin Area" : "Grossraum Berlin"),
    whatsappMessage: value(
      `WHATSAPP_MESSAGE_${suffix}`,
      isEnglish ? "Hello CleanMaster, I would like a free cleaning quote." : "Hallo CleanMaster, ich moechte ein kostenloses Reinigungsangebot."
    )
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
      addressCountry: value("ADDRESS_COUNTRY", "Germany"),
      facebookUrl: value("SOCIAL_FACEBOOK_URL", "#"),
      instagramUrl: value("SOCIAL_INSTAGRAM_URL", "#"),
      googleUrl: value("SOCIAL_GOOGLE_URL", "#")
    },
    assets: {
      heroBackgroundImage: value("HERO_BG_IMAGE", "/public/hero-cleaning.svg"),
      beforeImage: value("BEFORE_IMAGE", "/public/before-placeholder.svg"),
      afterImage: value("AFTER_IMAGE", "/public/after-placeholder.svg")
    },
    siteUrl,
    defaultLanguage,
    seo: {
      en: {
        title: value("SEO_TITLE_EN", "CleanMaster | Professional Cleaning Services"),
        locale: value("SEO_LOCALE_EN", "en_US"),
        description: value(
          "SEO_DESCRIPTION_EN",
          "CleanMaster offers trusted house and office cleaning services. Get a free quote today."
        ),
        keywords: value(
          "SEO_KEYWORDS_EN",
          "cleaning company, house cleaning, office cleaning, deep cleaning, move out cleaning"
        )
      },
      de: {
        title: value("SEO_TITLE_DE", "CleanMaster | Professionelle Reinigungsservices"),
        locale: value("SEO_LOCALE_DE", "de_DE"),
        description: value(
          "SEO_DESCRIPTION_DE",
          "CleanMaster bietet zuverlaessige Haus- und Bueroreinigung. Jetzt kostenloses Angebot anfordern."
        ),
        keywords: value(
          "SEO_KEYWORDS_DE",
          "reinigungsfirma, hausreinigung, bueroreinigung, grundreinigung, auszugsreinigung"
        )
      },
      ogImage: value("SEO_OG_IMAGE", ""),
      author: value("SEO_AUTHOR", value("COMPANY_NAME", "CleanMaster")),
      twitterSite: value("SEO_TWITTER_SITE", "")
    },
    content: {
      en: buildLanguageBlock("en"),
      de: buildLanguageBlock("de")
    }
  };
}

function renderPage(config, forcedLang, pagePath = "/") {
  const lang = forcedLang || config.defaultLanguage;
  const text = config.content[lang];
  const seo = config.seo[lang];
  const assetVersion = encodeURIComponent(config.assetVersion || "1");
  const logoSrc = versionedAssetUrl(config.company.logoUrl, assetVersion);
  const heroBgSrc = versionedAssetUrl(config.assets.heroBackgroundImage, assetVersion);
  const beforeSrc = versionedAssetUrl(config.assets.beforeImage, assetVersion);
  const afterSrc = versionedAssetUrl(config.assets.afterImage, assetVersion);
  const normalizedPath = pagePath.endsWith("/") ? pagePath : `${pagePath}/`;
  const canonical = `${config.siteUrl.replace(/\/$/, "")}${normalizedPath === "//" ? "/" : normalizedPath}`;
  const enUrl = `${config.siteUrl.replace(/\/$/, "")}/en/`;
  const deUrl = `${config.siteUrl.replace(/\/$/, "")}/de/`;
  const xDefaultUrl = `${config.siteUrl.replace(/\/$/, "")}/`;
  const ogImage = config.seo.ogImage || config.assets.heroBackgroundImage;
  const ogImageAbsolute = absoluteUrl(config.siteUrl, ogImage);
  const ogLocale = seo.locale || (lang === "de" ? "de_DE" : "en_US");
  const alternateLocale = lang === "de" ? (config.seo.en.locale || "en_US") : (config.seo.de.locale || "de_DE");
  const reviewAverage = averageRating(text.reviews);

  const socialProfiles = [config.company.facebookUrl, config.company.instagramUrl, config.company.googleUrl].filter(
    (url) => url && url !== "#"
  );

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: config.company.name,
    image: absoluteUrl(config.siteUrl, config.assets.heroBackgroundImage),
    logo: absoluteUrl(config.siteUrl, config.company.logoUrl),
    url: canonical,
    telephone: config.company.phone,
    email: config.company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: config.company.addressStreet,
      addressLocality: config.company.addressCity,
      addressCountry: config.company.addressCountry
    },
    sameAs: socialProfiles,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: lang === "de" ? "Reinigungsleistungen" : "Cleaning Services",
      itemListElement: text.serviceCards.map((item) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: item.title,
          description: item.description
        }
      }))
    },
    areaServed: text.serviceCities,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: reviewAverage,
      reviewCount: text.reviews.length
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.company.name,
    url: xDefaultUrl,
    inLanguage: ["en", "de"]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: text.faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  const initialHeroBadges = text.heroBadges
    .map((badge) => `<li class="hero-badge-item">${escapeHtml(badge)}</li>`)
    .join("");

  const initialServiceCards = text.serviceCards
    .map(
      (item, index) => `
      <article class="service-card">
        <img class="service-card-icon" src="${escapeHtml(iconFor("service", index))}" alt="" aria-hidden="true">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </article>`
    )
    .join("");

  const initialTrustStats = text.trustStats
    .map(
      (item) => `
      <article class="trust-stat-card">
        <p class="trust-stat-value">${escapeHtml(item.value)}</p>
        <p class="trust-stat-label">${escapeHtml(item.label)}</p>
      </article>`
    )
    .join("");

  const initialReviews = text.reviews
    .slice(0, 3)
    .map(
      (review) => `
      <article class="testimonial-card">
        <p class="testimonial-stars">${"&#9733;".repeat(review.rating)}${"&#9734;".repeat(5 - review.rating)}</p>
        <p class="testimonial-text">"${escapeHtml(review.text)}"</p>
        <p class="testimonial-name">${escapeHtml(review.name)}</p>
      </article>`
    )
    .join("");

  const initialCities = text.serviceCities
    .map((city) => `<li class="city-chip">${escapeHtml(city)}</li>`)
    .join("");

  const initialCleaningOptions = text.cleaningTypes
    .map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`)
    .join("");

  const initialFaqs = text.faqItems
    .map(
      (item) => `
      <details class="faq-item">
        <summary>${escapeHtml(item.question)}</summary>
        <p>${escapeHtml(item.answer)}</p>
      </details>`
    )
    .join("");

  const pageConfig = { ...config, defaultLanguage: lang };

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(seo.title)}</title>
    <meta id="meta-description" name="description" content="${escapeHtml(seo.description)}">
    <meta id="meta-keywords" name="keywords" content="${escapeHtml(seo.keywords)}">
    <meta name="author" content="${escapeHtml(config.seo.author)}">
    <meta name="format-detection" content="telephone=yes">
    <meta name="theme-color" content="#0c7a8b">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <link rel="alternate" hreflang="de" href="${escapeHtml(deUrl)}">
    <link rel="alternate" hreflang="en" href="${escapeHtml(enUrl)}">
    <link rel="alternate" hreflang="x-default" href="${escapeHtml(xDefaultUrl)}">

    <meta id="og-title" property="og:title" content="${escapeHtml(seo.title)}">
    <meta id="og-description" property="og:description" content="${escapeHtml(seo.description)}">
    <meta property="og:site_name" content="${escapeHtml(config.company.name)}">
    <meta property="og:locale" content="${escapeHtml(ogLocale)}">
    <meta property="og:locale:alternate" content="${escapeHtml(alternateLocale)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:image" content="${escapeHtml(ogImageAbsolute)}">

    <meta name="twitter:card" content="summary_large_image">
    <meta id="twitter-title" name="twitter:title" content="${escapeHtml(seo.title)}">
    <meta id="twitter-description" name="twitter:description" content="${escapeHtml(seo.description)}">
    <meta name="twitter:image" content="${escapeHtml(ogImageAbsolute)}">
    ${config.seo.twitterSite ? `<meta name="twitter:site" content="${escapeHtml(config.seo.twitterSite)}">` : ""}

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" as="image" href="${escapeHtml(heroBgSrc)}">
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Source+Sans+3:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/public/index.css?v=${assetVersion}">

    <script type="application/ld+json">${safeJson(localBusinessSchema)}</script>
    <script type="application/ld+json">${safeJson(websiteSchema)}</script>
    <script type="application/ld+json">${safeJson(faqSchema)}</script>
  </head>
  <body>
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="/" aria-label="${escapeHtml(config.company.name)} home">
          <img class="brand-logo" src="${escapeHtml(logoSrc)}" alt="${escapeHtml(config.company.logoAlt)}" loading="eager">
          <span class="brand-text">${escapeHtml(config.company.name)}</span>
        </a>
        <div class="header-actions">
          <a class="header-call" href="${escapeHtml(config.company.telLink)}">${escapeHtml(config.company.phone)}</a>
          <div class="language-switch" role="group" aria-label="Language switcher">
            <button class="lang-btn ${lang === "en" ? "active" : ""}" data-lang="en" type="button">EN</button>
            <button class="lang-btn ${lang === "de" ? "active" : ""}" data-lang="de" type="button">DE</button>
          </div>
        </div>
      </div>
    </header>

    <main>
      <section class="hero" style="--hero-bg:url('${escapeHtml(heroBgSrc)}')">
        <div class="hero-layer"></div>
        <div class="container hero-inner">
          <div class="hero-card">
            <p class="hero-eyebrow" id="hero-eyebrow">${escapeHtml(text.heroEyebrow)}</p>
            <h1 id="hero-title">${escapeHtml(text.heroTitle)}</h1>
            <p class="hero-subtitle" id="hero-subtitle">${escapeHtml(text.heroSubtitle)}</p>
            <div class="hero-ctas">
              <a id="hero-quote-btn" class="btn btn-primary" href="#quote-form-section">
                <span id="hero-quote-label">${escapeHtml(text.ctaQuote)}</span>
              </a>
              <a id="hero-call-btn" class="btn btn-call" href="${escapeHtml(config.company.telLink)}">
                <span id="hero-call-label">${escapeHtml(text.ctaCall)}</span>
              </a>
            </div>
            <ul id="hero-badges" class="hero-badge-list">${initialHeroBadges}</ul>
          </div>
        </div>
      </section>

      <section class="section container services-section">
        <div class="section-heading">
          <h2 id="services-title">${escapeHtml(text.servicesTitle)}</h2>
          <p id="services-subtitle">${escapeHtml(text.servicesSubtitle)}</p>
        </div>
        <div id="services-grid" class="services-grid">${initialServiceCards}</div>
      </section>

      <section class="section container trust-section">
        <div class="section-heading">
          <h2 id="trust-title">${escapeHtml(text.trustTitle)}</h2>
          <p id="trust-subtitle">${escapeHtml(text.trustSubtitle)}</p>
        </div>
        <div id="trust-stats" class="trust-stats">${initialTrustStats}</div>
      </section>

      <section class="section container testimonials-section">
        <div class="section-heading">
          <h2 id="reviews-title">${escapeHtml(text.reviewsTitle)}</h2>
          <p id="reviews-subtitle">${escapeHtml(text.reviewsSubtitle)}</p>
        </div>
        <div id="reviews-grid" class="testimonials-grid">${initialReviews}</div>
      </section>

      <section class="section container before-after-section">
        <div class="section-heading">
          <h2 id="before-after-title">${escapeHtml(text.beforeAfterTitle)}</h2>
          <p id="before-after-subtitle">${escapeHtml(text.beforeAfterSubtitle)}</p>
        </div>
        <div class="before-after-grid">
          <figure class="compare-card">
            <img src="${escapeHtml(beforeSrc)}" alt="${escapeHtml(text.beforeLabel)} cleaning result placeholder" loading="lazy">
            <figcaption id="before-label">${escapeHtml(text.beforeLabel)}</figcaption>
          </figure>
          <figure class="compare-card">
            <img src="${escapeHtml(afterSrc)}" alt="${escapeHtml(text.afterLabel)} cleaning result placeholder" loading="lazy">
            <figcaption id="after-label">${escapeHtml(text.afterLabel)}</figcaption>
          </figure>
        </div>
      </section>

      <section class="section container service-area-section">
        <div class="section-heading">
          <h2 id="service-area-title">${escapeHtml(text.serviceAreaTitle)}</h2>
          <p id="service-area-subtitle">${escapeHtml(text.serviceAreaSubtitle)}</p>
        </div>
        <ul id="service-cities" class="city-list">${initialCities}</ul>
      </section>

      <section id="quote-form-section" class="section container quote-section">
        <div class="quote-layout">
          <div class="quote-copy">
            <h2 id="form-title">${escapeHtml(text.formTitle)}</h2>
            <p id="form-subtitle">${escapeHtml(text.formSubtitle)}</p>
          </div>
          <form id="quote-form" class="quote-form" name="quote-request" method="POST" data-netlify="true" netlify-honeypot="bot-field">
            <input type="hidden" name="form-name" value="quote-request">
            <p class="honeypot-field">
              <label>Do not fill this out: <input name="bot-field"></label>
            </p>

            <label for="name" id="form-name-label">${escapeHtml(text.formNameLabel)}</label>
            <input id="name" name="name" type="text" required autocomplete="name">

            <label for="phone" id="form-phone-label">${escapeHtml(text.formPhoneLabel)}</label>
            <input id="phone" name="phone" type="tel" required autocomplete="tel">

            <label for="email" id="form-email-label">${escapeHtml(text.formEmailLabel)}</label>
            <input id="email" name="email" type="email" required autocomplete="email">

            <label for="address" id="form-address-label">${escapeHtml(text.formAddressLabel)}</label>
            <input id="address" name="address" type="text" required autocomplete="street-address">

            <label for="cleaning-type" id="form-cleaning-type-label">${escapeHtml(text.formCleaningTypeLabel)}</label>
            <select id="cleaning-type" name="cleaning_type" required>${initialCleaningOptions}</select>

            <label for="message" id="form-message-label">${escapeHtml(text.formMessageLabel)}</label>
            <textarea id="message" name="message" rows="4"></textarea>

            <button id="form-submit" class="btn btn-primary" type="submit">${escapeHtml(text.formSubmit)}</button>
          </form>
        </div>
      </section>

      <section class="section container faq-section">
        <div class="section-heading">
          <h2 id="faq-title">${escapeHtml(text.faqTitle)}</h2>
        </div>
        <div id="faq-list" class="faq-list">${initialFaqs}</div>
      </section>

      <section class="section final-cta">
        <div class="container final-cta-inner">
          <h2 id="final-cta-title">${escapeHtml(text.finalCtaTitle)}</h2>
          <p id="final-cta-subtitle">${escapeHtml(text.finalCtaSubtitle)}</p>
          <div class="final-cta-actions">
            <a class="btn btn-primary" href="#quote-form-section">
              <span id="final-quote-label">${escapeHtml(text.finalCtaQuote)}</span>
            </a>
            <a class="btn btn-call" href="${escapeHtml(config.company.telLink)}">
              <span id="final-call-label">${escapeHtml(text.finalCtaCall)}</span>
            </a>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <p class="footer-brand">${escapeHtml(config.company.name)}</p>
          <p id="footer-tagline">${escapeHtml(text.footerTagline)}</p>
        </div>
        <div>
          <p class="footer-title" id="footer-contact-label">${escapeHtml(text.footerContactLabel)}</p>
          <a href="${escapeHtml(config.company.telLink)}">${escapeHtml(config.company.phone)}</a>
          <a href="mailto:${escapeHtml(config.company.email)}">${escapeHtml(config.company.email)}</a>
          <address>${escapeHtml(config.company.addressStreet)}, ${escapeHtml(config.company.addressCity)}, ${escapeHtml(config.company.addressCountry)}</address>
        </div>
        <div>
          <p class="footer-title" id="footer-hours-label">${escapeHtml(text.footerHoursLabel)}</p>
          <p>${escapeHtml(text.businessHours)}</p>
          <p class="footer-title" id="footer-service-area-label">${escapeHtml(text.footerServiceAreaLabel)}</p>
          <p>${escapeHtml(text.serviceArea)}</p>
        </div>
        <div>
          <p class="footer-title" id="footer-social-label">${escapeHtml(text.footerSocialLabel)}</p>
          <div class="social-links">
            <a href="${escapeHtml(config.company.facebookUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <img src="/public/icon-facebook.svg?v=${assetVersion}" alt="Facebook">
            </a>
            <a href="${escapeHtml(config.company.instagramUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src="/public/icon-instagram.svg?v=${assetVersion}" alt="Instagram">
            </a>
            <a href="${escapeHtml(config.company.googleUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Google Business">
              <img src="/public/icon-google.svg?v=${assetVersion}" alt="Google Business">
            </a>
          </div>
        </div>
      </div>
    </footer>

    <a id="whatsapp-float" class="whatsapp-float" href="https://wa.me/${config.company.whatsappNumber}?text=${encodeURIComponent(text.whatsappMessage)}" target="_blank" rel="noopener noreferrer">
      <img src="/public/icon-whatsapp.svg?v=${assetVersion}" alt="" aria-hidden="true">
      <span>WhatsApp</span>
    </a>

    <script>window.CLEANMASTER_CONFIG = ${safeJson(pageConfig)};</script>
    <script src="/public/app.js?v=${assetVersion}" defer></script>
  </body>
</html>`;
}

function renderRobotsTxt() {
  const siteUrl = value("SITE_URL", "https://www.cleanmaster.example").replace(/\/$/, "");
  return `User-agent: *\nAllow: /\nHost: ${siteUrl}\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

function renderSitemapXml() {
  const siteUrl = value("SITE_URL", "https://www.cleanmaster.example").replace(/\/$/, "");
  const now = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeHtml(siteUrl)}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${escapeHtml(siteUrl)}/de/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${escapeHtml(siteUrl)}/en/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
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
  res.status(200).type("html").send(renderPage(config, config.defaultLanguage, "/"));
});

app.get(["/en", "/en/"], (_req, res) => {
  const config = buildConfig();
  res.status(200).type("html").send(renderPage(config, "en", "/en/"));
});

app.get(["/de", "/de/"], (_req, res) => {
  const config = buildConfig();
  res.status(200).type("html").send(renderPage(config, "de", "/de/"));
});

app.get("/robots.txt", (_req, res) => {
  res.type("text/plain").send(renderRobotsTxt());
});

app.get("/sitemap.xml", (_req, res) => {
  res.type("application/xml").send(renderSitemapXml());
});

if (require.main === module) {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`CleanMaster landing page running on http://localhost:${port}`);
  });
}

module.exports = {
  app,
  buildConfig,
  renderPage,
  renderRobotsTxt,
  renderSitemapXml
};
