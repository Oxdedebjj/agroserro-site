const CONFIG = {
  businessName: "Agroserro Soluções Agropecuárias",
  // Números por linha de atendimento (somente dígitos, com DDI 55 + DDD)
  whatsapp: {
    credito: "5538998103299", // Crédito rural
    geo: "5538998849839",     // Georreferenciamento, topografia, laudos, CAR e ambiental
    agro: "5538998168519",    // Consultoria agronômica / gestão e manejo
  },
  // Linha usada por botões genéricos (hero, flutuante, menu)
  defaultLine: "credito",
};

function getNumber(line) {
  return CONFIG.whatsapp[line] || CONFIG.whatsapp[CONFIG.defaultLine];
}

function showToast(message) {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 4200);
}

function openWhatsapp(line, message) {
  const number = getNumber(line);
  if (!number) {
    showToast("WhatsApp ainda não configurado. Ligue para a Agroserro ou tente novamente mais tarde.");
    return;
  }
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function setupWhatsappButtons() {
  document.querySelectorAll("[data-whatsapp]").forEach((button) => {
    button.addEventListener("click", () => {
      openWhatsapp(button.dataset.line, button.dataset.message || "Olá! Vim pelo site da Agroserro e quero um atendimento.");
    });
  });
}

function setupContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.querySelector("#form-nome").value.trim();
    const select = form.querySelector("#form-assunto");
    const option = select.options[select.selectedIndex];
    const subject = option.textContent;
    const line = option.dataset.line || CONFIG.defaultLine;
    const details = form.querySelector("#form-mensagem").value.trim();

    let message = `Olá! Vim pelo site da Agroserro.`;
    if (name) message += `\nNome: ${name}`;
    message += `\nAssunto: ${subject}`;
    if (details) message += `\n${details}`;

    openWhatsapp(line, message);
  });
}

function setupScrollSpy() {
  const navLinks = document.querySelectorAll("[data-nav-links] a[href^='#']");
  if (!navLinks.length) return;

  const sections = Array.from(navLinks)
    .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${id}`));
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector("[data-nav-links]");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a, button").forEach((item) => {
    item.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((item) => observer.observe(item));
}

function boot() {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
  setupMenu();
  setupScrollSpy();
  setupWhatsappButtons();
  setupContactForm();
  setupReveal();
}

document.addEventListener("DOMContentLoaded", boot);
