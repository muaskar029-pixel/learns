// Learns page: curriculum tab switcher (loaded lazily by loader.js).
(function () {
  "use strict";
  var tabs = Array.from(document.querySelectorAll('.tab-grid [role="tab"]'));
  var panels = Array.from(document.querySelectorAll('.tab-panel[role="tabpanel"]'));
  if (!tabs.length || !panels.length) return;

  var activateTab = function (targetKey, updateHash) {
    var matchedTab = tabs.find(function (tab) { return tab.dataset.tab === targetKey; }) || tabs[0];
    var activeKey = matchedTab.dataset.tab;

    tabs.forEach(function (tab) {
      var isSelected = tab.dataset.tab === activeKey;
      tab.setAttribute("aria-selected", String(isSelected));
      tab.setAttribute("tabindex", isSelected ? "0" : "-1");
    });

    panels.forEach(function (panel) {
      var isMatch = panel.id === "panel-" + activeKey;
      panel.hidden = !isMatch;
      panel.classList.toggle("is-active", isMatch);
    });

    if (updateHash && window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "#" + activeKey);
    }
  };

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () { activateTab(tab.dataset.tab, true); });

    tab.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      var dir = e.key === "ArrowRight" ? 1 : -1;
      var next = tabs[(index + dir + tabs.length) % tabs.length];
      next.focus();
      activateTab(next.dataset.tab, true);
    });
  });

  // Deep links: #course, #register-bootcamp, #course-rdv101 … open the panel that holds the target.
  var hash = decodeURIComponent(window.location.hash.slice(1));
  if (!hash) return;
  if (tabs.some(function (tab) { return tab.dataset.tab === hash.toLowerCase(); })) {
    activateTab(hash.toLowerCase(), false);
    return;
  }
  var target = document.getElementById(hash);
  var panel = target && target.closest(".tab-panel");
  if (panel) {
    activateTab(panel.id.replace("panel-", ""), false);
    target.scrollIntoView({ behavior: "smooth" });
  }
})();
