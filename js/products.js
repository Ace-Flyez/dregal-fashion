// Edit this file whenever product information changes. Prices are stored as numbers for reliable calculations.
const products = [
  {
    id: 'joggers',
    name: 'Signature Joggers',
    category: 'joggers',
    price: 15000,
    description: 'A relaxed, everyday silhouette designed for confident, considered dressing.',
    colours: ['Black', 'Grey', 'Dark grey'],
    sizes: [],
    image:
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1506629905607-d405b7a895c1?auto=format&fit=crop&w=1200&q=85',
    ],
    badge: 'Core piece',
  },
  {
    id: 'jorts',
    name: 'Relaxed Jorts',
    category: 'jorts',
    price: 9500,
    description: 'An easy, contemporary foundation for warm days and expressive styling.',
    colours: [],
    sizes: [],
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=1200&q=85',
    ],
    badge: 'New arrival',
  },
  {
    id: 'tank-tops',
    name: 'Essential Tank Top',
    category: 'tank-tops',
    price: 18000,
    description: 'A versatile layer made for movement, comfort and personal expression.',
    colours: [],
    sizes: [],
    image:
      'https://images.unsplash.com/photo-1506629905607-d405b7a895c1?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1506629905607-d405b7a895c1?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=85',
    ],
    badge: 'New arrival',
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(price);
const getProduct = (id) => products.find((product) => product.id === id);
