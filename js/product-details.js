function createRelatedProductCard(product) {
  return `
    <article class="product-card">
      <a class="product-card__image" href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}">
        <span class="product-card__badge">${product.badge}</span>
      </a>
      <div class="product-card__info">
        <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
        <p>${formatPrice(product.price)}</p>
      </div>
    </article>`;
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('[data-product-detail]');
  if (!container) return;

  const productId = new URLSearchParams(window.location.search).get('id');
  const product = getProduct(productId);

  if (!product) {
    container.innerHTML = `<section class="page-intro"><p class="eyebrow">Not found</p><h1>This piece is not in the current collection.</h1><p><a class="text-link" href="shop.html">Return to shop</a></p></section>`;
    return;
  }

  document.title = `${product.name} | D'REGAL`;
  let selectedColour = product.colours[0] || '';
  let quantity = 1;

  const colourOptions = product.colours.length
    ? `<div><span class="option-label">Colour</span><div class="option-buttons">${product.colours.map((colour, index) => `<button class="${index === 0 ? 'is-selected' : ''}" data-colour="${colour}">${colour}</button>`).join('')}</div></div>`
    : `<p class="availability-note">Colour options are being confirmed. Contact D’REGAL to discuss your preference.</p>`;

  container.innerHTML = `
    <section class="product-detail">
      <div class="gallery">${product.images.map((image, index) => `<img src="${image}" alt="${product.name}${index ? ' product detail' : ''}">`).join('')}</div>
      <div class="product-purchase">
        <p class="eyebrow">${product.category.replace('-', ' ')}</p>
        <h1>${product.name}</h1>
        <p class="product-price">${formatPrice(product.price)}</p>
        <p class="product-description">${product.description}</p>
        ${colourOptions}
        <div><span class="option-label">Sizing</span><p class="availability-note">No size chart is confirmed yet. Contact us on WhatsApp to discuss fit before ordering.</p></div>
        <div><span class="option-label">Quantity</span><div class="quantity"><button data-quantity="-1" aria-label="Decrease quantity">−</button><span data-quantity-value>1</span><button data-quantity="1" aria-label="Increase quantity">+</button></div></div>
        <div class="purchase-actions"><button class="button button--dark" data-add-to-cart>Add to bag</button><a class="button" data-product-whatsapp target="_blank" rel="noreferrer">Order via WhatsApp</a><a class="text-link" data-custom-whatsapp target="_blank" rel="noreferrer">Ask about customisation</a></div>
        <div class="product-meta"><p>Delivery fees and timing are confirmed with D’REGAL once your location is known.</p><p>Images are temporary placeholders and will be replaced with D’REGAL product photography.</p></div>
      </div>
    </section>
    <section class="collection-section related"><div class="collection-heading"><div><p class="eyebrow">Continue exploring</p><h2 class="section-title">More from the collection.</h2></div><a class="text-link" href="shop.html">Shop all</a></div><div class="product-grid">${products
      .filter((item) => item.id !== product.id)
      .map(createRelatedProductCard)
      .join('')}</div></section>`;

  function buildMessage(isCustomisation) {
    const request = isCustomisation ? 'ask about customising' : 'order';
    const ending = isCustomisation
      ? '\n\nMy customisation request: '
      : '\n\nPlease confirm available sizes, payment and delivery arrangements.';
    return `Hello D'REGAL, I would like to ${request} the ${product.name}.\n\nPrice: ${formatPrice(product.price)}${selectedColour ? `\nColour: ${selectedColour}` : ''}\nQuantity: ${quantity}${ending}`;
  }

  function updatePurchaseControls() {
    container.querySelector('[data-product-whatsapp]').href = makeWhatsAppLink(buildMessage(false));
    container.querySelector('[data-custom-whatsapp]').href = makeWhatsAppLink(buildMessage(true));
    container.querySelector('[data-quantity-value]').textContent = quantity;
  }

  container.addEventListener('click', (event) => {
    const button = event.target.closest('[data-colour], [data-quantity], [data-add-to-cart]');
    if (!button) return;

    if (button.dataset.colour) {
      selectedColour = button.dataset.colour;
      container.querySelectorAll('[data-colour]').forEach((colourButton) => {
        colourButton.classList.toggle('is-selected', colourButton === button);
      });
    }

    if (button.dataset.quantity) quantity = Math.max(1, quantity + Number(button.dataset.quantity));

    if (button.hasAttribute('data-add-to-cart')) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        colour: selectedColour,
        size: '',
        quantity,
      });
      renderCart();
      document.querySelector('.cart-drawer').classList.add('is-open');
      document.querySelector('.cart-scrim').classList.add('is-open');
    }

    updatePurchaseControls();
  });

  updatePurchaseControls();
});
