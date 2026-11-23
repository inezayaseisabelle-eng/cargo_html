/* =========================================================
   CarGo — shared site logic
   Layout (header/footer), fake auth, storage, helpers,
   car cards and a small form-validation engine.
   ========================================================= */

/* ---------- Helpers ---------- */
const formatRWF = (n) => "RWF " + Number(n).toLocaleString("en-US");
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
const getParam = (key) => new URLSearchParams(window.location.search).get(key);
const findCar = (id) => CARS.find((c) => c.id === id);
const zoneOf = (locationValue) => (LOCATIONS.find((l) => l.value === locationValue) || {}).zone || "kigali";
const rateFor = (car, zone) => PACKAGES[car.package][zone === "outside" ? "outside" : "kigali"];
const initials = (name) => name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("");
const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

function daysBetween(start, end) {
  const ms = new Date(end) - new Date(start);
  return Math.round(ms / 86400000);
}

/* ---------- Safe storage (works even if storage is blocked) ---------- */
const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
  }
};

/* ---------- Fake authentication ---------- */
const Auth = {
  users() {
    return [...DUMMY_USERS, ...store.get("cargo_users", [])];
  },
  current() {
    let tabSession = null;
    try { tabSession = JSON.parse(sessionStorage.getItem("cargo_session")); } catch (e) { /* ignore */ }
    return store.get("cargo_session", null) || tabSession;
  },
  // remember=false keeps the session only until the browser tab closes
  login(email, password, remember = true) {
    const user = this.users().find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || user.password !== password) return null;
    const session = { id: user.id, name: user.name, email: user.email, phone: user.phone };
    if (remember) {
      store.set("cargo_session", session);
    } else {
      try { sessionStorage.setItem("cargo_session", JSON.stringify(session)); } catch (e) { /* ignore */ }
    }
    return session;
  },
  signup({ name, email, phone, password }) {
    if (this.users().some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const user = { id: Date.now(), name, email, phone, password };
    store.set("cargo_users", [...store.get("cargo_users", []), user]);
    return { ok: true, user };
  },
  logout() {
    store.remove("cargo_session");
    try { sessionStorage.removeItem("cargo_session"); } catch (e) { /* ignore */ }
  },
  emailExists(email) {
    return this.users().some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  }
};

