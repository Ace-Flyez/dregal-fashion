/* Product facts supplied for D’REGAL. Update this file as the collection evolves. */
window.dregalCurrency = localStorage.getItem('dregal-currency') || 'NGN';
window.dregalExchangeRate = Number(localStorage.getItem('dregal-usd-ngn-rate')) || 1500;
const products = [
  {
    id: 'joggers', name: 'Signature Joggers', category: 'joggers', price: 15000,
    description: 'A relaxed everyday silhouette designed for effortless style, comfort and movement.',
    colours: ['Black', 'Grey', 'Dark grey'], sizes: [], badge: 'The first edit',
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1100&q=85',
    images: [
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1100&q=85'
    ]
  },
  {
    id: 'jorts', name: 'Relaxed Jorts', category: 'jorts', price: 9500,
    description: 'An easy contemporary foundation for warm days and personal styling.',
    colours: [], sizes: [], badge: 'New perspective',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1100&q=85',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=1100&q=85'
    ]
  },
  {
    id: 'tank-tops', name: 'Essential Tank Top', category: 'tank-tops', price: 18000,
    description: 'A versatile layer made for movement, comfort and individual expression.',
    colours: [], sizes: [], badge: 'Everyday essential',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1506629905607-d405b7a895c1?auto=format&fit=crop&w=1100&q=85'
    ]
  }
];
const getProduct = (id) => products.find((product) => product.id === id);
const formatPrice = (price) => {
  const currency = window.dregalCurrency || 'NGN';
  const rate = window.dregalExchangeRate || 1500;
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-NG', {
    style: 'currency', currency, maximumFractionDigits: currency === 'USD' ? 2 : 0
  }).format(currency === 'USD' ? price / rate : price);
};
