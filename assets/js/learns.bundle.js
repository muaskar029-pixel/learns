(function () {
"use strict";
var root = document.documentElement;
/* ---------- Hamburger menu ---------- */
var toggleBtn = document.querySelector(".nav-toggle");
var primaryNav = document.getElementById("primary-nav");
if (toggleBtn && primaryNav) {
var setMenuState = function (open) {
toggleBtn.setAttribute("aria-expanded", String(open));
toggleBtn.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
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
/* ---------- Language switcher (EN <-> ID) ----------
Two markup styles share one engine:
data-i18n="key"          -> text from ID_TEXT (shared header/footer)
data-i18n-prefix="key"   -> first text node from ID_TEXT
data-id="<html>"         -> inline Indonesian HTML (page content)
data-id-placeholder="…"  -> Indonesian placeholder
The English original is snapshotted lazily into data-en on the first switch to ID,
so nothing touches the DOM on load while the page is English. */
var LANG_KEY = "radova-lang";
var ID_TEXT = {
"skip": "Langsung ke konten",
"nav.packages": "Paket",
"nav.wiki": "Wiki",
"nav.learning": "Belajar",
"nav.events": "Acara",
"nav.latest": "Terbaru",
"nav.about": "Tentang",
"nav.history": "Sejarah",
"nav.contact": "Kontak",
"nav.back": "Kembali",
"footer.col1": "Tentang Radova",
"footer.col2": "Sumber Daya",
"footer.col3": "Pilar Utama",
"footer.col4": "Bantuan & Spesifikasi",
"footer.download": "Unduh ISO",
"footer.specs": "Kebutuhan Sistem",
"footer.security": "Info Keamanan",
"footer.copy": "© 2026 yuros.org · Dirilis di bawah Lisensi MIT",
"footer.top": "Ke atas ↑",
"err.home": "Beranda",
"err.chip": "Dalam Pengerjaan",
"err.title1": "Sedang dalam",
"err.title2": "pengembangan.",
"err.lead": "Bagian ini sedang kami bangun dan sempurnakan agar memenuhi standar kualitas Radova.",
"err.cta": "Kembali ke Beranda"
};
var langBtn = document.getElementById("lang-toggle");
var swap = function (el, isId, idVal, key, get, set) {
if (idVal == null) return;
if (el.dataset[key] == null) {
if (!isId) return;
el.dataset[key] = get();
}
set(isId ? idVal : el.dataset[key]);
};
var applyLang = function (lang) {
var isId = lang === "id";
document.querySelectorAll("[data-i18n]").forEach(function (el) {
swap(el, isId, ID_TEXT[el.dataset.i18n], "en",
function () { return el.textContent; },
function (v) { el.textContent = v; });
});
document.querySelectorAll("[data-i18n-prefix]").forEach(function (el) {
var node = el.firstChild;
var t = ID_TEXT[el.dataset.i18nPrefix];
if (node) swap(el, isId, t == null ? null : t + " ", "en",
function () { return node.nodeValue; },
function (v) { node.nodeValue = v; });
});
document.querySelectorAll("[data-id]").forEach(function (el) {
swap(el, isId, el.dataset.id, "en",
function () { return el.innerHTML; },
function (v) { el.innerHTML = v; });
});
document.querySelectorAll("[data-id-placeholder]").forEach(function (el) {
swap(el, isId, el.dataset.idPlaceholder, "enPlaceholder",
function () { return el.getAttribute("placeholder") || ""; },
function (v) { el.setAttribute("placeholder", v); });
});
root.lang = lang;
if (langBtn) {
langBtn.textContent = lang.toUpperCase();
langBtn.setAttribute("aria-label", isId ? "Switch language to English" : "Switch language to Indonesian");
}
};
if (langBtn) {
var currentLang = "en";
try {
if (localStorage.getItem(LANG_KEY) === "id") currentLang = "id";
} catch (_) {}
if (currentLang === "id") applyLang("id");
langBtn.addEventListener("click", function () {
currentLang = currentLang === "en" ? "id" : "en";
applyLang(currentLang);
try { localStorage.setItem(LANG_KEY, currentLang); } catch (_) {}
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
var label = isDark ? "Switch to light mode" : "Switch to dark mode";
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
const closeDropdown = () => {
if (!navBtn) return;
navBtn.classList.remove('active');
navBtn.setAttribute('aria-expanded', 'false');
if (document.activeElement && dropdownContainer && dropdownContainer.contains(document.activeElement)) {
document.activeElement.blur();
}
};
if (navBtn && dropdownContainer) {
if (isTouchDevice) {
navBtn.addEventListener('click', (e) => {
e.preventDefault();
const open = navBtn.classList.toggle('active');
navBtn.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', (e) => {
if (!dropdownContainer.contains(e.target)) {
closeDropdown();
}
});
} else {
dropdownContainer.addEventListener('mouseenter', () => {
navBtn.classList.add('active');
navBtn.setAttribute('aria-expanded', 'true');
});
dropdownContainer.addEventListener('mouseleave', () => {
closeDropdown();
});
navBtn.addEventListener('click', (e) => {
e.preventDefault();
const open = navBtn.classList.toggle('active');
navBtn.setAttribute('aria-expanded', String(open));
});
}
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