/* Product facts supplied for D’REGAL. Update this file as the collection evolves. */
window.dregalCurrency = localStorage.getItem("dregal-currency") || "NGN";
window.dregalExchangeRate =
  Number(localStorage.getItem("dregal-usd-ngn-rate")) || 1500;
const comingSoonImages = {
  tops: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1100&q=80",
  bottoms: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1100&q=80",
  streetwear: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1100&q=80",
  outerwear: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1100&q=80",
  sets: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1100&q=80",
  "dresses-tailoring": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1100&q=80",
  accessories: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1100&q=80",
};
const products = [
  {
    id: "joggers",
    name: "Signature Joggers",
    category: "joggers",
    groups: ["streetwear", "bottoms", "everyday-essentials"],
    availability: "available",
    featured: true,
    price: 15000,
    description:
      "A relaxed everyday silhouette designed for effortless style, comfort and movement.",
    colours: ["Black", "Grey", "Dark grey"],
    sizes: [],
    badge: "The first edit",
    image:
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1100&q=85",
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1100&q=85",
    ],
  },
  {
    id: "jorts",
    name: "Relaxed Jorts",
    category: "jorts",
    groups: ["streetwear", "bottoms", "everyday-essentials"],
    availability: "available",
    featured: true,
    price: 9500,
    description:
      "An easy contemporary foundation for warm days and personal styling.",
    colours: [],
    sizes: [],
    badge: "New perspective",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1100&q=85",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=1100&q=85",
    ],
  },
  {
    id: "tank-tops",
    name: "Essential Tank Top",
    category: "tank-tops",
    groups: ["streetwear", "tops", "everyday-essentials"],
    availability: "available",
    featured: true,
    price: 18000,
    description:
      "A versatile layer made for movement, comfort and individual expression.",
    colours: [],
    sizes: [],
    badge: "Everyday essential",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1506629905607-d405b7a895c1?auto=format&fit=crop&w=1100&q=85",
    ],
  },
  ...[
    ["t-shirts", "T-shirts", "tops", "A relaxed staple for a future D’REGAL edit.", "coming-soon"],
    ["polo-shirts", "Polo shirts", "tops", "A refined everyday layer planned for a future collection.", "coming-soon"],
    ["shirts", "Shirts", "tops", "Contemporary shirts for smart-casual dressing.", "coming-soon"],
    ["shorts", "Shorts", "bottoms", "Easy shorts for warm days and relaxed styling.", "coming-soon"],
    ["trousers", "Trousers", "bottoms", "A considered trouser silhouette for everyday dressing.", "coming-soon"],
    ["jeans", "Jeans", "bottoms", "A future denim edit with an individual point of view.", "coming-soon"],
    ["sweatshirts", "Sweatshirts", "streetwear", "A comfortable layer planned for a future edit.", "coming-soon"],
    ["hoodies", "Hoodies", "streetwear", "A relaxed essential planned for a future collection.", "coming-soon"],
    ["jackets", "Jackets", "outerwear", "Outer layers for changing moods and seasons.", "coming-soon"],
    ["tracksuits", "Tracksuits", "sets", "A coordinated future set for movement and expression.", "coming-soon"],
    ["matching-sets", "Matching sets", "sets", "Planned co-ordinates made to be worn together or apart.", "coming-soon"],
    ["casual-dresses", "Casual dresses", "dresses-tailoring", "An easy dress silhouette planned for a future edit.", "coming-soon"],
    ["tops", "Tops", "tops", "Future contemporary tops beyond the essentials.", "coming-soon"],
    ["skirts", "Skirts", "dresses-tailoring", "A future skirt edit for expressive everyday dressing.", "coming-soon"],
    ["bespoke-dresses", "Bespoke dresses", "dresses-tailoring", "Tailored occasion pieces created by enquiry.", "coming-soon"],
    ["traditional-menswear", "Traditional men’s clothing", "dresses-tailoring", "Traditional menswear interpreted through the D’REGAL lens.", "coming-soon"],
    ["traditional-womenswear", "Traditional women’s clothing", "dresses-tailoring", "Traditional womenswear for meaningful occasions.", "coming-soon"],
    ["tailored-occasion", "Tailored & occasion wear", "dresses-tailoring", "Considered pieces for moments that call for something special.", "coming-soon"],
    ["beanies", "Beanies", "accessories", "A future accessory to finish the look.", "coming-soon"],
  ].map(([id, name, category, description, availability]) => ({
    id, name, category, groups: [category], description, availability,
    colours: [], sizes: [], badge: "Planned edit",
    image: comingSoonImages[category],
    images: [comingSoonImages[category]], tags: [name, category]
  })),
];
const getProduct = (id) => products.find((product) => product.id === id);
const formatPrice = (price) => {
  const currency = window.dregalCurrency || "NGN";
  const rate = window.dregalExchangeRate || 1500;
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "USD" ? 2 : 0,
  }).format(currency === "USD" ? price / rate : price);
};
