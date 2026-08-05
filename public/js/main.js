(function () {
  "use strict";

  const siteMenu = document.querySelector(".site-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const menuLinks = document.querySelectorAll(".site-menu__link");
  const brandLink = document.querySelector(".site-menu__brand");
  const sections = Array.from(document.querySelectorAll(".site-section[id]"));

  if (!siteMenu || !menuToggle) return;

  let isNavigating = false;

  function getTransitionDuration() {
    const val = getComputedStyle(document.documentElement)
      .getPropertyValue("--transition-menu")
      .trim();
    if (val.endsWith("ms")) return parseFloat(val);
    if (val.endsWith("s")) return parseFloat(val) * 1000;
    return 650;
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function openMenu() {
    siteMenu.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    siteMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  function getSectionIdFromHref(href) {
    if (!href) return "home";
    if (href.startsWith("#")) return href.slice(1) || "home";
    try {
      const url = new URL(href, window.location.href);
      if (url.hash) return url.hash.slice(1) || "home";
    } catch (_) {
      /* ignore */
    }
    return "home";
  }

  function updateActiveLink(sectionId) {
    menuLinks.forEach((link) => {
      const id = getSectionIdFromHref(link.getAttribute("href"));
      link.classList.toggle("is-active", id === sectionId && sectionId !== "home");
    });
  }

  function getScrollTarget(sectionId) {
    if (sectionId === "home") {
      return document.getElementById("home");
    }

    const section = document.getElementById(sectionId);
    if (!section) return null;

    return section.querySelector("h1") || section;
  }

  function scrollToSection(sectionId, pushHistory) {
    const target = getScrollTarget(sectionId) || document.getElementById("home");
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    updateActiveLink(sectionId);

    const hash = sectionId === "home" ? "#home" : `#${sectionId}`;
    if (pushHistory) {
      history.pushState({ section: sectionId }, "", hash);
    } else {
      history.replaceState({ section: sectionId }, "", hash);
    }
  }

  async function navigateToSection(sectionId, pushHistory) {
    if (isNavigating) return;
    isNavigating = true;
    document.body.classList.add("is-navigating");

    if (!siteMenu.classList.contains("is-open")) {
      openMenu();
      await wait(getTransitionDuration());
    }

    scrollToSection(sectionId, pushHistory);

    closeMenu();
    await wait(getTransitionDuration());
    document.body.classList.remove("is-navigating");
    isNavigating = false;
  }

  menuToggle.addEventListener("click", () => {
    siteMenu.classList.contains("is-open") ? closeMenu() : openMenu();
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigateToSection(getSectionIdFromHref(link.getAttribute("href")), true);
    });
  });

  if (brandLink) {
    brandLink.addEventListener("click", (e) => {
      e.preventDefault();
      navigateToSection("home", true);
    });
  }

  document.querySelectorAll(".site-footer__link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToSection(getSectionIdFromHref(link.getAttribute("href")), true);
    });
  });

  window.addEventListener("popstate", () => {
    const sectionId = getSectionIdFromHref(window.location.hash || "#home");
    if (!isNavigating) navigateToSection(sectionId, false);
  });

  function syncActiveFromScroll() {
    if (isNavigating || !sections.length) return;

    const marker = window.scrollY + window.innerHeight * 0.28;
    let activeId = sections[0].id;

    for (const section of sections) {
      if (section.offsetTop <= marker) activeId = section.id;
    }

    updateActiveLink(activeId);
  }

  window.addEventListener("scroll", syncActiveFromScroll, { passive: true });

  history.scrollRestoration = "manual";
  const initialId = getSectionIdFromHref(window.location.hash || "#home");
  if (initialId && initialId !== "home") {
    // Wait a tick so layout/fonts settle, then jump to deep link.
    requestAnimationFrame(() => {
      const target = getScrollTarget(initialId);
      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
        updateActiveLink(initialId);
        history.replaceState({ section: initialId }, "", `#${initialId}`);
      }
    });
  } else {
    history.replaceState({ section: "home" }, "", "#home");
    updateActiveLink("home");
    window.scrollTo(0, 0);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && siteMenu.classList.contains("is-open") && !isNavigating) {
      closeMenu();
    }
  });

  /* Keep the fixed dock aligned with the visual viewport bottom on mobile.
     Without this, Safari/Chrome toolbar hide/show shifts layout and feels choppy. */
  function syncBrowserChromeInset() {
    if (!window.matchMedia("(max-width: 700px)").matches) return;

    const vv = window.visualViewport;
    if (!vv) return;

    const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    document.documentElement.style.setProperty("--browser-chrome-inset", `${inset}px`);
  }

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", syncBrowserChromeInset);
    window.visualViewport.addEventListener("scroll", syncBrowserChromeInset);
    syncBrowserChromeInset();
  }

  document.addEventListener("submit", async (e) => {
    const form = e.target.closest(".contact-form");
    if (!form) return;

    e.preventDefault();

    const submitBtn = form.querySelector(".contact-form__submit");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Something went wrong");
      }

      const intro = document.querySelector(".contact__intro");
      if (intro) intro.remove();

      form.replaceWith(
        Object.assign(document.createElement("p"), {
          className: "contact__thanks",
          textContent: "Thanks for reaching out!",
        })
      );
    } catch (err) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
      alert(err.message || "Unable to send your message. Please try again.");
    }
  });
})();
