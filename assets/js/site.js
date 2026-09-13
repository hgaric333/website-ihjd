/* ===========================================================================
   Narratives In Between — site behaviour
   Nothing here needs editing to add posts or episodes.
   Edit assets/js/posts.js and assets/js/episodes.js instead.
   =========================================================================== */
(function () {
  "use strict";

  var BASE = document.body.dataset.base || "";   // "" at root, "../" inside /posts/

  /* ------------------------------------------------------------ helpers --- */
  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function formatDate(iso) {
    var parts = String(iso).split("-");
    if (parts.length !== 3) return iso;
    var d = new Date(Date.UTC(+parts[0], +parts[1] - 1, +parts[2]));
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  }

  /* -------------------------------------------------------- mobile nav --- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    var mq = window.matchMedia("(max-width: 760px)");
    var sync = function () {
      if (mq.matches) { nav.hidden = true; toggle.setAttribute("aria-expanded", "false"); }
      else { nav.hidden = false; }
    };
    sync();
    (mq.addEventListener ? mq.addEventListener("change", sync) : mq.addListener(sync));
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.hidden = open;
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mq.matches && !nav.hidden) { nav.hidden = true; toggle.setAttribute("aria-expanded", "false"); toggle.focus(); }
    });
  }

  /* ------------------------------------------------------- post cards --- */
  function postCard(post, opts) {
    opts = opts || {};
    var card = el("a", { class: "card" + (opts.feature ? " card--feature" : ""), href: BASE + post.file });
    var tags = (post.tags || []).slice(0, opts.feature ? 4 : 3).map(function (t) {
      return '<span class="tag">' + esc(t) + "</span>";
    }).join("");

    var body =
      '<div>' +
        '<div class="card__meta"><span>' + esc(formatDate(post.date)) + "</span>" +
        (post.readingTime ? '<span class="dot"></span><span>' + esc(post.readingTime) + "</span>" : "") +
        "</div>" +
        "<h3>" + esc(post.title) + "</h3>" +
        "<p>" + esc(post.excerpt || "") + "</p>" +
      "</div>" +
      '<div class="card__foot">' +
        '<div class="tags">' + tags + "</div>" +
        '<span class="card__more">Read <span class="arrow" aria-hidden="true">&rarr;</span></span>' +
      "</div>";

    card.innerHTML = body;
    return card;
  }

  var posts = (window.POSTS || []).slice().sort(function (a, b) {
    return String(b.date).localeCompare(String(a.date));
  });

  /* latest posts on the home page */
  var latest = document.getElementById("latest-posts");
  if (latest) {
    var limit = parseInt(latest.dataset.limit || "3", 10);
    if (!posts.length) latest.appendChild(el("p", { class: "empty-state" }, "No articles published yet."));
    posts.slice(0, limit).forEach(function (p, i) {
      latest.appendChild(postCard(p, { feature: i === 0 && p.featured }));
    });
  }

  /* full archive + tag filter on the research page */
  var archive = document.getElementById("all-posts");
  if (archive) {
    var filterBar = document.getElementById("tag-filter");
    var active = "all";

    function render() {
      archive.innerHTML = "";
      var list = active === "all" ? posts : posts.filter(function (p) { return (p.tags || []).indexOf(active) > -1; });
      if (!list.length) {
        archive.appendChild(el("p", { class: "empty-state" }, "No articles under this topic yet."));
        return;
      }
      list.forEach(function (p) { archive.appendChild(postCard(p)); });
    }

    if (filterBar) {
      var all = {};
      posts.forEach(function (p) { (p.tags || []).forEach(function (t) { all[t] = (all[t] || 0) + 1; }); });
      var names = ["all"].concat(Object.keys(all).sort(function (a, b) { return all[b] - all[a] || a.localeCompare(b); }));
      names.forEach(function (name) {
        var b = el("button", { type: "button", "aria-pressed": String(name === "all") }, name === "all" ? "All topics" : esc(name));
        b.addEventListener("click", function () {
          active = name;
          filterBar.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          render();
        });
        filterBar.appendChild(b);
      });
    }
    render();
  }

  /* ---------------------------------------------------------- episodes --- */
  var epWrap = document.getElementById("episodes");
  if (epWrap) {
    var eps = (window.EPISODES || []).slice().sort(function (a, b) { return b.number - a.number; });
    if (!eps.length) epWrap.appendChild(el("p", { class: "empty-state" }, "Episodes are on the way."));
    eps.forEach(function (ep) {
      var live = !!(ep.link || ep.audio);
      var row = el("article", { class: "episode" + (live ? "" : " episode--soon") });
      row.innerHTML =
        '<div class="episode__num" aria-hidden="true">' + esc(ep.number) + "</div>" +
        '<div class="episode__body">' +
          '<div class="episode__meta">Episode ' + esc(ep.number) + (ep.date ? " &middot; " + esc(ep.date) : "") + "</div>" +
          "<h3>" + esc(ep.title) + "</h3>" +
          "<p>" + esc(ep.description || "") + "</p>" +
          (ep.audio ? '<audio controls preload="none" src="' + esc(ep.audio) + '"></audio>' : "") +
        "</div>" +
        (ep.link
          ? '<a class="btn btn-outline" href="' + esc(ep.link) + '" target="_blank" rel="noopener">Listen <span class="arrow" aria-hidden="true">&rarr;</span></a>'
          : '<span class="episode__meta">Coming soon</span>');
      epWrap.appendChild(row);
    });
  }

  /* ------------------------------------------------------- contact form --- */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    var endpoint = form.getAttribute("action") || "";
    var configured = endpoint.indexOf("YOUR_FORM_ID") === -1 && endpoint.indexOf("http") === 0;

    function setStatus(kind, msg) {
      if (!status) return;
      status.className = "form-status " + kind;
      status.textContent = msg;
    }
    function validate() {
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var valid = input.checkValidity() && input.value.trim() !== "";
        if (field) field.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      return ok;
    }

    form.addEventListener("input", function (e) {
      var field = e.target.closest(".field");
      if (field && field.classList.contains("invalid") && e.target.checkValidity()) field.classList.remove("invalid");
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.querySelector(".hp input") && form.querySelector(".hp input").value) return; // bot
      if (!validate()) { setStatus("bad", "Please fill in the highlighted fields."); return; }

      var data = new FormData(form);

      if (!configured) {
        // No form service connected yet — fall back to the visitor's email client.
        var subject = encodeURIComponent("Website enquiry from " + (data.get("name") || "a visitor"));
        var body = encodeURIComponent((data.get("message") || "") + "\n\n— " + (data.get("name") || "") + " (" + (data.get("email") || "") + ")");
        window.location.href = "mailto:" + (form.dataset.fallbackEmail || "") + "?subject=" + subject + "&body=" + body;
        setStatus("ok", "Opening your email app. If nothing happens, write to us directly at " + (form.dataset.fallbackEmail || "") + ".");
        return;
      }

      var btn = form.querySelector("button[type=submit]");
      var label = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      setStatus("", "");

      fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error("bad response");
          form.reset();
          setStatus("ok", "Thank you — your message is on its way. We'll reply to the address you gave.");
        })
        .catch(function () {
          setStatus("bad", "Something went wrong sending that. Please email us directly at " + (form.dataset.fallbackEmail || "") + ".");
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = label; }
        });
    });
  }

  /* --------------------------------------------------------- footer year --- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
