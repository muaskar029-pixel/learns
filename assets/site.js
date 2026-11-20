(function () {
  "use strict";

  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReduced && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js");

    var groups = [
      document.querySelectorAll(".fitur-card"),
      document.querySelectorAll(".spec-card")
    ];

    for (var g = 0; g < groups.length; g++) {
      var list = groups[g];
      for (var i = 0; i < list.length; i++) {
        list[i].classList.add("reveal");
        list[i].style.setProperty("--i", String(i % 6));
      }
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      for (var e = 0; e < entries.length; e++) {
        if (entries[e].isIntersecting) {
          entries[e].target.classList.add("is-in");
          obs.unobserve(entries[e].target);
        }
      }
    }, {
      threshold: 0.01,
      rootMargin: "0px 0px 120px 0px"
    });

    var reveals = document.querySelectorAll(".reveal");
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var r = 0; r < reveals.length; r++) {
      var rect = reveals[r].getBoundingClientRect();
      if (rect.top < vh + 120) {
        reveals[r].classList.add("is-in");
      } else {
        observer.observe(reveals[r]);
      }
    }
  }
})();

// hamburger menu
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".nav-toggle");
  const primaryNav = document.getElementById("primary-nav");

  if (!toggleBtn || !primaryNav) return;

  const setMenuState = (open) => {
    toggleBtn.setAttribute("aria-expanded", String(open));
    toggleBtn.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
    primaryNav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = toggleBtn.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("click", (e) => {
    if (!primaryNav.contains(e.target) && !toggleBtn.contains(e.target)) {
      setMenuState(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) setMenuState(false);
  });
});

// language switcher (EN <-> ID)
document.addEventListener("DOMContentLoaded", () => {
  const langBtn = document.getElementById("lang-toggle");
  if (!langBtn) return;

  const LANG_KEY = "radova-lang";
  const ID_TEXT = {
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
    "hero.chip": "Siap Digunakan",
    "hero.title1": "Di mana ada shell,",
    "hero.title2": "di situ ada jalan",
    "hero.lead": "Radova Linux memberi Anda kecepatan penuh tanpa konfigurasi berhari-hari. Ringan, bebas bloatware, dan langsung optimal — tinggal boot, masuk, dan mulai bekerja.",
    "hero.download": "Unduh",
    "manifesto.title1": "Simpel saja,",
    "manifesto.title2": "jangan dipersulit",
    "manifesto.lead": "Kelola aset Anda tanpa kendala",
    "manifesto.deep": "Radova Linux adalah sistem operasi mandiri yang dirancang khusus untuk pengelolaan arsip lembaga, perpustakaan, dan kedaulatan aset digital.",
    "manifesto.p1.title": "Performa Tinggi",
    "manifesto.p1.desc": "Memangkas proses latar belakang yang tidak perlu agar perangkat Anda dapat memproses katalog besar dan berkas media dengan cepat.",
    "manifesto.p2.title": "Keamanan Berlapis",
    "manifesto.p2.desc": "Melindungi basis data lembaga dan arsip lokal lewat pengamanan kernel Linux serta kontrol akses yang ketat.",
    "manifesto.p3.title": "Kontrol Aset Terpusat",
    "manifesto.p3.desc": "Unggah, beri tag, dan temukan kembali aset lembaga Anda melalui satu aplikasi terpusat.",
    "manifesto.p4.title": "Kedaulatan Data",
    "manifesto.p4.desc": "Kendali penuh ada di tangan lembaga Anda atas seluruh katalog, arsip, dan berkas digital di atas Linux.",
    "manifesto.quote": "\"Hari ini harus lebih baik dari hari esok\"",
    "fitur.title1": "Empat Pilar utama dalam",
    "fitur.title2": "satu sistem Linux.",
    "fitur.meta": "4 PILAR // ARSITEKTUR SISTEM",
    "fitur.memora.desc": "Jalankan aplikasi Memora yang sudah terpasang langsung dari desktop untuk mengelola operasional perpustakaan.",
    "fitur.memora.dt": "MANAJEMEN PERPUSTAKAAN",
    "fitur.evrocks.desc": "Akses aplikasi Evrocks bawaan secara instan tanpa perlu memasang atau mengatur software kearsipan tambahan.",
    "fitur.evrocks.dt": "MANAJEMEN ARSIP",
    "fitur.coretez.desc": "Buka platform Coretez bawaan untuk mengelola aset digital begitu sistem selesai booting.",
    "fitur.coretez.dt": "MANAJEMEN ASET DIGITAL",
    "fitur.linkers.desc": "Kelola repositori lembaga dan karya ilmiah dengan cepat melalui platform Linkers yang sudah siap pakai.",
    "fitur.linkers.dt": "MANAJEMEN REPOSITORI",
    "fitur.dev": "Tahap Pengembangan",
    "specs.title": "Tak perlu perangkat mahal.",
    "specs.lead": "Radova Linux berjalan ringan baik di komputer perpustakaan yang sudah ada maupun workstation arsip modern.",
    "specs.cpu.title": "Prosesor (CPU)",
    "specs.cpu.val": "x86_64 Dual-Core 1,5 GHz",
    "specs.cpu.desc": "Mendukung prosesor Intel dan AMD 64-bit standar untuk menjalankan Memora, Evrocks, dan Coretez dengan lancar.",
    "specs.cpu.min": "2 Core",
    "specs.cpu.rec": "4 Core+",
    "specs.ram.title": "Memori (RAM)",
    "specs.ram.val": "2 GB RAM",
    "specs.ram.desc": "Menyisakan ruang memori yang lega untuk mengindeks katalog perpustakaan sambil membuka arsip digital.",
    "specs.disk.title": "Penyimpanan",
    "specs.disk.val": "Ruang Kosong 20 GB",
    "specs.disk.desc": "Ukuran instalasi ringkas dengan enkripsi disk penuh untuk menjaga keamanan data lembaga dan aset digital lokal.",
    "specs.disp.title": "Layar & Grafis",
    "specs.disp.val": "Resolusi 1024×768",
    "specs.disp.desc": "Berjalan baik di grafis bawaan Intel/AMD maupun layar virtual agar dokumen tetap terbaca jelas.",
    "specs.min": "Minimal",
    "specs.rec": "Disarankan",
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

  // ponytail: snapshot initial EN strings per element instead of duplicating them in JS
  const nodes = document.querySelectorAll("[data-i18n], [data-i18n-prefix]");
  const enList = Array.from(nodes, (node) =>
    node.hasAttribute("data-i18n")
      ? node.textContent
      : (node.firstChild ? node.firstChild.nodeValue : "")
  );

  const applyLang = (lang) => {
    nodes.forEach((el, i) => {
      if (el.hasAttribute("data-i18n")) {
        const key = el.getAttribute("data-i18n");
        el.textContent = lang === "id" && ID_TEXT[key] != null ? ID_TEXT[key] : enList[i];
      } else if (el.firstChild) {
        const pkey = el.getAttribute("data-i18n-prefix");
        el.firstChild.nodeValue = lang === "id" && ID_TEXT[pkey] != null ? ID_TEXT[pkey] + " " : enList[i];
      }
    });
    document.documentElement.lang = lang;
    langBtn.textContent = lang.toUpperCase();
    langBtn.setAttribute("aria-label", lang === "id" ? "Switch language to English" : "Switch language to Indonesian");
  };

  let currentLang = "en";
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "id" || saved === "en") currentLang = saved;
  } catch (_) {}

  if (currentLang !== "en") applyLang(currentLang);

  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "id" : "en";
    applyLang(currentLang);
    try {
      localStorage.setItem(LANG_KEY, currentLang);
    } catch (_) {}
  });
});


