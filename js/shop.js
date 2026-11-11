function productCard(p, index = 0) {
  return `<article class="product-card" style="--card-index:${index}">
    <a class="product-card__visual" href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-badge">${p.badge}</span><span class="quick-view">Discover piece <b>↗</b></span></a>
    <div class="product-card__meta"><div><p class="product-category">${p.category.replace('-', ' ')}</p><h3><a href="product.html?id=${p.id}">${p.name}</a></h3></div><strong>${formatPrice(p.price)}</strong></div>
    <button class="product-add" data-add-product="${p.id}">Add to bag <span>+</span></button></article>`;
}
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('[data-shop-grid]'); if (!grid) return;
  const search = document.querySelector('#product-search'); const sort = document.querySelector('#product-sort'); const empty = document.querySelector('[data-no-results]'); let category = new URLSearchParams(location.search).get('category') || 'all';
  function draw() {
    let list = products.filter(p => (category === 'all' || p.category === category) && `${p.name} ${p.category}`.toLowerCase().includes(search.value.trim().toLowerCase()));
    if (sort.value === 'low-high') list.sort((a,b)=>a.price-b.price); if (sort.value === 'high-low') list.sort((a,b)=>b.price-a.price); if (sort.value === 'name') list.sort((a,b)=>a.name.localeCompare(b.name));
    grid.innerHTML = list.map(productCard).join(''); empty.hidden = list.length > 0;
    document.querySelector('[data-result-count]').textContent = `${list.length} ${list.length === 1 ? 'piece' : 'pieces'}`;
  }
  document.querySelectorAll('[data-filter]').forEach(btn => { btn.classList.toggle('is-active', btn.dataset.filter === category); btn.addEventListener('click',()=>{category=btn.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('is-active',b===btn));draw();}); });
  search.addEventListener('input',draw); sort.addEventListener('change',draw);
  grid.addEventListener('click', event => { const btn = event.target.closest('[data-add-product]'); if (!btn) return; const p=getProduct(btn.dataset.addProduct); addToCart({id:p.id,name:p.name,price:p.price,image:p.image,colour:p.colours[0]||'',size:'',quantity:1}); });
  draw();
});
