// Loads css/fonts.css and js/learns.bundle.js on first interaction (or now if dark/ID/hash needs it).
(function () {
  "use strict";
  var base = document.currentScript.src;
  var loaded = false;
  var events = ["pointerdown", "keydown", "touchstart", "scroll"];

  function add(tag, attrs) {
    var el = document.createElement(tag);
    for (var k in attrs) el[k] = attrs[k];
    (tag === "link" ? document.head : document.body).appendChild(el);
  }

  function load() {
    if (loaded) return;
    loaded = true;
    events.forEach(function (e) { removeEventListener(e, load); });
    add("link", { rel: "stylesheet", href: new URL("../css/fonts.css", base).href });
    add("script", { src: new URL("learns.bundle.js", base).href });
  }

  events.forEach(function (e) { addEventListener(e, load, { once: true, passive: true }); });
  document.addEventListener("click", function (e) {
    var t = !window.__rdvReady && e.target.closest && e.target.closest("button:not([type=submit])");
    if (t) { window.__rdvQ = t; load(); }
  }, true);

  try {
    if (localStorage.getItem("radova-theme") === "dark" || localStorage.getItem("radova-lang") === "id") load();
  } catch (_) {}
  if (location.hash.length > 1) load();
})();
