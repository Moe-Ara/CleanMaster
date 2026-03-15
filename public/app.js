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
    heroVisualTag: document.getElementById("hero-visual-tag"),
    heroVisualSubtag: document.getElementById("hero-visual-subtag"),
    trustList: document.getElementById("trust-list"),
    whatsappBtn: document.getElementById("whatsapp-btn"),
    whatsappBtnLabel: document.getElementById("whatsapp-btn-label"),
    emailBtn: document.getElementById("email-btn"),
    emailBtnLabel: document.getElementById("email-btn-label"),
    stepsTitle: document.getElementById("steps-title"),
    stepsSubtitle: document.getElementById("steps-subtitle"),
    stepsList: document.getElementById("steps-list"),
    benefitsTitle: document.getElementById("benefits-title"),
    benefitsSubtitle: document.getElementById("benefits-subtitle"),
    benefitsList: document.getElementById("benefits-list"),
    contactTitle: document.getElementById("contact-title"),
    contactSubtitle: document.getElementById("contact-subtitle"),
    phoneLabel: document.getElementById("phone-label"),
    emailLabel: document.getElementById("email-label"),
    addressLabel: document.getElementById("address-label"),
    hoursLabel: document.getElementById("hours-label"),
    serviceAreaLabel: document.getElementById("service-area-label"),
    hoursText: document.getElementById("hours-text"),
    serviceAreaText: document.getElementById("service-area-text"),
    servicesTitle: document.getElementById("services-title"),
    servicesSubtitle: document.getElementById("services-subtitle"),
    servicesList: document.getElementById("services-list"),
    reviewsTitle: document.getElementById("reviews-title"),
    reviewsSubtitle: document.getElementById("reviews-subtitle"),
    reviewsTrack: document.getElementById("reviews-track"),
    footerLine: document.getElementById("footer-line")
  };

  const meta = {
    description: document.getElementById("meta-description"),
    keywords: document.getElementById("meta-keywords"),
    ogTitle: document.getElementById("og-title"),
    ogDescription: document.getElementById("og-description"),
    twTitle: document.getElementById("twitter-title"),
    twDescription: document.getElementById("twitter-description")
  };

  let currentLang = config.defaultLanguage === "de" ? "de" : "en";
  let reviewIndex = 0;
  let reviewTimer = null;
  const iconPaths = {
    service: ["/public/icon-sparkle.svg", "/public/icon-shield.svg", "/public/icon-calendar.svg"],
    step: ["/public/icon-calendar.svg", "/public/icon-sparkle.svg", "/public/icon-shield.svg"],
    benefit: ["/public/icon-shield.svg", "/public/icon-sparkle.svg", "/public/icon-calendar.svg"]
  };

  function iconFor(type, index) {
    const list = iconPaths[type] || [];
    if (!list.length) {
      return "";
    }
    const iconPath = list[index % list.length];
    const version = encodeURIComponent(config.assetVersion || "1");
    return `${iconPath}?v=${version}`;
  }

  function buildWhatsappLink(lang) {
    const text = config.content[lang].whatsappMessage || "";
    return `https://wa.me/${config.company.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }

  function buildEmailLink(lang) {
    const subject = config.content[lang].emailSubject || "";
    return `mailto:${config.company.email}?subject=${encodeURIComponent(subject)}`;
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

  function renderServices(services) {
    elements.servicesList.innerHTML = "";
    services.forEach((service, index) => {
      const item = document.createElement("li");
      item.className = "service-item";
      const icon = document.createElement("img");
      icon.className = "list-icon";
      icon.src = iconFor("service", index);
      icon.alt = "";
      icon.setAttribute("aria-hidden", "true");

      const label = document.createElement("span");
      label.textContent = service;

      item.appendChild(icon);
      item.appendChild(label);
      elements.servicesList.appendChild(item);
    });
  }

  function renderTrust(points) {
    elements.trustList.innerHTML = "";
    points.forEach((point) => {
      const item = document.createElement("li");
      item.className = "trust-item";
      item.textContent = point;
      elements.trustList.appendChild(item);
    });
  }

  function renderSteps(container, items) {
    container.innerHTML = "";
    items.forEach((itemText, index) => {
      const card = document.createElement("article");
      card.className = "flow-card";

      const top = document.createElement("div");
      top.className = "card-top";

      const badge = document.createElement("span");
      badge.className = "step-index";
      badge.textContent = `0${index + 1}`;

      const icon = document.createElement("img");
      icon.className = "flow-icon";
      icon.src = iconFor("step", index);
      icon.alt = "";
      icon.setAttribute("aria-hidden", "true");

      const text = document.createElement("p");
      text.className = "flow-text";
      text.textContent = itemText;

      top.appendChild(badge);
      top.appendChild(icon);
      card.appendChild(top);
      card.appendChild(text);
      container.appendChild(card);
    });
  }

  function renderBenefits(container, items) {
    container.innerHTML = "";
    items.forEach((itemText, index) => {
      const card = document.createElement("article");
      card.className = "benefit-card";

      const top = document.createElement("div");
      top.className = "card-top";

      const icon = document.createElement("img");
      icon.className = "flow-icon";
      icon.src = iconFor("benefit", index);
      icon.alt = "";
      icon.setAttribute("aria-hidden", "true");

      const text = document.createElement("p");
      text.className = "benefit-text";
      text.textContent = itemText;

      top.appendChild(icon);
      card.appendChild(top);
      card.appendChild(text);
      container.appendChild(card);
    });
  }

  function createReviewCard(review) {
    const card = document.createElement("article");
    card.className = "review-card";

    const header = document.createElement("div");
    header.className = "review-header";

    const avatar = document.createElement("img");
    avatar.className = "review-avatar";
    avatar.loading = "lazy";
    avatar.alt = `${review.name} profile picture`;
    avatar.src = review.image || config.company.defaultReviewAvatar;
    avatar.addEventListener("error", () => {
      avatar.src = config.company.defaultReviewAvatar;
    });

    const name = document.createElement("p");
    name.className = "review-name";
    name.textContent = review.name;

    const rating = document.createElement("p");
    rating.className = "review-rating";
    const clamped = Math.max(1, Math.min(5, Number(review.rating) || 5));
    rating.textContent = `${"\u2605".repeat(clamped)}${"\u2606".repeat(5 - clamped)}`;

    const identity = document.createElement("div");
    identity.appendChild(name);
    identity.appendChild(rating);

    header.appendChild(avatar);
    header.appendChild(identity);

    const text = document.createElement("p");
    text.className = "review-text";
    text.textContent = `"${review.text}"`;

    card.appendChild(header);
    card.appendChild(text);
    return card;
  }

  function jumpToReview(index) {
    elements.reviewsTrack.style.transform = `translateX(-${index * 100}%)`;
  }

  function renderReviews(reviews) {
    elements.reviewsTrack.innerHTML = "";
    reviews.forEach((review) => {
      elements.reviewsTrack.appendChild(createReviewCard(review));
    });

    if (reviewTimer) {
      clearInterval(reviewTimer);
      reviewTimer = null;
    }

    reviewIndex = 0;
    jumpToReview(0);

    if (reviews.length > 1) {
      reviewTimer = setInterval(() => {
        reviewIndex = (reviewIndex + 1) % reviews.length;
        jumpToReview(reviewIndex);
      }, 4200);
    }
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
    elements.heroVisualTag.textContent = content.heroVisualTag;
    elements.heroVisualSubtag.textContent = content.heroVisualSubtag;
    elements.stepsTitle.textContent = content.stepsTitle;
    elements.stepsSubtitle.textContent = content.stepsSubtitle;
    elements.benefitsTitle.textContent = content.benefitsTitle;
    elements.benefitsSubtitle.textContent = content.benefitsSubtitle;
    elements.contactTitle.textContent = content.contactTitle;
    elements.contactSubtitle.textContent = content.contactSubtitle;
    elements.phoneLabel.textContent = content.phoneLabel;
    elements.emailLabel.textContent = content.emailLabel;
    elements.addressLabel.textContent = content.addressLabel;
    elements.hoursLabel.textContent = content.hoursLabel;
    elements.serviceAreaLabel.textContent = content.serviceAreaLabel;
    elements.hoursText.textContent = content.businessHours;
    elements.serviceAreaText.textContent = content.serviceArea;
    elements.servicesTitle.textContent = content.servicesTitle;
    elements.servicesSubtitle.textContent = content.servicesSubtitle;
    elements.reviewsTitle.textContent = content.reviewsTitle;
    elements.reviewsSubtitle.textContent = content.reviewsSubtitle;
    elements.footerLine.textContent = content.footerLine;

    elements.whatsappBtnLabel.textContent = content.ctaWhatsapp;
    elements.emailBtnLabel.textContent = content.ctaEmail;
    elements.whatsappBtn.href = buildWhatsappLink(lang);
    elements.emailBtn.href = buildEmailLink(lang);

    renderTrust(content.trustPoints);
    renderSteps(elements.stepsList, content.steps);
    renderBenefits(elements.benefitsList, content.benefits);
    renderServices(content.services);
    renderReviews(content.reviews);
    setSeo(lang);
    updateLanguageButtons(lang);
  }

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextLang = button.dataset.lang === "de" ? "de" : "en";
      if (nextLang === currentLang) {
        return;
      }
      currentLang = nextLang;
      render(currentLang);
    });
  });

  render(currentLang);
})();
