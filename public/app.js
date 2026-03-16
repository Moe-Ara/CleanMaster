(function bootstrapLandingPage() {
  const config = window.CLEANMASTER_CONFIG;
  if (!config || !config.content) {
    return;
  }

  const langButtons = Array.from(document.querySelectorAll(".lang-btn"));
  const elements = {
    heroEyebrow: document.getElementById("hero-eyebrow"),
    heroTitle: document.getElementById("hero-title"),
    heroSubtitle: document.getElementById("hero-subtitle"),
    heroQuoteLabel: document.getElementById("hero-quote-label"),
    heroCallLabel: document.getElementById("hero-call-label"),
    heroBadges: document.getElementById("hero-badges"),

    servicesTitle: document.getElementById("services-title"),
    servicesSubtitle: document.getElementById("services-subtitle"),
    servicesGrid: document.getElementById("services-grid"),

    trustTitle: document.getElementById("trust-title"),
    trustSubtitle: document.getElementById("trust-subtitle"),
    trustStats: document.getElementById("trust-stats"),

    reviewsTitle: document.getElementById("reviews-title"),
    reviewsSubtitle: document.getElementById("reviews-subtitle"),
    reviewsGrid: document.getElementById("reviews-grid"),

    beforeAfterTitle: document.getElementById("before-after-title"),
    beforeAfterSubtitle: document.getElementById("before-after-subtitle"),
    beforeLabel: document.getElementById("before-label"),
    afterLabel: document.getElementById("after-label"),

    serviceAreaTitle: document.getElementById("service-area-title"),
    serviceAreaSubtitle: document.getElementById("service-area-subtitle"),
    serviceCities: document.getElementById("service-cities"),

    formTitle: document.getElementById("form-title"),
    formSubtitle: document.getElementById("form-subtitle"),
    formNameLabel: document.getElementById("form-name-label"),
    formPhoneLabel: document.getElementById("form-phone-label"),
    formEmailLabel: document.getElementById("form-email-label"),
    formAddressLabel: document.getElementById("form-address-label"),
    formCleaningTypeLabel: document.getElementById("form-cleaning-type-label"),
    formMessageLabel: document.getElementById("form-message-label"),
    formSubmit: document.getElementById("form-submit"),
    cleaningTypeSelect: document.getElementById("cleaning-type"),

    faqTitle: document.getElementById("faq-title"),
    faqList: document.getElementById("faq-list"),

    finalCtaTitle: document.getElementById("final-cta-title"),
    finalCtaSubtitle: document.getElementById("final-cta-subtitle"),
    finalQuoteLabel: document.getElementById("final-quote-label"),
    finalCallLabel: document.getElementById("final-call-label"),

    footerTagline: document.getElementById("footer-tagline"),
    footerContactLabel: document.getElementById("footer-contact-label"),
    footerHoursLabel: document.getElementById("footer-hours-label"),
    footerServiceAreaLabel: document.getElementById("footer-service-area-label"),
    footerSocialLabel: document.getElementById("footer-social-label"),
    whatsappFloat: document.getElementById("whatsapp-float")
  };

  const meta = {
    description: document.getElementById("meta-description"),
    keywords: document.getElementById("meta-keywords"),
    ogTitle: document.getElementById("og-title"),
    ogDescription: document.getElementById("og-description"),
    twTitle: document.getElementById("twitter-title"),
    twDescription: document.getElementById("twitter-description")
  };

  const iconPaths = {
    service: ["/public/icon-sparkle.svg", "/public/icon-shield.svg", "/public/icon-calendar.svg"]
  };

  let currentLang = config.defaultLanguage === "de" ? "de" : "en";

  function iconFor(index) {
    const iconPath = iconPaths.service[index % iconPaths.service.length];
    const version = encodeURIComponent(config.assetVersion || "1");
    return `${iconPath}?v=${version}`;
  }

  function buildWhatsappLink(lang) {
    const text = config.content[lang].whatsappMessage || "";
    return `https://wa.me/${config.company.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }

  function setSeo(lang) {
    const seo = config.seo[lang];
    if (!seo) {
      return;
    }
    document.title = seo.title;
    if (meta.description) {
      meta.description.setAttribute("content", seo.description);
    }
    if (meta.keywords) {
      meta.keywords.setAttribute("content", seo.keywords);
    }
    if (meta.ogTitle) {
      meta.ogTitle.setAttribute("content", seo.title);
    }
    if (meta.ogDescription) {
      meta.ogDescription.setAttribute("content", seo.description);
    }
    if (meta.twTitle) {
      meta.twTitle.setAttribute("content", seo.title);
    }
    if (meta.twDescription) {
      meta.twDescription.setAttribute("content", seo.description);
    }
  }

  function renderHeroBadges(items) {
    elements.heroBadges.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "hero-badge-item";
      li.textContent = item;
      elements.heroBadges.appendChild(li);
    });
  }

  function renderServices(cards) {
    elements.servicesGrid.innerHTML = "";
    cards.forEach((cardData, index) => {
      const card = document.createElement("article");
      card.className = "service-card";

      const icon = document.createElement("img");
      icon.className = "service-card-icon";
      icon.src = iconFor(index);
      icon.alt = "";
      icon.setAttribute("aria-hidden", "true");

      const title = document.createElement("h3");
      title.textContent = cardData.title;

      const desc = document.createElement("p");
      desc.textContent = cardData.description;

      card.appendChild(icon);
      card.appendChild(title);
      card.appendChild(desc);
      elements.servicesGrid.appendChild(card);
    });
  }

  function renderTrustStats(stats) {
    elements.trustStats.innerHTML = "";
    stats.forEach((item) => {
      const card = document.createElement("article");
      card.className = "trust-stat-card";

      const value = document.createElement("p");
      value.className = "trust-stat-value";
      value.textContent = item.value;

      const label = document.createElement("p");
      label.className = "trust-stat-label";
      label.textContent = item.label;

      card.appendChild(value);
      card.appendChild(label);
      elements.trustStats.appendChild(card);
    });
  }

  function renderReviews(reviews) {
    elements.reviewsGrid.innerHTML = "";
    reviews.slice(0, 3).forEach((review) => {
      const card = document.createElement("article");
      card.className = "testimonial-card";

      const stars = document.createElement("p");
      stars.className = "testimonial-stars";
      const rating = Math.max(1, Math.min(5, Number(review.rating) || 5));
      stars.textContent = `${"\u2605".repeat(rating)}${"\u2606".repeat(5 - rating)}`;

      const text = document.createElement("p");
      text.className = "testimonial-text";
      text.textContent = `"${review.text}"`;

      const name = document.createElement("p");
      name.className = "testimonial-name";
      name.textContent = review.name;

      card.appendChild(stars);
      card.appendChild(text);
      card.appendChild(name);
      elements.reviewsGrid.appendChild(card);
    });
  }

  function renderCities(cities) {
    elements.serviceCities.innerHTML = "";
    cities.forEach((city) => {
      const li = document.createElement("li");
      li.className = "city-chip";
      li.textContent = city;
      elements.serviceCities.appendChild(li);
    });
  }

  function renderCleaningTypes(items) {
    elements.cleaningTypeSelect.innerHTML = "";
    items.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      elements.cleaningTypeSelect.appendChild(option);
    });
  }

  function renderFaqs(items) {
    elements.faqList.innerHTML = "";
    items.forEach((item) => {
      const details = document.createElement("details");
      details.className = "faq-item";

      const summary = document.createElement("summary");
      summary.textContent = item.question;

      const answer = document.createElement("p");
      answer.textContent = item.answer;

      details.appendChild(summary);
      details.appendChild(answer);
      elements.faqList.appendChild(details);
    });
  }

  function updateLanguageButtons(lang) {
    langButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.lang === lang);
    });
  }

  function render(lang) {
    const content = config.content[lang];
    if (!content) {
      return;
    }

    document.documentElement.lang = lang;

    elements.heroEyebrow.textContent = content.heroEyebrow;
    elements.heroTitle.textContent = content.heroTitle;
    elements.heroSubtitle.textContent = content.heroSubtitle;
    elements.heroQuoteLabel.textContent = content.ctaQuote;
    elements.heroCallLabel.textContent = content.ctaCall;

    elements.servicesTitle.textContent = content.servicesTitle;
    elements.servicesSubtitle.textContent = content.servicesSubtitle;

    elements.trustTitle.textContent = content.trustTitle;
    elements.trustSubtitle.textContent = content.trustSubtitle;

    elements.reviewsTitle.textContent = content.reviewsTitle;
    elements.reviewsSubtitle.textContent = content.reviewsSubtitle;

    elements.beforeAfterTitle.textContent = content.beforeAfterTitle;
    elements.beforeAfterSubtitle.textContent = content.beforeAfterSubtitle;
    elements.beforeLabel.textContent = content.beforeLabel;
    elements.afterLabel.textContent = content.afterLabel;

    elements.serviceAreaTitle.textContent = content.serviceAreaTitle;
    elements.serviceAreaSubtitle.textContent = content.serviceAreaSubtitle;

    elements.formTitle.textContent = content.formTitle;
    elements.formSubtitle.textContent = content.formSubtitle;
    elements.formNameLabel.textContent = content.formNameLabel;
    elements.formPhoneLabel.textContent = content.formPhoneLabel;
    elements.formEmailLabel.textContent = content.formEmailLabel;
    elements.formAddressLabel.textContent = content.formAddressLabel;
    elements.formCleaningTypeLabel.textContent = content.formCleaningTypeLabel;
    elements.formMessageLabel.textContent = content.formMessageLabel;
    elements.formSubmit.textContent = content.formSubmit;
    elements.faqTitle.textContent = content.faqTitle;

    elements.finalCtaTitle.textContent = content.finalCtaTitle;
    elements.finalCtaSubtitle.textContent = content.finalCtaSubtitle;
    elements.finalQuoteLabel.textContent = content.finalCtaQuote;
    elements.finalCallLabel.textContent = content.finalCtaCall;

    elements.footerTagline.textContent = content.footerTagline;
    elements.footerContactLabel.textContent = content.footerContactLabel;
    elements.footerHoursLabel.textContent = content.footerHoursLabel;
    elements.footerServiceAreaLabel.textContent = content.footerServiceAreaLabel;
    elements.footerSocialLabel.textContent = content.footerSocialLabel;

    elements.whatsappFloat.href = buildWhatsappLink(lang);

    renderHeroBadges(content.heroBadges);
    renderServices(content.serviceCards);
    renderTrustStats(content.trustStats);
    renderReviews(content.reviews);
    renderCities(content.serviceCities);
    renderCleaningTypes(content.cleaningTypes);
    renderFaqs(content.faqItems);

    setSeo(lang);
    updateLanguageButtons(lang);
  }

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextLang = button.dataset.lang === "de" ? "de" : "en";
      const targetPath = nextLang === "de" ? "/de/" : "/en/";
      if (window.location.pathname === targetPath || window.location.pathname === targetPath.slice(0, -1)) {
        return;
      }
      window.location.href = targetPath;
    });
  });

  render(currentLang);
})();
