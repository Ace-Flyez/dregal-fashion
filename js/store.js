const savedTheme = localStorage.getItem("dregal-theme") || "system";
const systemPrefersDark = () => window.matchMedia?.("(prefers-color-scheme: dark)").matches || false;
const resolveTheme = (preference) => preference === "system" ? (systemPrefersDark() ? "dark" : "light") : preference;
document.documentElement.dataset.theme = resolveTheme(savedTheme);
document.documentElement.dataset.themePreference = savedTheme;
const CART_KEY = "dregal-cart";
const WISHLIST_KEY = "dregal-wishlist";
const WHATSAPP_NUMBER = "2347031605920";
const INSTAGRAM_URL = "https://www.instagram.com/dregalcouture/";
window.dregalCompliance ||= {
  validateEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim()),
  getConsent: () => JSON.parse(localStorage.getItem("dregal-consent-v1") || "null"),
  setConsent: (value) => localStorage.setItem("dregal-consent-v1", JSON.stringify({ ...value, updatedAt: new Date().toISOString() })),
};
const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
};
const getWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
};
function isSaved(id) {
  return getWishlist().some((item) => item.id === id);
}
function toggleWishlist(item) {
  const list = getWishlist();
  const wasSaved = isSaved(item.id);
  const next = wasSaved
    ? list.filter((saved) => saved.id !== item.id)
    : [...list, item];
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
  return !wasSaved;
}
function syncWishlistButtons(productId, saved, productName) {
  document.querySelectorAll(`[data-save-product="${productId}"]`).forEach((button) => {
    button.classList.toggle("is-saved", saved);
    button.setAttribute("aria-pressed", String(saved));
    button.setAttribute("aria-label", `${saved ? "Remove" : "Save"} ${productName}`);
  });
}
function updateWishlistCount() {
  document
    .querySelectorAll("[data-wishlist-count]")
    .forEach((el) => {
      const count = getWishlist().length;
      el.textContent = count;
      el.hidden = count === 0;
    });
}
function showToast(message) {
  let toast = document.querySelector("[data-toast]");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "site-toast";
    toast.dataset.toast = "";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.replaceChildren();
  const icon = document.createElement("span");
  icon.className = "site-toast__icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "✓";
  const copy = document.createElement("span");
  copy.textContent = message;
  toast.append(icon, copy);
  toast.classList.add("is-visible");
  clearTimeout(window.dregalToastTimer);
  window.dregalToastTimer = setTimeout(
    () => toast.classList.remove("is-visible"),
    2600,
  );
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
  renderCart();
}
function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document
    .querySelectorAll("[data-cart-count]")
    .forEach((el) => {
      el.textContent = count;
      el.hidden = count === 0;
    });
}
function cartSubtotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}
function makeWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
function cartWhatsAppMessage() {
  const items = getCart();
  if (!items.length) return "Hello D’REGAL, I would like to make an enquiry.";
  const lines = items.map(
    (item) =>
      `• ${item.name} | ${formatPrice(item.price)} × ${item.quantity}${item.colour ? ` | ${item.colour}` : ""}`,
  );
  return `Hello D’REGAL, I would like to enquire about this order:\n\n${lines.join("\n")}\n\nSubtotal: ${formatPrice(cartSubtotal())}\n\nPlease confirm availability, payment and delivery arrangements.`;
}
function openCart() {
  document.querySelector("[data-cart-drawer]")?.classList.add("is-open");
  document.querySelector("[data-cart-scrim]")?.classList.add("is-open");
  document
    .querySelector("[data-cart-drawer]")
    ?.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
}
function closeCart() {
  document.querySelector("[data-cart-drawer]")?.classList.remove("is-open");
  document.querySelector("[data-cart-scrim]")?.classList.remove("is-open");
  document
    .querySelector("[data-cart-drawer]")
    ?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cart-open");
}
function addToCart(item) {
  const cart = getCart();
  const match = cart.find((x) => x.id === item.id && x.colour === item.colour);
  if (match) match.quantity += item.quantity;
  else cart.push(item);
  saveCart(cart);
  openCart();
}
function renderCart() {
  const host = document.querySelector("[data-cart-items]");
  if (!host) return;
  const cart = getCart();
  host.innerHTML = cart.length
    ? cart
        .map(
          (item, i) => `
    <article class="cart-line">
      <img src="${item.image}" alt="${item.name}" loading="lazy">
      <div class="cart-line__body"><h3>${item.name}</h3><p>${item.colour || "Options to be confirmed"}</p><strong>${formatPrice(item.price)}</strong>
        <div class="cart-line__controls"><button data-cart-change="${i}" data-delta="-1" aria-label="Decrease ${item.name}">−</button><span>${item.quantity}</span><button data-cart-change="${i}" data-delta="1" aria-label="Increase ${item.name}">+</button><button class="remove-link" data-cart-remove="${i}">Remove</button></div>
      </div>
    </article>`,
        )
        .join("")
    : '<div class="cart-empty"><span class="cart-empty__icon">✳</span><h3>Your bag is taking a breather.</h3><p>Find a piece that feels like you.</p><a class="text-link" href="shop.html">Explore the collection </a></div>';
  document
    .querySelectorAll("[data-cart-subtotal]")
    .forEach((el) => (el.textContent = formatPrice(cartSubtotal())));
  document
    .querySelectorAll("[data-cart-whatsapp]")
    .forEach((el) => (el.href = makeWhatsAppLink(cartWhatsAppMessage())));
  document.querySelectorAll("[data-currency-toggle]").forEach((btn) => {
    btn.innerHTML =
      '<svg class="currency-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M8 9.5h8M8 14.5h8M12 6v12"/></svg><span class="sr-only">Switch currency</span>';
  });
  updateCartCount();
  updateWishlistCount();
}
window.dregalIcon = (name, className = "") => {
  const paths = {
    search: '<circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 5 5"/>',
    heart: '<path d="M20.8 8.7c0 5.2-8.8 10-8.8 10S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/>',
    bag: '<path d="M6.5 8.5h11l1 12h-13l1-12Z"/><path d="M9 9V6.5a3 3 0 0 1 6 0V9"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
  };
  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || ""}</svg>`;
};
window.dregalIconNode = (name, className = "") => {
  const template = document.createElement("template");
  template.innerHTML = window.dregalIcon(name, className);
  return template.content.firstElementChild;
};
window.decorateCarouselControls = (root = document) => {
  root.querySelectorAll(".carousel-arrow").forEach((button) => {
    const direction = button.classList.contains("carousel-arrow--prev") ? "prev" : "next";
    const icon = window.dregalIconNode("chevron", "carousel-icon");
    if (!icon) return;
    icon.dataset.direction = direction;
    button.replaceChildren(icon);
  });
};
window.productCard = function productCard(p, index = 0, options = {}) {
  const unavailable = p.availability !== "available";
  const availabilityLabel = p.availability === "out-of-stock" ? "OUT OF STOCK" : "COMING SOON";
  const badge = unavailable ? `<span class="availability-badge availability-badge--${p.availability}">${availabilityLabel}</span>` : "";
  const status = unavailable ? (p.availability === "out-of-stock" ? "Out of stock" : "Coming soon") : (p.type === "custom-made" ? "Custom-made" : "Ready-made");
  const action = unavailable ? "" : `<button class="product-add" data-add-product="${p.id}" aria-label="Add ${p.name} to bag">${dregalIcon("plus", "quick-add-icon")}</button>`;
  const inlineAction = options.context === "wishlist" ? "" : action;
  const remove = options.context === "wishlist" ? `<button class="text-link" type="button" data-remove-saved="${p.id}">Remove</button>` : "";
  const availability = options.context === "wishlist" ? `<p class="wishlist-availability">${status}</p>` : "";
  const saved = isSaved(p.id);
  const savedButton = `<button class="product-save ${saved ? "is-saved" : ""}" data-save-product="${p.id}" aria-pressed="${saved}" aria-label="${saved ? "Remove" : "Save"} ${p.name}">${dregalIcon("heart", "heart-icon")}</button>`;
  return `<article class="product-card ${options.context === "wishlist" ? "wishlist-card" : ""}" style="--card-index:${index}"><div class="product-card__visual-wrap"><a class="product-card__visual ${unavailable ? "is-unavailable" : ""}" href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy">${badge}</a>${savedButton}</div><div class="product-card__meta"><div><p class="product-category">${(p.category || "piece").replaceAll("-", " ")}</p><h3><a href="product.html?id=${p.id}">${p.name}</a></h3></div><div class="product-price">${p.price ? `<strong>${formatPrice(p.price)}</strong>` : "<strong>Details announced soon</strong>"}${inlineAction}</div></div>${availability}${remove ? `<div class="wishlist-card__actions">${action}${remove}</div>` : ""}</article>`;
};
window.setupDregalCarousels = function setupDregalCarousels(root = document) {
  root.querySelectorAll(".carousel-shell").forEach((shell) => {
    const row = shell.querySelector(".product-carousel");
    const previous = shell.querySelector(".carousel-arrow--prev");
    const next = shell.querySelector(".carousel-arrow--next");
    if (!row || !previous || !next || shell.dataset.carouselReady) return;
    shell.dataset.carouselReady = "true";
    const step = () => Math.max(row.clientWidth * 0.82, 240);
    const update = () => { previous.disabled = row.scrollLeft <= 4; next.disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4; };
    previous.addEventListener("click", () => row.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => row.scrollBy({ left: step(), behavior: "smooth" }));
    row.addEventListener("scroll", update, { passive: true });
    row.addEventListener("keydown", (event) => { if (event.key === "ArrowLeft") previous.click(); if (event.key === "ArrowRight") next.click(); });
    new ResizeObserver(update).observe(row);
    update();
  });
};
const NAVIGATION_ICONS = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
  shop: '<path d="M4 8h16l-1 12H5L4 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  story: '<path d="M3 5.5c3.2-.9 6.2-.5 9 1.2v13c-2.8-1.7-5.8-2.1-9-1.2zM21 5.5c-3.2-.9-6.2-.5-9 1.2v13c2.8-1.7 5.8-2.1-9-1.2z"/>',
  contact: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  faq: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.2 1.8c-1.2 1-1.8 1.4-1.8 3M12 17.5v.1"/>',
  wishlist: '<path d="M20.8 8.7c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/>',
  bag: '<path d="M6.5 8.5h11l1 12h-13l1-12Z"/><path d="M9 9V6.5a3 3 0 0 1 6 0V9"/>',
  moon: '<path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
};
NAVIGATION_ICONS.story = '<path d="M3 5.5c3-.8 6.1-.3 9 1.3v13c-2.9-1.6-6-2.1-9-1.3zM21 5.5c-3-.8-6.1-.3-9 1.3v13c2.9-1.6 6-2.1 9-1.3z"/>';
const PRIMARY_NAVIGATION = [
  { label: "Home", href: "index.html", icon: "home" },
  { label: "Shop", href: "shop.html", icon: "shop" },
  { label: "Our Story", href: "about.html", icon: "story" },
  { label: "Contact", href: "contact.html", icon: "contact" },
  { label: "FAQ", href: "faq.html", icon: "faq" },
];
const navIcon = (name, className = "") => `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${NAVIGATION_ICONS[name]}</svg>`;
const renderPrimaryNavigation = (context) => `<nav class="${context === "desktop" ? "desktop-sidebar__nav" : "mobile-drawer-primary"}" aria-label="Primary pages">${PRIMARY_NAVIGATION.map((item) => `<a href="${item.href}" data-nav-page="${item.href}" data-drawer-page="${item.href}">${navIcon(item.icon, context === "desktop" ? "sidebar-nav-icon" : "drawer-nav-icon")}<span>${item.label}</span></a>`).join("")}</nav>`;
const renderSidebar = () => `<aside class="desktop-sidebar" aria-label="Primary navigation"><a class="desktop-sidebar__brand" href="index.html">D’REGAL<small>BEYOND THE ORDINARY</small></a>${renderPrimaryNavigation("desktop")}<div class="desktop-sidebar__foot"><a href="wishlist.html">${navIcon("wishlist", "sidebar-nav-icon")}<span>Wishlist</span><span class="sidebar-count" data-wishlist-count hidden>0</span></a><button type="button" data-sidebar-bag>${navIcon("bag", "sidebar-nav-icon")}<span>Shopping Bag</span><span class="sidebar-count" data-cart-count hidden>0</span></button><button type="button" data-sidebar-theme>${navIcon("moon", "sidebar-theme-icon")}<span class="sidebar-theme-copy"><strong>Appearance</strong><small data-sidebar-theme-label>System</small></span>${navIcon("chevron", "sidebar-chevron")}</button></div></aside>`;
function renderHeader() {
  const host = document.querySelector("[data-site-header]");
  if (!host) return;
  if (!document.querySelector('link[data-dregal-header-style]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "css/header.css";
    stylesheet.dataset.dregalHeaderStyle = "";
    document.head.append(stylesheet);
  }
  host.innerHTML = `
    ${renderSidebar()}
    <div class="announcement"><span>Contemporary pieces. Made to feel like you.</span><a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noreferrer">Speak with us <span></span></a></div>
    <nav class="site-nav" aria-label="Main navigation">
      <button class="menu-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-menu"><i></i><i></i></button>
      <a class="wordmark" href="index.html" aria-label="D’REGAL home">D’REGAL<small>BEYOND THE ORDINARY</small></a>
      <div class="nav-tools"><button class="mobile-search-button" type="button" aria-label="Search"><svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 5 5"/></svg></button><button class="currency-toggle" data-currency-toggle aria-label="Switch currency">NGN / USD</button><button class="wishlist-toggle" data-wishlist-toggle aria-label="View saved pieces" aria-pressed="false"><span class="sr-only">Saved pieces</span></button><button class="bag-toggle" data-cart-toggle aria-label="Open shopping bag"><span class="sr-only">Shopping bag</span></button></div>
    </nav>
    <button class="dregal-backdrop" data-drawer-backdrop aria-label="Close navigation" hidden></button>
    <aside class="dregal-drawer" id="primary-menu" aria-label="Main navigation" aria-hidden="true" inert></aside>
    <aside class="cart-drawer" data-cart-drawer aria-label="Shopping bag" aria-hidden="true">
      <div class="cart-head"><div><p class="eyebrow">Your selection</p><h2>Your bag <span data-cart-count>0</span></h2></div><button class="close-cart" data-cart-close aria-label="Close shopping bag">×</button></div>
      <div class="cart-items" data-cart-items></div>
      <div class="cart-foot"><div class="subtotal"><span>Subtotal</span><strong data-cart-subtotal>₦0</strong></div><a class="button button--dark button--wide" data-cart-whatsapp href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noreferrer">Continue on WhatsApp <span></span></a><p>Payment and delivery arrangements are confirmed directly with D’REGAL.</p></div>
    </aside><button class="cart-scrim" data-cart-scrim aria-label="Close shopping bag"></button>`;
  const themeIcon = host.querySelector(".sidebar-theme-icon");
  if (themeIcon?.tagName.toLowerCase() === "svg") {
    const wrapper = document.createElement("span");
    wrapper.className = "sidebar-theme-icon";
    wrapper.setAttribute("aria-hidden", "true");
    themeIcon.replaceWith(wrapper);
  }
}
function renderFooter() {
  document.querySelectorAll("[data-site-footer]").forEach(
    (host) =>
      (host.innerHTML = `
    <section class="footer-cta"><div><p class="eyebrow">A piece, a feeling, a point of view.</p><h2>Find your kind<br>of <em>ordinary.</em></h2></div><a class="button button--light" href="shop.html">Explore D’REGAL <span></span></a></section>
    <div class="footer-main"><div class="footer-brand"><a class="wordmark wordmark--footer" href="index.html">D’REGAL<small>BEYOND THE ORDINARY</small></a><p>Contemporary fashion for effortless style, comfort and expression.</p></div>
      <div><p class="footer-label">Explore</p><a href="shop.html">Shop all</a><a href="about.html">Our story</a><a href="faq.html">FAQs</a></div>
      <div><p class="footer-label">Connect</p><a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noreferrer">WhatsApp</a><a href="mailto:dregal@gmail.com">Email</a><a href="${INSTAGRAM_URL}" target="_blank" rel="noreferrer">Instagram</a></div>
      <div><p class="footer-label">Find us</p><span>Lagos, Nigeria</span><span>Ibadan, Nigeria</span><span>Worldwide enquiries</span><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="refund-policy.html">Refunds</a><a href="subprocessors.html">Subprocessors</a><a href="data-requests.html">Your data</a></div>
    </div><div class="footer-bottom"><span>© ${new Date().getFullYear()} D’REGAL</span><span>BEYOND THE ORDINARY</span><a href="#top">Back to top </a></div>`),
  );
}
function initialiseCompliance() {
  if (!window.dregalCompliance) return;
  const saved = window.dregalCompliance.getConsent();
  if (!saved) {
    const banner = document.createElement("section");
    banner.className = "cookie-banner";
    banner.setAttribute("aria-label", "Cookie preferences");
    banner.innerHTML = '<div><strong>Privacy choices</strong><p>We use essential storage for site functions. Optional analytics and marketing storage stay off unless you choose them.</p></div><div class="cookie-actions"><button class="button button--outline" data-cookie="necessary">Essential only</button><button class="button button--dark" data-cookie="all">Allow optional</button><a class="text-link" href="privacy.html">Learn more</a></div>';
    document.body.append(banner);
    banner.addEventListener("click", (event) => {
      const choice = event.target.closest("[data-cookie]")?.dataset.cookie;
      if (!choice) return;
      window.dregalCompliance.setConsent({ necessary: true, analytics: choice === "all", marketing: choice === "all" });
      banner.remove();
    });
  }
  document.querySelectorAll("[data-marketing-consent]").forEach((input) => input.addEventListener("change", () => {
    const current = window.dregalCompliance.getConsent() || { necessary: true };
    window.dregalCompliance.setConsent({ ...current, marketing: input.checked });
  }));
}
function initialiseSite() {
  renderHeader();
  document.body.classList.remove("mobile-menu-open");
  const navLinks = document.querySelector(".dregal-drawer");
  if (navLinks) {
    navLinks.setAttribute("aria-label", "Mobile navigation");
    navLinks.innerHTML = `
      <div class="mobile-drawer-head">
        <a class="mobile-drawer-brand" href="index.html" aria-label="D’REGAL home">D’REGAL<small>BEYOND THE ORDINARY</small></a>
        <button type="button" class="mobile-drawer-close" aria-label="Close navigation"><span aria-hidden="true">×</span></button>
      </div>
      <div class="mobile-drawer-primary" aria-label="Pages"></div>
      <div class="mobile-drawer-divider"></div>
      <div class="mobile-drawer-quicklinks">
        <a href="wishlist.html"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.7c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/></svg><span>Wishlist</span><span class="drawer-count" data-wishlist-count hidden>0</span></a>
        <button type="button" data-drawer-bag><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5h11l1 12h-13l1-12Z"/><path d="M9 9V6.5a3 3 0 0 1 6 0V9"/></svg><span>Shopping Bag</span><span class="drawer-count" data-cart-count hidden>0</span></button>
      </div>
      <a class="mobile-drawer-story" href="about.html"><strong>Contemporary fashion.<br>Room to be yourself.</strong></a>
      <div class="mobile-drawer-appearance">
        <button class="mobile-appearance-trigger" type="button" aria-expanded="false" aria-controls="appearance-options" aria-label="Appearance settings, currently system"><span class="mobile-appearance-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/></svg></span><span><strong>Appearance</strong><small data-appearance-current>System</small></span><svg class="appearance-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button>
        <div class="mobile-appearance-options" id="appearance-options" hidden>
          <button type="button" data-theme-choice="light">Light</button><button type="button" data-theme-choice="dark">Dark</button><button type="button" data-theme-choice="system">System</button>
        </div>
      </div>`;
    navLinks.querySelectorAll(":scope > a[data-drawer-page]").forEach((link) => link.remove());
    navLinks.querySelector(".mobile-drawer-primary")?.replaceWith(document.createRange().createContextualFragment(renderPrimaryNavigation("mobile")).firstElementChild);
    const appearanceLabel = navLinks.querySelector(".mobile-appearance-trigger strong");
    if (appearanceLabel) appearanceLabel.textContent = "Appearance";
    navLinks.querySelector(".mobile-appearance-trigger")?.setAttribute("aria-label", "Appearance settings, currently system");
    const currentPage = location.pathname.split("/").pop() || "index.html";
    const activePage = currentPage === "product.html" ? "shop.html" : currentPage;
    navLinks.querySelector(`[data-drawer-page="${activePage}"]`)?.classList.add("is-active");
    navLinks.querySelector(`[data-drawer-page="${activePage}"]`)?.setAttribute("aria-current", "page");
  }
  const themeButton = document.createElement("button");
  themeButton.className = "theme-toggle";
  themeButton.type = "button";
  themeButton.dataset.themeToggle = "";
  themeButton.setAttribute("aria-label", document.documentElement.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  themeButton.innerHTML = '<span aria-hidden="true"><svg class="theme-icon" viewBox="0 0 24 24"><path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/></svg></span>';
  document.querySelector(".nav-tools")?.prepend(themeButton);
  const sidebarTheme = document.querySelector("[data-sidebar-theme]");
  const syncThemeLabels = () => {
    const preference = localStorage.getItem("dregal-theme") || "system";
    const dark = document.documentElement.dataset.theme === "dark";
    sidebarTheme?.querySelector("[data-sidebar-theme-label]")?.replaceChildren(document.createTextNode(preference.charAt(0).toUpperCase() + preference.slice(1)));
    sidebarTheme?.querySelector(".sidebar-theme-icon")?.replaceChildren(document.createRange().createContextualFragment(dark ? '<svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' : '<svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/></svg>'));
    const current = document.querySelector("[data-appearance-current]");
    if (current) current.textContent = preference.charAt(0).toUpperCase() + preference.slice(1);
    document.querySelector(".mobile-appearance-trigger")?.setAttribute("aria-label", `Appearance settings, currently ${preference}`);
    document.querySelectorAll("[data-theme-choice]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.themeChoice === preference)));
  };
  const setThemePreference = (preference) => {
    localStorage.setItem("dregal-theme", preference);
    document.documentElement.dataset.themePreference = preference;
    document.documentElement.dataset.theme = resolveTheme(preference);
    syncThemeLabels();
  };
  window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
    if ((localStorage.getItem("dregal-theme") || "system") === "system") setThemePreference("system");
  });
  syncThemeLabels();
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".desktop-sidebar [data-nav-page]").forEach((link) => {
    if (link.pathname.split("/").pop() === currentPage) link.classList.add("is-active");
    if (link.pathname.split("/").pop() === currentPage) link.setAttribute("aria-current", "page");
  });
  const currencyButton = document.querySelector("[data-currency-toggle]");
  if (currencyButton)
    currencyButton.innerHTML =
      '<span class="currency-label">NGN / USD</span><span class="sr-only">Switch currency</span>';
  const bagButton = document.querySelector("[data-cart-toggle]");
  if (bagButton)
    bagButton.innerHTML = '<svg class="bag-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5h11l1 12h-13l1-12Z"/><path d="M9 9V6.5a3 3 0 0 1 6 0V9"/></svg><span data-cart-count>0</span><span class="sr-only">Bag</span>'; 
  const wishlistButton = document.querySelector("[data-wishlist-toggle]");
  if (wishlistButton)
    wishlistButton.outerHTML =
      '<a class="wishlist-toggle" data-wishlist-link href="wishlist.html" aria-label="View saved pieces"><svg class="heart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.7c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/></svg><span data-wishlist-count>0</span></a>';
  const searchBar = document.createElement("div");
  searchBar.className = "dregal-search";
  searchBar.innerHTML = '<input type="search" placeholder="Search pieces, colours or categories" aria-label="Search D’REGAL"><button class="header-search-button" type="button" aria-label="Search"><svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 5 5"/></svg></button>';
  document.querySelector(".site-nav")?.insertBefore(searchBar, document.querySelector(".nav-tools"));
  const searchOverlay = document.createElement("div");
  searchOverlay.className = "search-overlay";
  searchOverlay.innerHTML =
    '<div class="search-overlay__inner"><button class="search-overlay__close" aria-label="Close search">×</button><p class="eyebrow">Search D’REGAL</p><form><input type="search" placeholder="Search pieces, colours or categories" aria-label="Search pieces"><button class="button button--dark" type="submit">Search</button></form></div>';
  document.body.append(searchOverlay);
  const searchButton = searchBar.querySelector(".header-search-button");
  const mobileSearchButton = document.querySelector(".mobile-search-button");
  const syncSearchControls = () => {
    const mobile = window.matchMedia?.("(max-width: 760px)").matches ?? false;
    if (mobileSearchButton) mobileSearchButton.hidden = !mobile;
    searchBar.hidden = mobile;
  };
  syncSearchControls();
  window.matchMedia?.("(max-width: 760px)")?.addEventListener?.("change", syncSearchControls);
  const searchInput = searchBar.querySelector("input");
  const openSearch = () => {
    searchOverlay.classList.add("is-open");
    searchOverlay.querySelector("input").focus();
  };
  searchButton.addEventListener("click", openSearch);
  mobileSearchButton?.addEventListener("click", openSearch);
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && searchInput.value.trim()) location.href = `shop.html?search=${encodeURIComponent(searchInput.value.trim())}`;
  });
  searchOverlay
    .querySelector(".search-overlay__close")
    .addEventListener("click", () => searchOverlay.classList.remove("is-open"));
  searchOverlay.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    location.href = `shop.html?search=${encodeURIComponent(searchOverlay.querySelector("input").value)}`;
  });
  renderFooter();
  renderCart();
  let drawerTrigger = null;
  const closeMobileDrawer = () => {
    const drawer = document.querySelector(".dregal-drawer");
    drawer?.classList.remove("is-open");
    drawer?.setAttribute("aria-hidden", "true");
    if (drawer) drawer.inert = true;
    const backdrop = document.querySelector("[data-drawer-backdrop]");
    if (backdrop) backdrop.hidden = true;
    document.body.classList.remove("mobile-menu-open");
    document.querySelector(".menu-toggle")?.setAttribute("aria-expanded", "false");
    document.querySelector(".menu-toggle")?.setAttribute("aria-label", "Open navigation");
    drawerTrigger?.focus();
    drawerTrigger = null;
  };
  document.addEventListener("click", (event) => {
    const saveButton = event.target.closest("[data-save-product]");
    if (saveButton) {
      const product = getProduct(saveButton.dataset.saveProduct);
      if (product) {
        const saved = toggleWishlist(product);
        syncWishlistButtons(product.id, saved, product.name);
        updateWishlistCount();
        showToast(saved ? "Added to saved pieces" : "Removed from saved pieces");
      }
      return;
    }
    if (event.target.closest("[data-drawer-bag]")) { openCart(); closeMobileDrawer(); }
    const appearanceTrigger = event.target.closest(".mobile-appearance-trigger");
    if (appearanceTrigger) {
      event.preventDefault();
      const options = appearanceTrigger.closest(".mobile-drawer-appearance")?.querySelector(".mobile-appearance-options");
      const expanded = appearanceTrigger.getAttribute("aria-expanded") === "true";
      appearanceTrigger.setAttribute("aria-expanded", String(!expanded));
      if (options) options.hidden = expanded;
      return;
    }
    const themeChoice = event.target.closest("[data-theme-choice]");
    if (themeChoice) {
      event.preventDefault();
      setThemePreference(themeChoice.dataset.themeChoice);
      return;
    }
    if (event.target.closest("[data-mobile-currency]")) document.querySelector("[data-currency-toggle]")?.click();
    if (event.target.closest("[data-mobile-theme]")) document.querySelector("[data-theme-toggle]")?.click();
    if (event.target.closest("[data-sidebar-bag]")) openCart();
    if (event.target.closest("[data-sidebar-theme], [data-theme-toggle]")) {
      setThemePreference(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    }
    const menuBtn = event.target.closest(".menu-toggle");
    if (menuBtn) {
      const menu = document.querySelector(".dregal-drawer");
      drawerTrigger = menuBtn;
      const open = menu.classList.toggle("is-open");
      document.body.classList.toggle("mobile-menu-open", open);
      menu.setAttribute("aria-hidden", String(!open));
      menu.inert = !open;
      const backdrop = document.querySelector("[data-drawer-backdrop]");
      if (backdrop) backdrop.hidden = !open;
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      if (open) navLinks.querySelector("a")?.focus();
    }
    if (event.target.closest(".mobile-drawer-close")) {
      closeMobileDrawer();
    }
    if (event.target.closest("[data-drawer-backdrop]")) {
      closeMobileDrawer();
    }
    if (document.body.classList.contains("mobile-menu-open") && !event.target.closest(".dregal-drawer, .menu-toggle, [data-drawer-backdrop]")) {
      closeMobileDrawer();
    }
    if (event.target.closest(".dregal-drawer a")) {
      closeMobileDrawer();
    }
    if (event.target.closest("[data-cart-toggle]")) openCart();
    if (event.target.closest("[data-cart-close], [data-cart-scrim]"))
      closeCart();
    const change = event.target.closest("[data-cart-change]");
    if (change) {
      const cart = getCart();
      const i = Number(change.dataset.cartChange);
      cart[i].quantity += Number(change.dataset.delta);
      if (cart[i].quantity < 1) cart.splice(i, 1);
      saveCart(cart);
    }
    const remove = event.target.closest("[data-cart-remove]");
    if (remove) {
      const cart = getCart();
      cart.splice(Number(remove.dataset.cartRemove), 1);
      saveCart(cart);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCart();
      closeMobileDrawer();
    }
  });
  document.querySelectorAll(".faq-item button").forEach((button) =>
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const open = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
    }),
  );
  document.querySelectorAll("[data-contact-form]").forEach((form) =>
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const d = new FormData(form);
      const msg = `Hello D’REGAL, my name is ${d.get("name")}.\n\n${d.get("message")}\n\nReply email: ${d.get("email")}`;
      window.open(makeWhatsAppLink(msg), "_blank", "noopener");
    }),
  );
  document.querySelectorAll("[data-newsletter]").forEach((form) =>
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const note = form.querySelector("[data-form-note]");
      if (note)
        note.textContent =
          "Thank you. Newsletter sign-up will be enabled when D’REGAL connects an email service.";
      form.reset();
    }),
  );
  document.querySelectorAll("[data-currency-toggle]").forEach((btn) =>
    btn.addEventListener("click", () => {
      window.dregalCurrency = window.dregalCurrency === "USD" ? "NGN" : "USD";
      localStorage.setItem("dregal-currency", window.dregalCurrency);
      location.reload();
    }),
  );
  window.dregalCurrency = localStorage.getItem("dregal-currency") || "NGN";
  window.dregalExchangeRate =
    Number(localStorage.getItem("dregal-usd-ngn-rate")) || 1500;
  fetch("https://open.er-api.com/v6/latest/USD")
    .then((response) => response.json())
    .then((data) => {
      if (Number.isFinite(data?.rates?.NGN)) {
        window.dregalExchangeRate = data.rates.NGN;
        localStorage.setItem(
          "dregal-usd-ngn-rate",
          String(window.dregalExchangeRate),
        );
        document.querySelectorAll("[data-product-price]").forEach((el) => {
          const product = getProduct(el.dataset.productPrice);
          if (product) el.textContent = formatPrice(product.price);
        });
      }
    })
    .catch(() => {});
  document.querySelectorAll("[data-currency-toggle]").forEach((btn) => {
    btn.innerHTML =
      '<span class="currency-label">NGN / USD</span><span class="sr-only">Switch currency</span>';
  });
  updateCartCount();
  initialiseCompliance();
}
document.addEventListener("DOMContentLoaded", initialiseSite);
document.addEventListener("click", (event) => {
  const link = event.target.closest(".option-row a");
  if (link) {
    event.preventDefault();
    location.href = "size-guide.html";
  }
});
