(function () {
  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector(".site-header");
  var progress = document.querySelector(".scroll-progress span");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var figure = document.querySelector(".hero-figure");
  var year = document.getElementById("year");

  if (year) year.textContent = String(new Date().getFullYear());

  var loader = document.querySelector(".cab-loader");
  if (!loader) {
    loader = document.createElement("div");
    loader.className = "cab-loader";
    loader.setAttribute("role", "status");
    loader.setAttribute("aria-label", "Isai Cabs and Travels is loading");
    loader.innerHTML =
      '<div class="cab-loader-stage">' +
        '<p class="cab-loader-name">Isai Cabs &amp; Travels</p>' +
        '<div class="cab-scene" aria-hidden="true">' +
          '<div class="cab-lane">' +
            '<svg class="cab-car" viewBox="0 0 140 56" fill="none">' +
              '<path d="M22 40c1-14 12-18 26-18h30l18 12h16c8 0 12 5 12 10v4H22z" fill="#ffffff" stroke="#1f7a72" stroke-width="2" stroke-linejoin="round"></path>' +
              '<path d="M48 24c6-8 14-10 22-10h18l12 12H48z" fill="#1f7a72"></path>' +
              '<circle cx="48" cy="42" r="7" fill="#173033"></circle>' +
              '<circle cx="48" cy="42" r="2.6" fill="#e7f6f5"></circle>' +
              '<circle cx="104" cy="42" r="7" fill="#173033"></circle>' +
              '<circle cx="104" cy="42" r="2.6" fill="#e7f6f5"></circle>' +
            '</svg>' +
          '</div>' +
          '<div class="cab-track"><span></span></div>' +
        '</div>' +
        '<p class="cab-loader-note">The car is on the way</p>' +
      '</div>';
    document.body.appendChild(loader);
  }
  document.body.classList.add("is-loading");
  window.setTimeout(function () {
    loader.classList.add("is-done");
    window.setTimeout(function () {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
      document.body.classList.remove("is-loading");
    }, reduceMotion ? 0 : 420);
  }, reduceMotion ? 350 : 1500);

  document.querySelectorAll(".spec-grid").forEach(function (grid) {
    grid.querySelectorAll(".spec-box").forEach(function (box) {
      box.addEventListener("click", function () {
        var picked = box.classList.contains("is-picked");
        grid.querySelectorAll(".spec-box").forEach(function (other) {
          other.classList.remove("is-picked");
          other.setAttribute("aria-pressed", "false");
        });
        if (!picked) {
          box.classList.add("is-picked");
          box.setAttribute("aria-pressed", "true");
        }
      });
    });
  });

  function onScroll() {
    var y = window.scrollY || 0;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    document.body.classList.toggle("show-wa", y > 280 || window.innerWidth >= 900);
    if (progress) {
      var height = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = height > 0 ? y / height : 0;
      progress.style.transform = "scaleX(" + ratio + ")";
    }
    if (figure && !reduceMotion) {
      var shift = Math.min(y, 280);
      figure.style.transform = "translateY(" + shift * 0.04 + "px)";
    }
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  function closeNav() {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  function openNav() {
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    nav.classList.add("is-open");
    document.body.classList.add("nav-open");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (toggle.getAttribute("aria-expanded") === "true") closeNav();
      else openNav();
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 980) closeNav();
    });
  }

  var revealNodes = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var revealQueued = false;

  function revealVisible() {
    revealQueued = false;
    var line = window.innerHeight * 0.92;
    revealNodes.forEach(function (node) {
      if (node.classList.contains("is-in")) return;
      if (node.getBoundingClientRect().top < line) node.classList.add("is-in");
    });
  }

  function requestReveal() {
    if (revealQueued) return;
    revealQueued = true;
    window.requestAnimationFrame(revealVisible);
  }

  if (reduceMotion) {
    revealNodes.forEach(function (node) {
      node.classList.add("is-in");
    });
  } else {
    revealVisible();
    window.addEventListener("scroll", requestReveal, { passive: true });
    window.addEventListener("resize", requestReveal);
  }

  var lightbox = document.querySelector(".lightbox");
  var lightboxImage = lightbox ? lightbox.querySelector("img") : null;
  var lightboxCaption = lightbox ? lightbox.querySelector("p") : null;
  var lastFocus = null;

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    if (lastFocus) lastFocus.focus();
  }

  if (lightbox && lightboxImage) {
    document.querySelectorAll(".shot button").forEach(function (button) {
      button.addEventListener("click", function () {
        lastFocus = button;
        lightboxImage.src = button.getAttribute("data-full");
        lightboxImage.alt = button.getAttribute("data-caption") || "";
        if (lightboxCaption) lightboxCaption.textContent = button.getAttribute("data-caption") || "";
        lightbox.hidden = false;
        document.body.classList.add("lightbox-open");
        var closeButton = lightbox.querySelector(".lightbox-close");
        if (closeButton) closeButton.focus();
      });
    });
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    var closeButton = lightbox.querySelector(".lightbox-close");
    if (closeButton) closeButton.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  document.querySelectorAll(".book-form").forEach(function (form) {
    var dateInput = form.querySelector('input[type="date"]');
    if (dateInput) {
      var today = new Date();
      var month = String(today.getMonth() + 1).padStart(2, "0");
      var day = String(today.getDate()).padStart(2, "0");
      dateInput.min = today.getFullYear() + "-" + month + "-" + day;
    }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var lines = [
        "Hello Isai Cabs & Travels, I would like to book the car.",
        "Name: " + data.get("name"),
        "Phone: " + data.get("phone"),
        "Pickup: " + data.get("from"),
        "Drop: " + data.get("to"),
        "Date: " + data.get("date"),
        "Trip: " + data.get("trip"),
        "Passengers: " + data.get("passengers"),
        "Note: " + (data.get("note") || "-")
      ];
      var url = "https://wa.me/918681832335?text=" + encodeURIComponent(lines.join("\n"));
      var opened = window.open(url, "_blank", "noopener,noreferrer");
      if (!opened) window.location.href = url;
    });
  });
})();
