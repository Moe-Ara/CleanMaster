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
    serviceModal: document.getElementById("service-modal"),
    serviceModalBackdrop: document.getElementById("service-modal-backdrop"),
    serviceModalIcon: document.getElementById("service-modal-icon"),
    serviceModalTitle: document.getElementById("service-modal-title"),
    serviceModalDescription: document.getElementById("service-modal-description"),
    serviceModalLabel: document.getElementById("service-modal-label"),
    serviceModalCloseBtn: document.getElementById("service-modal-close-btn"),
    serviceModalCloseText: document.getElementById("service-modal-close-text"),

    trustTitle: document.getElementById("trust-title"),
    trustSubtitle: document.getElementById("trust-subtitle"),
    trustStats: document.getElementById("trust-stats"),

    reviewsTitle: document.getElementById("reviews-title"),
    reviewsSubtitle: document.getElementById("reviews-subtitle"),
    reviewsGrid: document.getElementById("reviews-grid"),
    reviewsSlider: document.getElementById("reviews-slider"),
    reviewsPrev: document.getElementById("reviews-prev"),
    reviewsNext: document.getElementById("reviews-next"),
    reviewsDots: document.getElementById("reviews-dots"),

    serviceAreaTitle: document.getElementById("service-area-title"),
    serviceAreaSubtitle: document.getElementById("service-area-subtitle"),
    serviceCities: document.getElementById("service-cities"),

    formTitle: document.getElementById("form-title"),
    formSubtitle: document.getElementById("form-subtitle"),
    formNameLabel: document.getElementById("form-name-label"),
    formPhoneLabel: document.getElementById("form-phone-label"),
    formEmailLabel: document.getElementById("form-email-label"),
    formAddressLabel: document.getElementById("form-address-label"),
    formServiceTypeLabel: document.getElementById("form-service-type-label"),
    formMessageLabel: document.getElementById("form-message-label"),
    formSubmit: document.getElementById("form-submit"),
    serviceTypeSelect: document.getElementById("service-type"),

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

  const serviceIconFallbacks = [
    "/public/icon-service-cleaning.svg",
    "/public/icon-service-painting.svg",
    "/public/icon-service-decor.svg",
    "/public/icon-service-gardening.svg",
    "/public/icon-service-maintenance.svg"
  ];

  const serviceBackgroundPaths = [
    "/public/service-bg-cleaning.svg",
    "/public/service-bg-painting.svg",
    "/public/service-bg-decor.svg",
    "/public/service-bg-gardening.svg",
    "/public/service-bg-maintenance.svg"
  ];

  const servicePhotoFallbacks = [
    "/public/service-photo-cleaning.jpg",
    "/public/service-photo-painting.jpg",
    "/public/service-photo-decor.jpg",
    "/public/service-photo-gardening.jpg",
    "/public/service-photo-maintenance.jpg"
  ];

  let currentLang = config.defaultLanguage === "de" ? "de" : "en";
  let currentReviews = [];
  let reviewSlideIndex = 0;
  let reviewAutoplayTimer = null;
  let lastFocusedServiceCard = null;
  const reviewAutoplayDelayMs = 4500;

  function serviceIconFor(index, title) {
    const normalized = String(title || "").toLowerCase();
    if (normalized.includes("paint") || normalized.includes("maler")) {
      return versionedAsset("/public/icon-service-painting.svg");
    }
    if (
      normalized.includes("decor") ||
      normalized.includes("dekor") ||
      normalized.includes("styling") ||
      normalized.includes("design")
    ) {
      return versionedAsset("/public/icon-service-decor.svg");
    }
    if (normalized.includes("garden") || normalized.includes("garten")) {
      return versionedAsset("/public/icon-service-gardening.svg");
    }
    if (
      normalized.includes("maintenance") ||
      normalized.includes("objekt") ||
      normalized.includes("instand") ||
      normalized.includes("repair")
    ) {
      return versionedAsset("/public/icon-service-maintenance.svg");
    }
    if (normalized.includes("clean") || normalized.includes("reinig")) {
      return versionedAsset("/public/icon-service-cleaning.svg");
    }
    const iconPath = serviceIconFallbacks[index % serviceIconFallbacks.length];
    return versionedAsset(iconPath);
  }

  function versionedAsset(path) {
    const version = encodeURIComponent(config.assetVersion || "1");
    return `${path}?v=${version}`;
  }

  function serviceBackgroundFor(index) {
    const imagePath = serviceBackgroundPaths[index % serviceBackgroundPaths.length];
    const version = encodeURIComponent(config.assetVersion || "1");
    return `${imagePath}?v=${version}`;
  }

  function servicePhotoFor(index, title) {
    const normalized = String(title || "").toLowerCase();
    if (normalized.includes("paint") || normalized.includes("maler")) {
      return versionedAsset("/public/service-photo-painting.jpg");
    }
    if (
      normalized.includes("decor") ||
      normalized.includes("dekor") ||
      normalized.includes("styling") ||
      normalized.includes("design")
    ) {
      return versionedAsset("/public/service-photo-decor.jpg");
    }
    if (normalized.includes("garden") || normalized.includes("garten")) {
      return versionedAsset("/public/service-photo-gardening.jpg");
    }
    if (
      normalized.includes("maintenance") ||
      normalized.includes("objekt") ||
      normalized.includes("instand") ||
      normalized.includes("repair")
    ) {
      return versionedAsset("/public/service-photo-maintenance.jpg");
    }
    if (normalized.includes("clean") || normalized.includes("reinig")) {
      return versionedAsset("/public/service-photo-cleaning.jpg");
    }
    const imagePath = servicePhotoFallbacks[index % servicePhotoFallbacks.length];
    return versionedAsset(imagePath);
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

  function renderServices(cards, details) {
    elements.servicesGrid.innerHTML = "";
    cards.forEach((cardData, index) => {
      const card = document.createElement("button");
      card.className = "service-card service-card-button";
      card.type = "button";
      card.setAttribute("aria-haspopup", "dialog");
      card.dataset.serviceTitle = cardData.title;
      card.dataset.serviceDescription = cardData.description;
      card.dataset.serviceDetail = details[index] || cardData.description;
      card.dataset.serviceIcon = serviceIconFor(index, cardData.title);
      card.style.setProperty("--service-bg", `url("${serviceBackgroundFor(index)}")`);

      const photo = document.createElement("img");
      photo.className = "service-card-photo";
      photo.src = servicePhotoFor(index, cardData.title);
      photo.alt = cardData.title;
      photo.loading = "lazy";
      photo.decoding = "async";
      photo.width = 900;
      photo.height = 600;

      const title = document.createElement("h3");
      title.textContent = cardData.title;

      const desc = document.createElement("p");
      desc.textContent = cardData.description;

      card.appendChild(photo);
      card.appendChild(title);
      card.appendChild(desc);
      elements.servicesGrid.appendChild(card);
    });
  }

  function openServiceModal(title, description, iconSrc, triggerElement) {
    if (!elements.serviceModal || !elements.serviceModalTitle || !elements.serviceModalDescription) {
      return;
    }
    lastFocusedServiceCard = triggerElement instanceof HTMLElement ? triggerElement : null;
    if (elements.serviceModalIcon) {
      elements.serviceModalIcon.src = iconSrc || "";
      elements.serviceModalIcon.hidden = !iconSrc;
    }
    elements.serviceModalTitle.textContent = title;
    elements.serviceModalDescription.textContent = description;
    elements.serviceModal.hidden = false;
    elements.serviceModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (elements.serviceModalCloseBtn) {
      elements.serviceModalCloseBtn.focus();
    }
  }

  function closeServiceModal() {
    if (!elements.serviceModal) {
      return;
    }
    elements.serviceModal.hidden = true;
    elements.serviceModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocusedServiceCard) {
      lastFocusedServiceCard.focus();
    }
  }

  function setupServiceModalEvents() {
    if (!elements.servicesGrid || !elements.serviceModal) {
      return;
    }

    elements.servicesGrid.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const card = target.closest(".service-card");
      if (!(card instanceof HTMLElement)) {
        return;
      }
      const title = card.dataset.serviceTitle || card.querySelector("h3")?.textContent || "";
      const description = card.dataset.serviceDetail || card.dataset.serviceDescription || card.querySelector("p")?.textContent || "";
      const iconSrc = card.dataset.serviceIcon || "";
      openServiceModal(title, description, iconSrc, card);
    });

    if (elements.serviceModalCloseBtn) {
      elements.serviceModalCloseBtn.addEventListener("click", closeServiceModal);
    }
    if (elements.serviceModalBackdrop) {
      elements.serviceModalBackdrop.addEventListener("click", closeServiceModal);
    }
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !elements.serviceModal.hidden) {
        closeServiceModal();
      }
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

  function cardsPerReviewSlide() {
    if (window.innerWidth >= 980) {
      return 3;
    }
    if (window.innerWidth >= 720) {
      return 2;
    }
    return 1;
  }

  function maxReviewSlideIndex() {
    return Math.max(0, currentReviews.length - cardsPerReviewSlide());
  }

  function renderReviewDots(maxIndex) {
    if (!elements.reviewsDots) {
      return;
    }

    elements.reviewsDots.innerHTML = "";
    for (let index = 0; index <= maxIndex; index += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `reviews-dot ${index === reviewSlideIndex ? "active" : ""}`;
      dot.dataset.index = String(index);
      dot.setAttribute("aria-label", `Go to review slide ${index + 1}`);
      elements.reviewsDots.appendChild(dot);
    }
  }

  function syncReviewSliderPosition() {
    if (!elements.reviewsGrid || !elements.reviewsSlider) {
      return;
    }

    const perSlide = cardsPerReviewSlide();
    elements.reviewsSlider.style.setProperty("--cards-per-view", String(perSlide));

    const maxIndex = Math.max(0, currentReviews.length - perSlide);
    reviewSlideIndex = Math.max(0, Math.min(reviewSlideIndex, maxIndex));

    const firstCard = elements.reviewsGrid.querySelector(".testimonial-card");
    if (!firstCard) {
      elements.reviewsGrid.style.transform = "translateX(0)";
      renderReviewDots(0);
      return;
    }

    const styles = window.getComputedStyle(elements.reviewsGrid);
    const gapValue = styles.columnGap && styles.columnGap !== "normal" ? styles.columnGap : styles.gap;
    const gapPx = Number.parseFloat(gapValue) || 0;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const offset = reviewSlideIndex * (cardWidth + gapPx);
    elements.reviewsGrid.style.transform = `translateX(-${offset}px)`;
    renderReviewDots(maxIndex);
  }

  function stopReviewAutoplay() {
    if (reviewAutoplayTimer) {
      window.clearInterval(reviewAutoplayTimer);
      reviewAutoplayTimer = null;
    }
  }

  function goToReviewSlide(index) {
    reviewSlideIndex = Math.max(0, Math.min(index, maxReviewSlideIndex()));
    syncReviewSliderPosition();
  }

  function startReviewAutoplay() {
    stopReviewAutoplay();
    if (maxReviewSlideIndex() === 0) {
      return;
    }

    reviewAutoplayTimer = window.setInterval(() => {
      const maxIndex = maxReviewSlideIndex();
      const nextIndex = reviewSlideIndex >= maxIndex ? 0 : reviewSlideIndex + 1;
      goToReviewSlide(nextIndex);
    }, reviewAutoplayDelayMs);
  }

  function setupReviewSliderEvents() {
    if (!elements.reviewsSlider || !elements.reviewsPrev || !elements.reviewsNext || !elements.reviewsDots) {
      return;
    }

    elements.reviewsPrev.addEventListener("click", () => {
      goToReviewSlide(reviewSlideIndex - 1);
      startReviewAutoplay();
    });

    elements.reviewsNext.addEventListener("click", () => {
      goToReviewSlide(reviewSlideIndex + 1);
      startReviewAutoplay();
    });

    elements.reviewsDots.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || !target.classList.contains("reviews-dot")) {
        return;
      }
      const requestedIndex = Number.parseInt(target.dataset.index || "0", 10);
      goToReviewSlide(requestedIndex);
      startReviewAutoplay();
    });

    elements.reviewsSlider.addEventListener("mouseenter", stopReviewAutoplay);
    elements.reviewsSlider.addEventListener("mouseleave", startReviewAutoplay);
    elements.reviewsSlider.addEventListener("focusin", stopReviewAutoplay);
    elements.reviewsSlider.addEventListener("focusout", (event) => {
      if (!(event.relatedTarget instanceof Node) || !elements.reviewsSlider.contains(event.relatedTarget)) {
        startReviewAutoplay();
      }
    });

    let resizeFrame = 0;
    window.addEventListener("resize", () => {
      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame);
      }
      resizeFrame = window.requestAnimationFrame(() => {
        syncReviewSliderPosition();
      });
    });
  }

  function renderReviews(reviews) {
    currentReviews = reviews.slice();
    reviewSlideIndex = 0;
    elements.reviewsGrid.innerHTML = "";
    reviews.forEach((review) => {
      const card = document.createElement("article");
      card.className = "testimonial-card";

      const head = document.createElement("div");
      head.className = "testimonial-head";

      const avatar = document.createElement("img");
      avatar.className = "testimonial-avatar";
      avatar.src = versionedAsset(review.image || "/public/avatar-placeholder.svg");
      avatar.alt = review.name;
      avatar.loading = "lazy";
      avatar.decoding = "async";
      avatar.width = 56;
      avatar.height = 56;

      const identity = document.createElement("div");

      const name = document.createElement("p");
      name.className = "testimonial-name";
      name.textContent = review.name;

      const stars = document.createElement("p");
      stars.className = "testimonial-stars";
      const rating = Math.max(1, Math.min(5, Number(review.rating) || 5));
      stars.textContent = `${"\u2605".repeat(rating)}${"\u2606".repeat(5 - rating)}`;

      const text = document.createElement("p");
      text.className = "testimonial-text";
      text.textContent = `"${review.text}"`;

      identity.appendChild(name);
      identity.appendChild(stars);
      head.appendChild(avatar);
      head.appendChild(identity);
      card.appendChild(head);
      card.appendChild(text);
      elements.reviewsGrid.appendChild(card);
    });

    syncReviewSliderPosition();
    startReviewAutoplay();
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

  function renderServiceTypes(items) {
    elements.serviceTypeSelect.innerHTML = "";
    items.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      elements.serviceTypeSelect.appendChild(option);
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
    if (elements.serviceModalLabel) {
      elements.serviceModalLabel.textContent = content.serviceModalLabel;
    }
    if (elements.serviceModalCloseText) {
      elements.serviceModalCloseText.textContent = content.serviceModalClose;
    }
    if (elements.serviceModalCloseBtn) {
      elements.serviceModalCloseBtn.setAttribute("aria-label", content.serviceModalClose);
    }

    elements.trustTitle.textContent = content.trustTitle;
    elements.trustSubtitle.textContent = content.trustSubtitle;

    elements.reviewsTitle.textContent = content.reviewsTitle;
    elements.reviewsSubtitle.textContent = content.reviewsSubtitle;

    elements.serviceAreaTitle.textContent = content.serviceAreaTitle;
    elements.serviceAreaSubtitle.textContent = content.serviceAreaSubtitle;

    elements.formTitle.textContent = content.formTitle;
    elements.formSubtitle.textContent = content.formSubtitle;
    elements.formNameLabel.textContent = content.formNameLabel;
    elements.formPhoneLabel.textContent = content.formPhoneLabel;
    elements.formEmailLabel.textContent = content.formEmailLabel;
    elements.formAddressLabel.textContent = content.formAddressLabel;
    elements.formServiceTypeLabel.textContent = content.formServiceTypeLabel;
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
    renderServices(content.serviceCards, content.serviceDetails || []);
    renderTrustStats(content.trustStats);
    renderReviews(content.reviews);
    renderCities(content.serviceCities);
    renderServiceTypes(content.serviceTypes);
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

  setupServiceModalEvents();
  setupReviewSliderEvents();
  render(currentLang);
})();
