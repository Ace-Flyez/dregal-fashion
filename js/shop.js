function productCard(p, index = 0) {
  return `<article class="product-card" style="--card-index:${index}">
    <a class="product-card__visual" href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-badge">${p.badge}</span><span class="quick-view">Discover piece</span><button class="product-save ${isSaved(p.id) ? "is-saved" : ""}" data-save-product="${p.id}" aria-label="${isSaved(p.id) ? "Remove" : "Save"} ${p.name}"><svg class="heart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.7c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/></svg></button></a>
    <div class="product-card__meta"><div><p class="product-category">${p.category.replace("-", " ")}</p><h3><a href="product.html?id=${p.id}">${p.name}</a></h3></div><strong>${formatPrice(p.price)}</strong></div>
    <button class="product-add" data-add-product="${p.id}">Add to bag <span>+</span></button></article>`;
}
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("[data-shop-grid]");
  if (!grid) return;
  const search = document.querySelector("#product-search");
  const sort = document.querySelector("#product-sort");
  const empty = document.querySelector("[data-no-results]");
  const params = new URLSearchParams(location.search);
  let category = params.get("category") || "all";
  search.value = params.get("search") || "";
  const searchIcon = document.querySelector(".search-field>span:last-child"); if (searchIcon) searchIcon.innerHTML = '<svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 5 5"/></svg>';
  const toolbar = document.querySelector(".shop-toolbar");
  const filters = document.createElement("div");
  filters.className = "advanced-filters";
  filters.innerHTML =
    '<select data-filter-price aria-label="Filter by price"><option value="all">Any price</option><option value="under-10000">Under ₦10,000</option><option value="10000-15000">₦10,000–₦15,000</option><option value="over-15000">Over ₦15,000</option></select><select data-filter-size aria-label="Filter by size"><option value="all">Any size</option><option>XS</option><option>S</option><option>M</option><option>L</option></select><select data-filter-colour aria-label="Filter by colour"><option value="all">Any colour</option><option>Black</option><option>Grey</option><option>Dark grey</option></select><select data-filter-type aria-label="Filter by availability"><option value="all">All pieces</option><option value="ready-made">Ready-made</option><option value="custom-made">Custom-made</option></select>';
  toolbar?.append(filters);
  const priceFilter = filters.querySelector("[data-filter-price]");
  const sizeFilter = filters.querySelector("[data-filter-size]");
  const colourFilter = filters.querySelector("[data-filter-colour]");
  const typeFilter = filters.querySelector("[data-filter-type]");
  function draw() {
    let list = products.filter((p) => {
      const query =
        `${p.name} ${p.category} ${p.description} ${(p.tags || []).join(" ")}`.toLowerCase();
      const inPrice =
        priceFilter.value === "all" ||
        (priceFilter.value === "under-10000" && p.price < 10000) ||
        (priceFilter.value === "10000-15000" &&
          p.price >= 10000 &&
          p.price <= 15000) ||
        (priceFilter.value === "over-15000" && p.price > 15000);
      const inSize =
        sizeFilter.value === "all" ||
        (p.sizes || ["XS", "S", "M", "L"]).includes(sizeFilter.value);
      const inColour =
        colourFilter.value === "all" ||
        (p.colours || []).includes(colourFilter.value);
      const inType =
        typeFilter.value === "all" ||
        (p.type || "ready-made") === typeFilter.value;
      return (
        (category === "all" || p.category === category) &&
        query.includes(search.value.trim().toLowerCase()) &&
        inPrice &&
        inSize &&
        inColour &&
        inType
      );
    });
    if (sort.value === "low-high") list.sort((a, b) => a.price - b.price);
    if (sort.value === "high-low") list.sort((a, b) => b.price - a.price);
    if (sort.value === "name")
      list.sort((a, b) => a.name.localeCompare(b.name));
    grid.innerHTML = list.map(productCard).join("");
    empty.hidden = list.length > 0;
    document.querySelector("[data-result-count]").textContent =
      `${list.length} ${list.length === 1 ? "piece" : "pieces"}`;
  }
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.filter === category);
    btn.addEventListener("click", () => {
      category = btn.dataset.filter;
      document
        .querySelectorAll("[data-filter]")
        .forEach((b) => b.classList.toggle("is-active", b === btn));
      draw();
    });
  });
  search.addEventListener("input", draw);
  sort.addEventListener("change", draw);
  [priceFilter, sizeFilter, colourFilter, typeFilter].forEach((select) =>
    select.addEventListener("change", draw),
  );
  grid.addEventListener("click", (event) => {
    const save = event.target.closest("[data-save-product]");
    if (save) {
      event.preventDefault();
      const p = getProduct(save.dataset.saveProduct);
      const saved = toggleWishlist({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
      });
      save.classList.toggle("is-saved", saved);
      save.setAttribute("aria-label", `${saved ? "Remove" : "Save"} ${p.name}`);
      showToast(saved ? "Saved to your pieces" : "Removed from saved pieces");
      updateWishlistCount();
      return;
    }
    const btn = event.target.closest("[data-add-product]");
    if (!btn) return;
    const p = getProduct(btn.dataset.addProduct);
    addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      colour: p.colours[0] || "",
      size: "",
      quantity: 1,
    });
  });
  draw();
});
