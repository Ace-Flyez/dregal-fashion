function renderHeader() {
  const header = document.querySelector('[data-site-header]');
  if (!header) return;
  header.innerHTML = `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <div class="announcement">Nigeria & worldwide enquiries welcome <a href="https://wa.me/2347031605920" target="_blank" rel="noreferrer">Talk to us</a></div>
    <nav class="site-nav" aria-label="Main navigation">
      <a class="brand" href="index.html" aria-label="D'Regal home"><img src="assets/logo/dregal-logo.svg" alt="D'REGAL"></a>
      <button class="menu-button" aria-expanded="false" aria-controls="site-menu"><span></span><span></span><span></span><span class="sr-only">Open menu</span></button>
      <div class="nav-links" id="site-menu">
        <a href="shop.html">Shop</a><a href="about.html">Our story</a><a href="contact.html">Contact</a><a href="faq.html">FAQ</a>
      </div>
      <button class="cart-button" data-cart-toggle aria-expanded="false" aria-controls="cart-drawer">Bag <span data-cart-count>0</span></button>
    </nav>
    <aside class="cart-drawer" id="cart-drawer" aria-label="Shopping bag" aria-hidden="true"><div class="cart-drawer__header"><h2>Your bag</h2><button data-cart-close aria-label="Close bag">×</button></div><div data-cart-items></div><div class="cart-drawer__footer"><p>Subtotal <strong data-cart-subtotal>₦0</strong></p><a class="button button--dark" data-cart-whatsapp target="_blank" rel="noreferrer">Order via WhatsApp</a><p class="cart-note">Payment and delivery details are confirmed with D’REGAL.</p></div></aside><div class="cart-scrim" data-cart-close></div>`;
}

function renderFooter() {
  document.querySelectorAll('[data-site-footer]').forEach((footer) => {
    footer.innerHTML = `<div class="footer-grid"><div class="footer-brand"><a href="index.html"><img src="assets/logo/dregal-logo.svg" alt="D'REGAL"></a><p>A contemporary fashion house for confident, expressive dressing.</p></div><div><p class="footer-heading">Explore</p><div class="footer-links"><a href="shop.html">Shop</a><a href="about.html">Our story</a><a href="faq.html">FAQ</a></div></div><div><p class="footer-heading">Connect</p><div class="footer-links"><a href="https://wa.me/2347031605920" target="_blank" rel="noreferrer">WhatsApp</a><a href="mailto:dregal@gmail.com">Email</a><a href="https://www.instagram.com/dregalcouture?mdxt=MTl4bDUyYzJqYWtnNg==" target="_blank" rel="noreferrer">Instagram</a></div></div><div><p class="footer-heading">Visit</p><div class="footer-links"><span>Lagos, Nigeria</span><span>Ibadan, Nigeria</span><a href="contact.html">Custom enquiries</a></div></div></div><div class="footer-bottom"><p>© ${new Date().getFullYear()} D’REGAL</p><p>Made for expression</p></div>`;
  });
}

function renderCart() {
  const itemsContainer = document.querySelector('[data-cart-items]');
  if (!itemsContainer) return;
  const cart = getCart();
  itemsContainer.innerHTML = cart.length
    ? cart
        .map(
          (item, index) =>
            `<article class="cart-item"><img src="${item.image}" alt="${item.name}"><div><h3>${item.name}</h3><p>${item.colour || 'Details confirmed on enquiry'}</p><p>${formatPrice(item.price)} × ${item.quantity}</p><div class="quantity-controls"><button data-cart-quantity="${index}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-cart-quantity="${index}" data-change="1" aria-label="Increase quantity">+</button><button class="text-button" data-cart-remove="${index}">Remove</button></div></div></article>`
        )
        .join('')
    : `<div class="empty-state"><p>Your bag is ready when you are.</p><a href="shop.html">Explore the collection</a></div>`;
  document
    .querySelectorAll('[data-cart-subtotal]')
    .forEach((element) => (element.textContent = formatPrice(cartSubtotal())));
  document
    .querySelectorAll('[data-cart-whatsapp]')
    .forEach((link) => (link.href = makeWhatsAppLink(cartWhatsAppMessage())));
}

function initialiseCart() {
  document.addEventListener('click', (event) => {
    const target = event.target.closest(
      '[data-cart-toggle], [data-cart-close], [data-cart-quantity], [data-cart-remove]'
    );
    if (!target) return;
    if (target.hasAttribute('data-cart-toggle') || target.hasAttribute('data-cart-close')) {
      const drawer = document.querySelector('.cart-drawer');
      const isOpen = drawer.classList.toggle('is-open');
      document.querySelector('.cart-scrim').classList.toggle('is-open', isOpen);
      drawer.setAttribute('aria-hidden', String(!isOpen));
      target.setAttribute('aria-expanded', String(isOpen));
    }
    const cart = getCart();
    if (target.dataset.cartQuantity) {
      const item = cart[Number(target.dataset.cartQuantity)];
      item.quantity += Number(target.dataset.change);
      if (item.quantity < 1) cart.splice(Number(target.dataset.cartQuantity), 1);
      saveCart(cart);
      renderCart();
    }
    if (target.dataset.cartRemove) {
      cart.splice(Number(target.dataset.cartRemove), 1);
      saveCart(cart);
      renderCart();
    }
  });
  updateCartCount();
  renderCart();
}

function initialiseMenu() {
  const button = document.querySelector('.menu-button');
  const menu = document.querySelector('.nav-links');
  button?.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(isOpen));
  });
}

function initialiseFaqAndForms() {
  document.querySelectorAll('.faq-item button').forEach((button) =>
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const open = item.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    })
  );
  document.querySelectorAll('[data-contact-form]').forEach((form) =>
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const message = `Hello D'REGAL, my name is ${data.get('name')}.\n\n${data.get('message')}\n\nReply email: ${data.get('email')}`;
      window.open(makeWhatsAppLink(message), '_blank');
    })
  );
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  initialiseMenu();
  initialiseCart();
  initialiseFaqAndForms();
});
