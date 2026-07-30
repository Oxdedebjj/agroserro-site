(() => {
  "use strict";

  const MEASUREMENT_ID = "G-PHJBVC6L6K";
  const CONSENT_KEY = "agroserro_analytics_consent_v1";
  const VALID_CONSENT = new Set(["accepted", "rejected"]);
  const scriptUrl = document.currentScript?.src || `${window.location.origin}/analytics.js`;
  const privacyUrl = new URL("privacidade.html", scriptUrl).href;
  let analyticsLoaded = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });

  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;

    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      send_page_view: true,
    });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
    script.dataset.agroserroAnalytics = "true";
    document.head.appendChild(script);
  }

  function getConsent() {
    try {
      const value = window.localStorage.getItem(CONSENT_KEY);
      return VALID_CONSENT.has(value) ? value : null;
    } catch (_) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch (_) {
      // O consentimento continua válido durante a sessão mesmo sem armazenamento local.
    }

    if (value === "accepted") {
      loadAnalytics();
    } else {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }
  }

  function addStyles() {
    if (document.getElementById("agroserro-consent-styles")) return;
    const style = document.createElement("style");
    style.id = "agroserro-consent-styles";
    style.textContent = `
      .agroserro-consent{position:fixed;z-index:9999;left:50%;bottom:18px;transform:translateX(-50%);box-sizing:border-box;width:min(920px,calc(100vw - 32px));max-width:calc(100vw - 32px);padding:18px 20px;border:1px solid rgba(255,255,255,.16);border-radius:14px;background:#082f3d;color:#fff;box-shadow:0 18px 50px rgba(0,0,0,.28);font-family:Inter,system-ui,sans-serif}
      .agroserro-consent[hidden]{display:none}
      .agroserro-consent__content{display:flex;align-items:center;justify-content:space-between;gap:22px}
      .agroserro-consent__copy{min-width:0;max-width:610px}
      .agroserro-consent__copy strong{display:block;margin-bottom:5px;font-size:1rem}
      .agroserro-consent__copy p{margin:0;color:rgba(255,255,255,.82);font-size:.9rem;line-height:1.55}
      .agroserro-consent__copy a{color:#fff;text-decoration:underline;text-underline-offset:3px}
      .agroserro-consent__actions{display:flex;min-width:0;gap:10px;flex-shrink:0}
      .agroserro-consent__button{min-height:42px;padding:0 16px;border-radius:999px;border:1px solid rgba(255,255,255,.55);background:transparent;color:#fff;font:600 .88rem Inter,system-ui,sans-serif;cursor:pointer}
      .agroserro-consent__button--accept{border-color:#e9a43b;background:#e9a43b;color:#082f3d}
      .privacy-settings-link{border:0;background:none;padding:0;color:inherit;font:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
      @media(max-width:700px){.agroserro-consent{bottom:10px;padding:16px}.agroserro-consent__content{align-items:stretch;flex-direction:column;gap:14px}.agroserro-consent__actions{display:grid;width:100%;grid-template-columns:1fr 1fr}.agroserro-consent__button{width:100%;min-width:0;padding:0 10px}}
      @media(max-width:430px){.agroserro-consent__actions{grid-template-columns:1fr}.agroserro-consent__button{min-height:44px}}
    `;
    document.head.appendChild(style);
  }

  function createBanner() {
    if (document.getElementById("agroserro-consent")) return document.getElementById("agroserro-consent");
    addStyles();

    const banner = document.createElement("section");
    banner.id = "agroserro-consent";
    banner.className = "agroserro-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Preferências de privacidade");
    banner.innerHTML = `
      <div class="agroserro-consent__content">
        <div class="agroserro-consent__copy">
          <strong>Privacidade e medição do site</strong>
          <p>Usamos o Google Analytics somente com sua autorização para entender visitas e melhorar nossos serviços. <a href="${privacyUrl}">Leia a Política de Privacidade</a>.</p>
        </div>
        <div class="agroserro-consent__actions">
          <button class="agroserro-consent__button" type="button" data-consent="rejected">Recusar</button>
          <button class="agroserro-consent__button agroserro-consent__button--accept" type="button" data-consent="accepted">Aceitar análise</button>
        </div>
      </div>`;

    banner.addEventListener("click", (event) => {
      const button = event.target.closest("[data-consent]");
      if (!button) return;
      setConsent(button.dataset.consent);
      banner.hidden = true;
    });

    document.body.appendChild(banner);
    return banner;
  }

  function showBanner() {
    const banner = createBanner();
    banner.hidden = false;
  }

  function sendEvent(name, parameters) {
    if (!analyticsLoaded) return;
    window.gtag("event", name, parameters);
  }

  function describeCta(element) {
    return (element.textContent || element.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 100);
  }

  function setupConversionTracking() {
    document.addEventListener("click", (event) => {
      const whatsapp = event.target.closest("[data-whatsapp]");
      if (whatsapp) {
        sendEvent("generate_lead", {
          contact_method: "whatsapp",
          service_line: whatsapp.dataset.line || "geral",
          cta_text: describeCta(whatsapp),
        });
        return;
      }

      const link = event.target.closest("a[href]");
      if (!link) return;
      if (link.href.startsWith("tel:")) {
        sendEvent("generate_lead", {
          contact_method: "telefone",
          cta_text: describeCta(link),
        });
      } else if (/instagram\.com|facebook\.com/.test(link.hostname)) {
        sendEvent("social_click", {
          platform: link.hostname.includes("instagram") ? "instagram" : "facebook",
          link_url: link.href,
        });
      }
    }, true);

    document.addEventListener("submit", (event) => {
      if (!event.target.matches("[data-contact-form]")) return;
      sendEvent("generate_lead", {
        contact_method: "whatsapp_formulario",
        service_line: event.target.querySelector("#form-assunto")?.selectedOptions?.[0]?.dataset?.line || "geral",
      });
    }, true);
  }

  function boot() {
    setupConversionTracking();

    document.querySelectorAll("[data-cookie-settings]").forEach((control) => {
      control.addEventListener("click", (event) => {
        event.preventDefault();
        showBanner();
      });
    });

    const consent = getConsent();
    if (consent === "accepted") {
      loadAnalytics();
    } else if (!consent) {
      showBanner();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
