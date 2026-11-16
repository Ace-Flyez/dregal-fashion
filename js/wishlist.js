document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("[data-wishlist-grid]");
  const empty = document.querySelector("[data-wishlist-empty]");
  if (!grid) return;
  const saved = getWishlist();
  grid.innerHTML = saved.length ? saved.map((savedProduct, i) => productCard(getProduct(savedProduct.id) || savedProduct, i, { context: "wishlist" })).join("") : "";
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
