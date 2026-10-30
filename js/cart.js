const CART_KEY = 'dregal-cart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(item) {
  const cart = getCart();
  const existingItem = cart.find(
    (cartItem) =>
      cartItem.id === item.id && cartItem.colour === item.colour && cartItem.size === item.size
  );
  if (existingItem) existingItem.quantity += item.quantity;
  else cart.push(item);
  saveCart(cart);
}

function updateCartCount() {
  const count = getCart().reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('[data-cart-count]').forEach((element) => {
    element.textContent = count;
  });
}

function cartSubtotal() {
  return getCart().reduce((total, item) => total + item.price * item.quantity, 0);
}

function makeWhatsAppLink(message) {
  return `https://wa.me/2347031605920?text=${encodeURIComponent(message)}`;
}

function cartWhatsAppMessage() {
  const items = getCart();
  if (!items.length) return "Hello D'REGAL, I would like to make an enquiry.";
  const orderLines = items.map(
    (item) =>
      `• ${item.name} — ${formatPrice(item.price)} × ${item.quantity}${item.colour ? ` | Colour: ${item.colour}` : ''}${item.size ? ` | Size: ${item.size}` : ''}`
  );
  return `Hello D'REGAL, I would like to order:\n\n${orderLines.join('\n')}\n\nCart subtotal: ${formatPrice(cartSubtotal())}\n\nPlease confirm payment and delivery arrangements.`;
}
