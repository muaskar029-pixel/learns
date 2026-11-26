(function () {
"use strict";
var root = document.documentElement;
function tr(en, id, ar) {
var lang = root.lang;
return lang === "id" ? id : lang === "ar" ? ar : en;
}
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
(() => {
const navBtn = document.getElementById('about-menu-btn');
const dropdownContainer = document.querySelector('.dropdown');
const backBtn = document.querySelector('.d-content-back');
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia("(pointer: coarse)").matches;
let hideTimer = null;
const closeDropdown = () => {
clearTimeout(hideTimer);
if (!navBtn) return;
navBtn.classList.remove('active');
navBtn.setAttribute('aria-expanded', 'false');
if (document.activeElement && dropdownContainer && dropdownContainer.contains(document.activeElement)) {
document.activeElement.blur();
}
};
if (navBtn && dropdownContainer) {
if (!isTouchDevice) {
dropdownContainer.addEventListener('mouseenter', () => {
clearTimeout(hideTimer);
navBtn.classList.add('active');
navBtn.setAttribute('aria-expanded', 'true');
});
dropdownContainer.addEventListener('mouseleave', () => {
clearTimeout(hideTimer);
hideTimer = setTimeout(closeDropdown, 300);
});
}
navBtn.addEventListener('click', (e) => {
e.preventDefault();
clearTimeout(hideTimer);
const open = navBtn.classList.toggle('active');
navBtn.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', (e) => {
if (!dropdownContainer.contains(e.target)) {
closeDropdown();
}
});
if (backBtn) {
backBtn.addEventListener('click', (e) => {
e.preventDefault();
closeDropdown();
});
}
document.addEventListener('keydown', (e) => {
if (e.key === 'Escape') closeDropdown();
});
}
})();
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
document.addEventListener("click", function (e) {
var trigger = e.target.closest && e.target.closest("[data-goto-tab]");
if (!trigger) return;
var key = trigger.getAttribute("data-goto-tab");
if (key) {
e.preventDefault();
activateTab(key, true);
var explorer = document.getElementById("catalog-explorer");
if (explorer) explorer.scrollIntoView({ behavior: "smooth" });
}
});
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
window.__rdvReady=true;if(window.__rdvQ){var q=window.__rdvQ;window.__rdvQ=null;q.click();}