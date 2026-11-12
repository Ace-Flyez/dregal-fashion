const CART_KEY = "dregal-cart";
const WISHLIST_KEY = "dregal-wishlist";
const WHATSAPP_NUMBER = "2347031605920";
const INSTAGRAM_URL = "https://www.instagram.com/dregalcouture/";
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
  toast.textContent = message;
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
function renderHeader() {
  const host = document.querySelector("[data-site-header]");
  if (!host) return;
  host.innerHTML = `
    <div class="announcement"><span>Contemporary pieces. Made to feel like you.</span><a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noreferrer">Speak with us <span></span></a></div>
    <nav class="site-nav" aria-label="Main navigation">
      <button class="menu-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-menu"><i></i><i></i></button>
      <a class="wordmark" href="index.html" aria-label="D’REGAL home">D’REGAL<span>.</span><small>BEYOND THE ORDINARY</small></a>
      <div class="nav-links" id="primary-menu"><a href="shop.html">Shop</a><a href="about.html">Our point of view</a><a href="contact.html">Contact</a></div>
      <div class="nav-tools"><button class="currency-toggle" data-currency-toggle aria-label="Switch currency">₦ / $</button><button class="wishlist-toggle" data-wishlist-toggle aria-label="View saved pieces" aria-pressed="false"><span aria-hidden="true">♡</span><span class="sr-only">Saved pieces</span></button><button class="bag-toggle" data-cart-toggle aria-label="Open shopping bag">Bag <span data-cart-count>0</span></button></div>
    </nav>
    <aside class="cart-drawer" data-cart-drawer aria-label="Shopping bag" aria-hidden="true">
      <div class="cart-head"><div><p class="eyebrow">Your selection</p><h2>Your bag <span data-cart-count>0</span></h2></div><button class="close-cart" data-cart-close aria-label="Close shopping bag">×</button></div>
      <div class="cart-items" data-cart-items></div>
      <div class="cart-foot"><div class="subtotal"><span>Subtotal</span><strong data-cart-subtotal>₦0</strong></div><a class="button button--dark button--wide" data-cart-whatsapp href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noreferrer">Continue on WhatsApp <span></span></a><p>Payment and delivery arrangements are confirmed directly with D’REGAL.</p></div>
    </aside><button class="cart-scrim" data-cart-scrim aria-label="Close shopping bag"></button>`;
}
function renderFooter() {
  document.querySelectorAll("[data-site-footer]").forEach(
    (host) =>
      (host.innerHTML = `
    <section class="footer-cta"><div><p class="eyebrow">A piece, a feeling, a point of view.</p><h2>Find your kind<br>of <em>ordinary.</em></h2></div><a class="button button--light" href="shop.html">Explore D’REGAL <span></span></a></section>
    <div class="footer-main"><div class="footer-brand"><a class="wordmark wordmark--footer" href="index.html">D’REGAL<span>.</span><small>BEYOND THE ORDINARY</small></a><p>Contemporary fashion for effortless style, comfort and expression.</p></div>
      <div><p class="footer-label">Explore</p><a href="shop.html">Shop all</a><a href="about.html">Our story</a><a href="faq.html">FAQs</a></div>
      <div><p class="footer-label">Connect</p><a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noreferrer">WhatsApp</a><a href="mailto:dregal@gmail.com">Email</a><a href="${INSTAGRAM_URL}" target="_blank" rel="noreferrer">Instagram</a></div>
      <div><p class="footer-label">Find us</p><span>Lagos, Nigeria</span><span>Ibadan, Nigeria</span><span>Worldwide enquiries</span></div>
    </div><div class="footer-bottom"><span>© ${new Date().getFullYear()} D’REGAL</span><span>BEYOND THE ORDINARY</span><a href="#top">Back to top </a></div>`),
  );
}
function initialiseSite() {
  renderHeader();
  const currencyButton = document.querySelector("[data-currency-toggle]");
  if (currencyButton)
    currencyButton.innerHTML =
      '<span class="currency-label">NGN / USD</span><span class="sr-only">Switch currency</span>';
  const bagButton = document.querySelector("[data-cart-toggle]");
  if (bagButton)
    bagButton.innerHTML =
      '<svg class="bag-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5h11l1 12h-13l1-12Z"/><path d="M9 9V6.5a3 3 0 0 1 6 0V9"/></svg><span data-cart-count>0</span><span class="sr-only">Bag</span>';
  const wishlistButton = document.querySelector("[data-wishlist-toggle]");
  if (wishlistButton)
    wishlistButton.outerHTML =
      '<a class="wishlist-toggle" data-wishlist-link href="wishlist.html" aria-label="View saved pieces"><svg class="heart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.7c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/></svg><span data-wishlist-count>0</span></a>';
  const searchButton = document.createElement("button");
  searchButton.className = "header-search-button";
  searchButton.type = "button";
  searchButton.setAttribute("aria-label", "Search D’REGAL");
  searchButton.innerHTML =
    '<svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 5 5"/></svg>';
  document.querySelector(".nav-tools")?.prepend(searchButton);
  const searchOverlay = document.createElement("div");
  searchOverlay.className = "search-overlay";
  searchOverlay.innerHTML =
    '<div class="search-overlay__inner"><button class="search-overlay__close" aria-label="Close search">×</button><p class="eyebrow">Search D’REGAL</p><form><input type="search" placeholder="Search pieces, colours or categories" aria-label="Search pieces"><button class="button button--dark" type="submit">Search</button></form></div>';
  document.body.append(searchOverlay);
  searchButton.addEventListener("click", () => {
    searchOverlay.classList.add("is-open");
    searchOverlay.querySelector("input").focus();
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
  document.addEventListener("click", (event) => {
    const menuBtn = event.target.closest(".menu-toggle");
    if (menuBtn) {
      const menu = document.querySelector(".nav-links");
      const open = menu.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation",
      );
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
    if (event.key === "Escape") closeCart();
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
}
document.addEventListener("DOMContentLoaded", initialiseSite);
document.addEventListener("click", (event) => {
  const link = event.target.closest(".option-row a");
  if (link) {
    event.preventDefault();
    location.href = "size-guide.html";
  }
});