/* ---------- Bookings (localStorage) ---------- */
const Bookings = {
  all() { return store.get("cargo_bookings", []); },
  forUser(email) { return this.all().filter((b) => b.userEmail === email); },
  add(booking) {
    const b = { ...booking, id: "CG-" + Math.random().toString(36).slice(2, 8).toUpperCase(), status: "confirmed", createdAt: new Date().toISOString() };
    store.set("cargo_bookings", [...this.all(), b]);
    return b;
  },
  cancel(id) {
    store.set("cargo_bookings", this.all().map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
  }
};

/* ---------- Toast ---------- */
function toast(message, type = "success") {
  let el = qs(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.className = "toast " + type;
  requestAnimationFrame(() => el.classList.add("show"));
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 3200);
}

/* ---------- Icons ---------- */
const ICONS = {
  seat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="12" cy="18" r="2"/><path d="M6 8v8M12 8v8M18 8v4H6"/></svg>',
  fuel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17M3 22h12M6 8h6"/><path d="M15 12h2a2 2 0 0 1 2 2v3a1.5 1.5 0 0 0 3 0V9l-3-3"/></svg>'
};

/* ---------- Car card ---------- */
function carCardHTML(car, zone = "kigali", delay = 0) {
  const pkg = PACKAGES[car.package];
  return `
    <article class="car-card" style="animation-delay:${delay}ms">
      <a class="car-media" href="car.html?id=${car.id}">
        <img src="${car.image}" alt="${car.name}" loading="lazy">
        <span class="badge badge-${car.package}">${pkg.name}</span>
      </a>
      <div class="car-body">
        <span class="car-type">${car.type} · ${car.year}</span>
        <h3><a href="car.html?id=${car.id}">${car.name}</a></h3>
        <ul class="specs">
          <li>${ICONS.seat}${car.seats} seats</li>
          <li>${ICONS.gear}${car.transmission}</li>
          <li>${ICONS.fuel}${car.fuel}</li>
        </ul>
        <div class="car-price">
          <div>
            <span class="from">${zone === "outside" ? "Outside Kigali" : "In Kigali"}</span>
            <strong>${formatRWF(rateFor(car, zone))} <small>/ day</small></strong>
          </div>
          <a class="btn btn-primary btn-sm" href="booking.html?car=${car.id}">Book now</a>
        </div>
      </div>
    </article>`;
}

/* ---------- Layout: header + footer ---------- */
const NAV = [
  { href: "index.html", label: "Home" },
  { href: "cars.html", label: "Our Fleet" },
  { href: "pricing.html", label: "Pricing" },
  { href: "booking.html", label: "Book a Car" },
  { href: "contact.html", label: "Contact" }
];

function currentPage() {
  const file = window.location.pathname.split("/").pop() || "index.html";
  return file === "car.html" ? "cars.html" : file;
}

function renderHeader() {
  const host = qs("#site-header");
  if (!host) return;
  const user = Auth.current();
  const page = currentPage();

  const links = NAV.map((l) => `<li><a href="${l.href}" class="${l.href === page ? "active" : ""}">${l.label}</a></li>`).join("");

  const auth = user
    ? `<div class="user-menu">
         <button class="user-chip" type="button" aria-haspopup="true" aria-expanded="false">
           <span class="avatar">${escapeHTML(initials(user.name))}</span>
           <span>${escapeHTML(user.name.split(" ")[0])}</span>
         </button>
         <div class="user-dropdown">
           <a href="account.html">My account & bookings</a>
           <a href="booking.html">New booking</a>
           <button type="button" data-logout>Log out</button>
         </div>
       </div>`
    : `<a class="btn btn-outline btn-sm" href="login.html">Log in</a>
       <a class="btn btn-primary btn-sm" href="signup.html">Sign up</a>`;

  host.className = "site-header";
  host.innerHTML = `
    <div class="container nav">
      <a class="brand" href="index.html" aria-label="CarGo home"><img src="image/logo.png" alt="CarGo Car Rental"></a>
      <button class="nav-toggle" type="button" aria-label="Toggle menu" aria-expanded="false"><span></span></button>
      <div class="nav-menu">
        <ul class="nav-links">${links}</ul>
        <div class="nav-auth">${auth}</div>
      </div>
    </div>`;

  const toggle = qs(".nav-toggle", host);
  toggle.addEventListener("click", () => {
    const open = host.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open);
  });

  const menu = qs(".user-menu", host);
  if (menu) {
    const chip = qs(".user-chip", menu);
    chip.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = menu.classList.toggle("open");
      chip.setAttribute("aria-expanded", open);
    });
    document.addEventListener("click", () => menu.classList.remove("open"));
    qs("[data-logout]", menu).addEventListener("click", () => {
      Auth.logout();
      toast("You have been logged out.");
      setTimeout(() => (window.location.href = "index.html"), 600);
    });
  }
}

