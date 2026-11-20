document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     1. TAB NAVIGATION
     ========================================================================== */
  const tabs = Array.from(document.querySelectorAll('.tab-grid [role="tab"]'));
  const panels = Array.from(document.querySelectorAll('.tab-panel[role="tabpanel"]'));

  const activateTab = (targetKey, updateHash = true) => {
    if (!tabs.length || !panels.length) return;
    const matchedTab = tabs.find((tab) => tab.dataset.tab === targetKey) || tabs[0];
    const activeKey = matchedTab.dataset.tab;

    tabs.forEach((tab) => {
      const isSelected = tab.dataset.tab === activeKey;
      tab.setAttribute("aria-selected", String(isSelected));
      tab.setAttribute("tabindex", isSelected ? "0" : "-1");
    });

    panels.forEach((panel) => {
      const isMatch = panel.id === `panel-${activeKey}`;
      panel.hidden = !isMatch;
      panel.classList.toggle("is-active", isMatch);
    });

    if (updateHash && window.history && window.history.replaceState) {
      window.history.replaceState(null, "", `#${activeKey}`);
    }
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab.dataset.tab, true));

    tab.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (index + dir + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex].dataset.tab, true);
    });
  });

  const initialHash = window.location.hash.replace("#", "").toLowerCase();
  if (initialHash) {
    if (initialHash === "register-bootcamp") {
      activateTab("bootcamp", false);
      document.getElementById("register-bootcamp")?.scrollIntoView({ behavior: "smooth" });
    } else if (initialHash === "register-certification") {
      activateTab("certification", false);
      document.getElementById("register-certification")?.scrollIntoView({ behavior: "smooth" });
    } else if (tabs.some((tab) => tab.dataset.tab === initialHash)) {
      activateTab(initialHash, false);
    }
  }

  /* ==========================================================================
     2. AUTO-TRANSLATE VIA HTML ATTRIBUTES (data-id & data-id-placeholder)
     ========================================================================== */
  const translatableEls = document.querySelectorAll("[data-id]");
  const placeholderEls = document.querySelectorAll("[data-id-placeholder]");

  // Simpan konten default (EN) saat pertama kali dimuat
  translatableEls.forEach((el) => {
    if (!el.dataset.en) el.dataset.en = el.innerHTML;
  });

  placeholderEls.forEach((el) => {
    if (!el.dataset.enPlaceholder) {
      el.dataset.enPlaceholder = el.getAttribute("placeholder") || "";
    }
  });

  const applyLanguage = (lang) => {
    const isId = lang === "id";

    translatableEls.forEach((el) => {
      el.innerHTML = isId ? el.dataset.id : el.dataset.en;
    });

    placeholderEls.forEach((el) => {
      el.setAttribute(
        "placeholder",
        isId ? el.dataset.idPlaceholder : el.dataset.enPlaceholder
      );
    });
  };

  const detectCurrentLanguage = () => {
    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (htmlLang.startsWith("id")) return "id";

    const langBtn = document.getElementById("lang-toggle");
    if (langBtn) {
      const btnText = langBtn.textContent.trim().toUpperCase();
      if (btnText === "ID") return "id";
      if (btnText === "EN") return "en";
    }

    for (const key of ["lang", "language", "radova_lang", "radova-lang", "site_lang"]) {
      const stored = (localStorage.getItem(key) || "").toLowerCase();
      if (stored.startsWith("id")) return "id";
      if (stored.startsWith("en")) return "en";
    }

    return "en";
  };

  applyLanguage(detectCurrentLanguage());

  const langObserver = new MutationObserver(() => {
    applyLanguage(detectCurrentLanguage());
  });

  langObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });

  const langToggleBtn = document.getElementById("lang-toggle");
  if (langToggleBtn) {
    langObserver.observe(langToggleBtn, {
      childList: true,
      characterData: true,
      subtree: true
    });

    langToggleBtn.addEventListener("click", () => {
      setTimeout(() => applyLanguage(detectCurrentLanguage()), 0);
    });
  }
});