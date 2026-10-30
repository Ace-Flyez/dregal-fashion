function createProductCard(product) {
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
      <button class="product-card__add" type="button" data-add-product="${product.id}">Add to bag</button>
    </article>`;
}

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('[data-shop-grid]');
  const searchInput = document.querySelector('#product-search');
  const sortSelect = document.querySelector('#product-sort');
  const noResults = document.querySelector('[data-no-results]');
  let selectedCategory = 'all';

  if (!grid) return;

  function renderProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const visibleProducts = products.filter((product) => {
      const isInCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return isInCategory && product.name.toLowerCase().includes(searchTerm);
    });

    if (sortSelect.value === 'low-high')
      visibleProducts.sort((first, second) => first.price - second.price);
    if (sortSelect.value === 'high-low')
      visibleProducts.sort((first, second) => second.price - first.price);
    if (sortSelect.value === 'name')
      visibleProducts.sort((first, second) => first.name.localeCompare(second.name));

    grid.innerHTML = visibleProducts.map(createProductCard).join('');
    noResults.hidden = visibleProducts.length > 0;
  }

  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedCategory = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach((filterButton) => {
        filterButton.classList.toggle('is-active', filterButton === button);
      });
      renderProducts();
    });
  });

  grid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-product]');
    if (!button) return;
    const product = getProduct(button.dataset.addProduct);
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      colour: product.colours[0] || '',
      size: '',
      quantity: 1,
    });
    renderCart();
    document.querySelector('.cart-drawer')?.classList.add('is-open');
    document.querySelector('.cart-scrim')?.classList.add('is-open');
  });

  searchInput.addEventListener('input', renderProducts);
  sortSelect.addEventListener('change', renderProducts);
  renderProducts();
});
