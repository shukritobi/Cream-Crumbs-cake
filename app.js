(() => {
  "use strict";

  // Add the owner's WhatsApp number in international format without + or spaces.
  // Example: "60123456789". When blank, the demo opens WhatsApp's share composer.
  const WHATSAPP_NUMBER = "";
  const INSTAGRAM_URL = "https://www.instagram.com/creamnco.my/";

  const q = (selector, scope = document) => scope.querySelector(selector);
  const qa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const assets = window.CREAM_ASSETS || {};
  assets.cake3 ||= assets.cake1;
  assets.cake4 ||= assets.cake1;
  assets.cake5 ||= assets.cake6;
  qa("img[data-asset]").forEach((image) => {
    const key = image.dataset.asset;
    if (assets[key]) image.src = assets[key];
  });

  q("#year").textContent = new Date().getFullYear();

  const menuButton = q(".menu-button");
  const mobileNav = q("#mobile-nav");
  const closeMenu = () => {
    mobileNav.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  menuButton.addEventListener("click", () => {
    const opening = mobileNav.hidden;
    mobileNav.hidden = !opening;
    menuButton.setAttribute("aria-expanded", String(opening));
    document.body.style.overflow = opening ? "hidden" : "";
  });
  qa("a, button", mobileNav).forEach((item) => item.addEventListener("click", closeMenu));

  qa(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      qa(".filter-button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      qa(".gallery-card").forEach((card) => {
        const visible = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !visible);
      });
    });
  });

  const dialog = q("#booking-dialog");
  const form = q("#booking-form");
  const steps = qa(".form-step", form);
  const nextButton = q("#next-step");
  const previousButton = q("#prev-step");
  const submitButton = q("#submit-booking");
  const errorBox = q("#form-error");
  const progressBar = q("#progress-bar");
  const stepLabel = q("#step-label");
  const stepName = q("#step-name");
  const summary = q("#booking-summary");
  const stepNames = ["Date & delivery", "Cake details", "Design direction", "Review & send"];
  let currentStep = 1;

  const dateInput = form.elements.date;
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 4);
  const toDateValue = (date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };
  dateInput.min = toDateValue(minDate);

  function setStep(step) {
    currentStep = Math.max(1, Math.min(steps.length, step));
    steps.forEach((section, index) => section.classList.toggle("active", index === currentStep - 1));
    previousButton.hidden = currentStep === 1;
    nextButton.hidden = currentStep === steps.length;
    submitButton.hidden = currentStep !== steps.length;
    progressBar.style.width = `${(currentStep / steps.length) * 100}%`;
    stepLabel.textContent = `Step ${currentStep} of ${steps.length}`;
    stepName.textContent = stepNames[currentStep - 1];
    errorBox.textContent = "";
    if (currentStep === steps.length) buildSummary();
    q(".dialog-shell").scrollTo({ top: 0, behavior: "smooth" });
  }

  function validateCurrentStep() {
    const current = steps[currentStep - 1];
    const required = qa("[required]", current);
    for (const input of required) {
      if (!input.checkValidity()) {
        input.reportValidity();
        errorBox.textContent = "Please complete the highlighted detail before continuing.";
        return false;
      }
    }
    if (currentStep === 1 && dateInput.value && dateInput.value < dateInput.min) {
      errorBox.textContent = "Please choose a date at least four days from today.";
      dateInput.focus();
      return false;
    }
    return true;
  }

  const value = (name) => form.elements[name]?.value?.trim() || "—";
  function buildSummary() {
    summary.innerHTML = `
      <h3>Your enquiry summary</h3>
      <div class="summary-grid">
        <div><small>Order</small><strong>${escapeHtml(value("orderType"))}</strong></div>
        <div><small>Date</small><strong>${escapeHtml(formatDate(value("date")))}</strong></div>
        <div><small>Occasion</small><strong>${escapeHtml(value("occasion"))}</strong></div>
        <div><small>Area</small><strong>${escapeHtml(value("area"))}</strong></div>
        <div><small>Servings</small><strong>${escapeHtml(value("servings"))}</strong></div>
        <div><small>Style</small><strong>${escapeHtml(value("style"))}</strong></div>
        <div><small>Flavour</small><strong>${escapeHtml(value("flavour"))}</strong></div>
        <div><small>Budget</small><strong>${escapeHtml(value("budget"))}</strong></div>
      </div>`;
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
  }

  function formatDate(dateString) {
    if (!dateString || dateString === "—") return "—";
    const date = new Date(`${dateString}T12:00:00`);
    return new Intl.DateTimeFormat("en-MY", { day: "numeric", month: "long", year: "numeric" }).format(date);
  }

  function openBooking(trigger) {
    form.reset();
    const orderType = trigger?.dataset.orderType;
    if (orderType) form.elements.orderType.value = orderType;
    setStep(1);
    dialog.showModal();
    setTimeout(() => form.elements.orderType.focus(), 80);
  }

  qa("[data-open-booking]").forEach((trigger) => {
    trigger.addEventListener("click", () => openBooking(trigger));
  });
  q(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  nextButton.addEventListener("click", () => {
    if (validateCurrentStep()) setStep(currentStep + 1);
  });
  previousButton.addEventListener("click", () => setStep(currentStep - 1));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateCurrentStep()) return;

    const message = [
      "Hi Cream & Crumbs! I’d like to enquire about a cake.",
      "",
      `Name: ${value("customerName")}`,
      `Contact: ${value("customerPhone")}`,
      `Order: ${value("orderType")}`,
      `Occasion: ${value("occasion")}`,
      `Required date: ${formatDate(value("date"))}`,
      `Preferred time: ${value("time")}`,
      `Fulfilment: ${value("fulfilment")}`,
      `Area: ${value("area")}`,
      `Servings: ${value("servings")}`,
      `Flavour: ${value("flavour")}`,
      `Style: ${value("style")}`,
      `Budget: ${value("budget")}`,
      `Colours: ${value("colours")}`,
      `Cake wording: ${value("wording")}`,
      `Reference: ${value("reference")}`,
      `Notes: ${value("notes")}`,
      "",
      "Could you confirm availability and provide a quotation?"
    ].join("\n");

    const encoded = encodeURIComponent(message);
    const url = WHATSAPP_NUMBER
      ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    window.open(url, "_blank", "noopener,noreferrer");
    errorBox.innerHTML = WHATSAPP_NUMBER
      ? "WhatsApp opened in a new tab."
      : `This demo still needs the bakery's WhatsApp number. The message opened in WhatsApp's share composer. You can also <a href="${INSTAGRAM_URL}" target="_blank" rel="noreferrer">message Cream & Crumbs on Instagram</a>.`;
  });
})();