function renderFooter() {
  const host = qs("#site-footer");
  if (!host) return;
  host.className = "site-footer";
  host.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="footer-logo" href="index.html"><img src="image/logo.png" alt="CarGo Car Rental"></a>
          <p>Reliable, affordable car rental in Kigali and across Rwanda. From city hatchbacks to safari Land Cruisers — we get you moving.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>${NAV.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join("")}</ul>
        </div>
        <div>
          <h4>Packages</h4>
          <ul>
            <li><a href="pricing.html">Standard — from ${formatRWF(PACKAGES.standard.kigali)}</a></li>
            <li><a href="pricing.html">Premium — from ${formatRWF(PACKAGES.premium.kigali)}</a></li>
            <li><a href="cars.html?zone=outside">Upcountry & safari trips</a></li>
          </ul>
        </div>
        <div>
          <h4>Stay in touch</h4>
          <p>KG 7 Ave, Kacyiru, Kigali<br>+250 788 000 111<br>hello@cargo.rw</p>
          <form class="newsletter" id="newsletter" novalidate>
            <input type="email" placeholder="Your email" aria-label="Email for newsletter" required>
            <button class="btn btn-primary btn-sm" type="submit">Join</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} CarGo Car Rental. All rights reserved.</span>
        <span>Prices in Rwandan Francs (RWF) per day.</span>
      </div>
    </div>`;

  qs("#newsletter", host).addEventListener("submit", (e) => {
    e.preventDefault();
    const input = qs("input", e.target);
    if (!Validators.email(input.value)) {
      toast("Please enter a valid email address.", "error");
      input.focus();
      return;
    }
    input.value = "";
    toast("Thanks for subscribing to CarGo offers!");
  });
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const items = qsa(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.12 }
  );
  items.forEach((el) => io.observe(el));
}

/* =========================================================
   Form validation engine
   rules: { fieldName: [ [testFn, "message"], ... ] }
   ========================================================= */
const Validators = {
  required: (v) => String(v).trim().length > 0,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()),
  // Rwandan mobile: 07X XXX XXXX or +250 7X XXX XXXX (MTN 078/079, Airtel 072/073)
  phone: (v) => /^(\+?250|0)7[2389]\d{7}$/.test(String(v).replace(/[\s-]/g, "")),
  name: (v) => /^[A-Za-zÀ-ÿ'’\- ]{2,}$/.test(String(v).trim()) && String(v).trim().includes(" "),
  minLen: (n) => (v) => String(v).trim().length >= n,
  strongPassword: (v) => v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v),
  // Rwanda National ID (16 digits starting with 1) or passport (6–9 letters/numbers)
  idOrPassport: (v) => {
    const s = String(v).replace(/\s/g, "");
    return /^1\d{15}$/.test(s) || /^[A-Za-z]{1,2}\d{6,8}$/.test(s);
  },
  licence: (v) => /^[A-Za-z0-9]{6,16}$/.test(String(v).replace(/\s/g, ""))
};

function setFieldState(field, message) {
  const group = field.closest(".form-group");
  if (!group) return;
  const err = qs(".error-msg", group);
  group.classList.toggle("invalid", !!message);
  group.classList.toggle("valid", !message && String(field.value).trim() !== "");
  if (err) err.textContent = message || "";
  field.setAttribute("aria-invalid", message ? "true" : "false");
}

function validateField(form, name, rules) {
  const field = form.elements[name];
  if (!field || !rules[name]) return true;
  const value = field.type === "checkbox" ? (field.checked ? "yes" : "") : field.value;
  for (const [test, message] of rules[name]) {
    if (!test(value, form)) {
      setFieldState(field, message);
      return false;
    }
  }
  setFieldState(field, "");
  return true;
}

function attachValidation(form, rules, onValid) {
  form.setAttribute("novalidate", "");
  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    if (!field) return;
    const evt = field.tagName === "SELECT" || field.type === "checkbox" || field.type === "date" ? "change" : "blur";
    field.addEventListener(evt, () => validateField(form, name, rules));
    field.addEventListener("input", () => {
      if (field.closest(".form-group")?.classList.contains("invalid")) validateField(form, name, rules);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const results = Object.keys(rules).map((name) => validateField(form, name, rules));
    if (results.every(Boolean)) {
      onValid(Object.fromEntries(new FormData(form)), form);
    } else {
      const firstBad = qs(".form-group.invalid input, .form-group.invalid select, .form-group.invalid textarea", form);
      if (firstBad) firstBad.focus();
      toast("Please fix the highlighted fields.", "error");
    }
  });
}

/* Password show/hide + strength meter */
function initPasswordTools(root = document) {
  qsa(".toggle-pass", root).forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.textContent = show ? "Hide" : "Show";
    });
  });
}

function passwordScore(v) {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
  if (/\d/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) s++;
  return s;
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  initPasswordTools();
  initReveal();
});
