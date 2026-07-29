(function () {
  "use strict";

  const siteMenu = document.querySelector(".site-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const menuLinks = document.querySelectorAll(".site-menu__link");
  const brandLink = document.querySelector(".site-menu__brand");
  const pageContent = document.querySelector(".page__content");

  if (!siteMenu || !menuToggle) return;

  let isNavigating = false;

  function getPageName(pathOrUrl) {
    const url = new URL(pathOrUrl, window.location.href);
    return url.pathname.split("/").pop() || "index.html";
  }

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

  menuToggle.addEventListener("click", () => {
    siteMenu.classList.contains("is-open") ? closeMenu() : openMenu();
  });

  async function loadPage(url, pushHistory) {
    if (getPageName(url) === getPageName(window.location.href)) {
      closeMenu();
      return;
    }

    isNavigating = true;
    document.body.classList.add("is-navigating");

    if (!siteMenu.classList.contains("is-open")) {
      openMenu();
      await wait(getTransitionDuration());
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Page not found");
      const doc = new DOMParser().parseFromString(await response.text(), "text/html");
      const newContent = doc.querySelector(".page__content");

      if (newContent && pageContent) {
        pageContent.innerHTML = newContent.innerHTML;
      }

      const newTitle = doc.querySelector("title");
      if (newTitle) document.title = newTitle.textContent;

      document.body.className = doc.body.className + " is-navigating";
      updateActiveLink(getPageName(url));
      window.scrollTo(0, 0);

      if (pushHistory) history.pushState({ page: getPageName(url) }, "", url);
    } catch (err) {
      window.location.href = url;
      return;
    }

    closeMenu();
    await wait(getTransitionDuration());
    document.body.classList.remove("is-navigating");
    isNavigating = false;
  }

  function updateActiveLink(pageName) {
    menuLinks.forEach((link) => {
      link.classList.toggle("is-active", getPageName(link.getAttribute("href")) === pageName);
    });
  }

  menuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      if (!isNavigating) loadPage(link.getAttribute("href"), true);
    });
  });

  if (brandLink) {
    brandLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (!isNavigating) loadPage(brandLink.getAttribute("href"), true);
    });
  }

  window.addEventListener("popstate", () => {
    if (!isNavigating) loadPage(window.location.href, false);
  });

  history.scrollRestoration = "manual";
  history.replaceState({ page: getPageName(window.location.href) }, "", window.location.href);
  updateActiveLink(getPageName(window.location.href));
  window.scrollTo(0, 0);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && siteMenu.classList.contains("is-open") && !isNavigating) {
      closeMenu();
    }
  });

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