// HTMX Dark Mode Controller (Radova darkmode.pdf palette)
(function () {
  "use strict";
  var THEME_KEY = "radova-theme";
  var SUN_SVG = '<svg width="16" height="16" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="128" cy="128" r="56"/><line x1="128" y1="36" x2="128" y2="16"/><line x1="128" y1="240" x2="128" y2="220"/><line x1="36" y1="128" x2="16" y2="128"/><line x1="240" y1="128" x2="220" y2="128"/><line x1="63" y1="63" x2="49" y2="49"/><line x1="207" y1="207" x2="193" y2="193"/><line x1="193" y1="63" x2="207" y2="49"/><line x1="49" y1="207" x2="63" y2="193"/></svg>';
  var MOON_SVG = '<svg width="16" height="16" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M216.7 152.6A91.9 91.9 0 0 1 103.4 39.3a92 92 0 1 0 113.3 113.3Z"/></svg>';

  function getAssetsBase() {
    var script = document.querySelector('script[src*="htmx.min.js"]');
    return script ? new URL(".", script.src).href : new URL("assets/", window.location.href).href;
  }

  function applyTheme(theme) {
    var isDark = theme === "dark";
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    try { localStorage.setItem(THEME_KEY, isDark ? "dark" : "light"); } catch (_) {}
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      var nextFile = isDark ? "theme-light.html" : "theme-dark.html";
      btn.setAttribute("data-set-theme", isDark ? "dark" : "light");
      btn.setAttribute("aria-pressed", String(isDark));
      btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      btn.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
      btn.setAttribute("hx-get", new URL(nextFile, getAssetsBase()).href);
      btn.innerHTML = isDark ? SUN_SVG : MOON_SVG;
      if (window.htmx) window.htmx.process(btn);
    }
  }

  function getSavedTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") return saved;
    } catch (_) {}
    return "light";
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(getSavedTheme());
  });

  document.addEventListener("htmx:afterSwap", function (evt) {
    var target = evt.detail && evt.detail.target;
    var elt = evt.detail && evt.detail.elt;
    if ((target && target.id === "theme-toggle") || (elt && elt.id === "theme-toggle")) {
      var freshBtn = document.getElementById("theme-toggle");
      applyTheme(freshBtn && freshBtn.getAttribute("data-set-theme") === "dark" ? "dark" : "light");
    } else {
      document.documentElement.setAttribute("data-theme", getSavedTheme());
    }
  });

  function fallbackToggle(evt) {
    var elt = evt.detail && evt.detail.elt;
    if (elt && elt.id === "theme-toggle") {
      applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
    }
  }
  document.addEventListener("htmx:sendError", fallbackToggle);
  document.addEventListener("htmx:responseError", fallbackToggle);
})();
