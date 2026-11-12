document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("[data-wishlist-grid]");
  const empty = document.querySelector("[data-wishlist-empty]");
  if (!grid) return;
  const saved = getWishlist();
  grid.innerHTML = saved.length ? saved.map((savedProduct, i) => {
    const p = getProduct(savedProduct.id) || savedProduct;
    return `<article class="product-card wishlist-card" style="--card-index:${i}">
      <a class="product-card__visual" href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy"></a>
      <div class="product-card__meta"><div><p class="product-category">${p.category || "Piece"}</p><h3><a href="product.html?id=${p.id}">${p.name}</a></h3></div><strong>${formatPrice(p.price)}</strong></div>
      <p class="wishlist-availability">${p.type === "custom-made" ? "Custom-made" : "Ready-made"}</p>
      <div class="wishlist-card__actions"><button class="product-add" data-add-product="${p.id}">Add to bag</button><button class="text-link" type="button" data-remove-saved="${p.id}">Remove</button></div>
    </article>`;
  }).join("") : "";
  empty.hidden = saved.length > 0;
  grid.addEventListener("click", (event) => {
    const remove = event.target.closest("[data-remove-saved]");
    if (remove) {
      toggleWishlist({ id: remove.dataset.removeSaved });
      showToast("Removed from saved pieces");
      updateWishlistCount();
      remove.closest(".wishlist-card")?.remove();
      if (!getWishlist().length) empty.hidden = false;
      return;
    }
    const add = event.target.closest("[data-add-product]");
    if (add) {
      const p = getProduct(add.dataset.addProduct);
      addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, colour: p.colours?.[0] || "", size: "", quantity: 1 });
    }
  });
});
