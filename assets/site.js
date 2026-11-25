// Shared header behaviour: hamburger menu, language menu, dark mode (loaded lazily by loader.js).
(function () {
  "use strict";
  var root = document.documentElement;

  // Text this script writes into the page, in the page's language (<html lang>).
  function tr(en, id, ar) {
    var lang = root.lang;
    return lang === "id" ? id : lang === "ar" ? ar : en;
  }

  /* ---------- Hamburger menu ---------- */
  var toggleBtn = document.querySelector(".nav-toggle");
  var primaryNav = document.getElementById("primary-nav");

  if (toggleBtn && primaryNav) {
    var setMenuState = function (open) {
      toggleBtn.setAttribute("aria-expanded", String(open));
      toggleBtn.setAttribute("aria-label", open ? tr("Close navigation menu", "Tutup menu navigasi", "إغلاق قائمة التنقل") : tr("Open navigation menu", "Buka menu navigasi", "فتح قائمة التنقل"));
      primaryNav.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };

    toggleBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      setMenuState(toggleBtn.getAttribute("aria-expanded") !== "true");
    });

    primaryNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenuState(false); });
    });

    document.addEventListener("click", function (e) {
      if (!primaryNav.contains(e.target) && !toggleBtn.contains(e.target)) setMenuState(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768) setMenuState(false);
    });
  }

  // Language menu: the list holds plain links to this page in each language; this only opens and closes it.
  var langBtn = document.getElementById("lang-toggle");
  var langList = document.getElementById("lang-list");
  if (langBtn && langList) {
    var setLangOpen = function (open) {
      langBtn.setAttribute("aria-expanded", String(open));
      langList.hidden = !open;
    };
    langBtn.addEventListener("click", function () {
      setLangOpen(langList.hidden);
    });
    document.addEventListener("click", function (e) {
      if (!langList.hidden && !langBtn.parentNode.contains(e.target)) setLangOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !langList.hidden) {
        setLangOpen(false);
        langBtn.focus();
      }
    });
  }

  /* ---------- Dark mode (vanilla, no HTMX) ----------
     The inline loader sets data-theme="dark" from localStorage before first paint;
     both icons live in the button and CSS shows the right one. */
  var THEME_KEY = "radova-theme";
  var themeBtn = document.getElementById("theme-toggle");

  if (themeBtn) {
    var syncThemeBtn = function () {
      var isDark = root.getAttribute("data-theme") === "dark";
      var label = isDark ? tr("Switch to light mode", "Beralih ke mode terang", "التبديل إلى الوضع الفاتح") : tr("Switch to dark mode", "Beralih ke mode gelap", "التبديل إلى الوضع الداكن");
      themeBtn.setAttribute("aria-pressed", String(isDark));
      themeBtn.setAttribute("aria-label", label);
      themeBtn.setAttribute("title", label);
    };

    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
      syncThemeBtn();
    });

    syncThemeBtn();
  }
})();
