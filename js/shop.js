function productCard(p, index = 0) {
  return `<article class="product-card" style="--card-index:${index}">
    <a class="product-card__visual" href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy"><button class="product-save ${isSaved(p.id) ? "is-saved" : ""}" data-save-product="${p.id}" aria-label="${isSaved(p.id) ? "Remove" : "Save"} ${p.name}"><svg class="heart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.7c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/></svg></button></a>
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
  const toolbar = document.querySelector(".shop-toolbar");
  const filterState = { price: "all", size: "all", colour: "all", type: "all", sort: "featured" };
  const filters = document.createElement("details");
  filters.className = "filter-menu";
  filters.innerHTML = `<summary>Filter <span data-filter-count></span></summary><div class="filter-menu__panel">
    <details><summary>Price</summary><div class="filter-menu__options"><button type="button" data-filter-group="price" data-filter-value="all">Any price</button><button type="button" data-filter-group="price" data-filter-value="under-10000">Under 10,000 NGN</button><button type="button" data-filter-group="price" data-filter-value="10000-15000">10,000–15,000 NGN</button><button type="button" data-filter-group="price" data-filter-value="over-15000">Over 15,000 NGN</button></div></details>
    <details><summary>Size</summary><div class="filter-menu__options">${["all", "XS", "S", "M", "L"].map((v) => `<button type="button" data-filter-group="size" data-filter-value="${v}">${v === "all" ? "Any size" : v}</button>`).join("")}</div></details>
    <details><summary>Colour</summary><div class="filter-menu__options">${["all", "Black", "Grey", "Dark grey"].map((v) => `<button type="button" data-filter-group="colour" data-filter-value="${v}">${v === "all" ? "Any colour" : v}</button>`).join("")}</div></details>
    <details><summary>Availability</summary><div class="filter-menu__options"><button type="button" data-filter-group="type" data-filter-value="all">All pieces</button><button type="button" data-filter-group="type" data-filter-value="ready-made">Ready-made</button><button type="button" data-filter-group="type" data-filter-value="custom-made">Custom-made</button></div></details>
    <details><summary>Sort by</summary><div class="filter-menu__options"><button type="button" data-filter-group="sort" data-filter-value="featured">Featured</button><button type="button" data-filter-group="sort" data-filter-value="low-high">Price: low to high</button><button type="button" data-filter-group="sort" data-filter-value="high-low">Price: high to low</button><button type="button" data-filter-group="sort" data-filter-value="name">Name: A to Z</button></div></details>
    <button type="button" class="filter-menu__clear" data-clear-filters>Clear filters</button></div>`;
  toolbar?.append(filters);
  const filterBackdrop = document.createElement("button");
  filterBackdrop.type = "button";
  filterBackdrop.className = "filter-backdrop";
  filterBackdrop.setAttribute("aria-label", "Close filters");
  filterBackdrop.hidden = true;
  document.body.append(filterBackdrop);
  const closeFilters = () => {
    filters.removeAttribute("open");
    filterBackdrop.hidden = true;
  };
  filters.addEventListener("toggle", () => {
    filterBackdrop.hidden = !filters.open;
  });
  filters.querySelector(":scope > summary").addEventListener("click", (event) => {
    event.preventDefault();
    filters.open = !filters.open;
  });

  function draw() {
    let list = products.filter((p) => {
      const query = `${p.name} ${p.category} ${p.description} ${(p.tags || []).join(" ")}`.toLowerCase();
      const price = filterState.price;
      const inPrice = price === "all" || (price === "under-10000" && p.price < 10000) || (price === "10000-15000" && p.price >= 10000 && p.price <= 15000) || (price === "over-15000" && p.price > 15000);
      const inSize = filterState.size === "all" || (p.sizes || ["XS", "S", "M", "L"]).includes(filterState.size);
      const inColour = filterState.colour === "all" || (p.colours || []).includes(filterState.colour);
      const inType = filterState.type === "all" || (p.type || "ready-made") === filterState.type;
      return (category === "all" || p.category === category) && query.includes(search.value.trim().toLowerCase()) && inPrice && inSize && inColour && inType;
    });
    if (filterState.sort === "low-high") list.sort((a, b) => a.price - b.price);
    if (filterState.sort === "high-low") list.sort((a, b) => b.price - a.price);
    if (filterState.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    grid.innerHTML = list.map(productCard).join("");
    empty.hidden = list.length > 0;
    document.querySelector("[data-result-count]").textContent = `${list.length} ${list.length === 1 ? "piece" : "pieces"}`;
  }

  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.filter === category);
    btn.addEventListener("click", () => { category = btn.dataset.filter; document.querySelectorAll("[data-filter]").forEach((b) => b.classList.toggle("is-active", b === btn)); draw(); });
  });
  search.addEventListener("input", draw);
  sort.hidden = true;
  filters.addEventListener("click", (event) => {
    const option = event.target.closest("[data-filter-group]");
    if (option) {
      filterState[option.dataset.filterGroup] = option.dataset.filterValue;
      filters.querySelectorAll("[data-filter-group]").forEach((button) => button.classList.toggle("is-selected", button === option));
      filters.querySelector("[data-filter-count]").textContent = Object.entries(filterState).filter(([key, value]) => key !== "sort" && value !== "all").length || "";
      draw();
    }
    if (event.target.closest("[data-clear-filters]")) { Object.keys(filterState).forEach((key) => (filterState[key] = key === "sort" ? "featured" : "all")); filters.querySelectorAll("[data-filter-group]").forEach((button) => button.classList.remove("is-selected")); filters.querySelector("[data-filter-count]").textContent = ""; draw(); }
  });
  filterBackdrop.addEventListener("click", closeFilters);
  window.addEventListener("pointerdown", (event) => { if (filters.open && !filters.contains(event.target) && event.target !== filterBackdrop) closeFilters(); }, true);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeFilters(); });
  grid.addEventListener("click", (event) => {
    const save = event.target.closest("[data-save-product]");
    if (save) { event.preventDefault(); const p = getProduct(save.dataset.saveProduct); const saved = toggleWishlist({ id: p.id, name: p.name, price: p.price, image: p.image }); save.classList.toggle("is-saved", saved); save.setAttribute("aria-label", `${saved ? "Remove" : "Save"} ${p.name}`); showToast(saved ? "Saved to your pieces" : "Removed from saved pieces"); updateWishlistCount(); return; }
    const btn = event.target.closest("[data-add-product]");
    if (!btn) return;
    const p = getProduct(btn.dataset.addProduct);
    addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, colour: p.colours[0] || "", size: "", quantity: 1 });
  });
  draw();
});
