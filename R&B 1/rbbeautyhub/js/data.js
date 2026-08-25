// ===== PRODUCT DATA =====
const PRODUCTS = [
  // SKINCARE
  {
    id: 1,
    name: "Olay Regenerist Micro-Sculpting Cream",
    category: "skincare",
    brand: "olay",
    price: 15990,
    originalPrice: 22990,
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 234,
    badge: "sale",
    stock: 45,
    description: "Anti-aging face cream with amino-peptides and Niacinamide to regenerate surface skin cells."
  },
  {
    id: 2,
    name: "Neutrogena Hydro Boost Water Gel",
    category: "skincare",
    brand: "neutrogena",
    price: 8990,
    originalPrice: 12990,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 567,
    badge: "hot",
    stock: 32,
    description: "Lightweight, oil-free moisturizer with hyaluronic acid for instant hydration."
  },
  {
    id: 3,
    name: "CeraVe Moisturizing Cream 16oz",
    category: "skincare",
    brand: "cerave",
    price: 6990,
    originalPrice: 9990,
    image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 891,
    badge: "hot",
    stock: 67,
    description: "Daily face and body moisturizer with 3 essential ceramides and hyaluronic acid."
  },
  {
    id: 4,
    name: "The Ordinary Niacinamide 10% + Zinc 1%",
    category: "skincare",
    brand: "the ordinary",
    price: 3990,
    originalPrice: 5990,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 1203,
    badge: "sale",
    stock: 89,
    description: "High-strength vitamin and mineral blemish formula."
  },
  {
    id: 5,
    name: "La Roche-Posay Anthelios Sunscreen SPF 60",
    category: "skincare",
    brand: "la roche-posay",
    price: 11990,
    originalPrice: 15990,
    image: "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 345,
    badge: "new",
    stock: 28,
    description: "Broad spectrum SPF 60 sunscreen for face and body."
  },

  // MAKEUP
  {
    id: 6,
    name: "Maybelline Lash Sensational Sky High Mascara",
    category: "makeup",
    brand: "maybelline",
    price: 4990,
    originalPrice: 7990,
    image: "https://images.unsplash.com/photo-1631214500115-598fc2cb8ada?w=400&h=400&fit=crop",
    rating: 4.3,
    reviews: 678,
    badge: "hot",
    stock: 56,
    description: "Volume and length mascara for dramatic lashes."
  },
  {
    id: 7,
    name: "MAC Ruby Woo Matte Lipstick",
    category: "makeup",
    brand: "mac",
    price: 12990,
    originalPrice: 16990,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 432,
    badge: "sale",
    stock: 23,
    description: "Iconic matte lipstick in the perfect red shade."
  },
  {
    id: 8,
    name: "Fenty Beauty Pro Filt'r Foundation",
    category: "makeup",
    brand: "fenty",
    price: 17990,
    originalPrice: 22990,
    image: "https://images.unsplash.com/photo-1631213864223-81e1e8f3e3e2?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 567,
    badge: "new",
    stock: 34,
    description: "Soft matte, long-wear foundation with buildable coverage."
  },
  {
    id: 9,
    name: "NARS Orgasm Blush",
    category: "makeup",
    brand: "nars",
    price: 14990,
    originalPrice: 19990,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 389,
    badge: "sale",
    stock: 19,
    description: "Award-winning blush with a peachy-pink shimmer."
  },
  {
    id: 10,
    name: "Urban Decay Naked3 Eyeshadow Palette",
    category: "makeup",
    brand: "urban decay",
    price: 19990,
    originalPrice: 27990,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 456,
    badge: "sale",
    stock: 15,
    description: "12 rose-hued eyeshadows for endless looks."
  },

  // HAIR CARE
  {
    id: 11,
    name: "Olaplex No.3 Hair Perfector Treatment",
    category: "haircare",
    brand: "olaplex",
    price: 13990,
    originalPrice: 18990,
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 789,
    badge: "hot",
    stock: 41,
    description: "At-home treatment that reduces breakage and visibly strengthens hair."
  },
  {
    id: 12,
    name: "Shea Moisture Coconut & Hibiscus Shampoo",
    category: "haircare",
    brand: "shea moisture",
    price: 4990,
    originalPrice: 7990,
    image: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 567,
    badge: "sale",
    stock: 73,
    description: "Sulfate-free shampoo for curly and wavy hair."
  },
  {
    id: 13,
    name: "Moroccanoil Treatment Oil 3.4oz",
    category: "haircare",
    brand: "moroccanoil",
    price: 16990,
    originalPrice: 22990,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 345,
    badge: "new",
    stock: 22,
    description: "Argan oil treatment for all hair types."
  },
  {
    id: 14,
    name: "Revlon One-Step Hair Dryer & Volumizer",
    category: "haircare",
    brand: "revlon",
    price: 11990,
    originalPrice: 17990,
    image: "https://images.unsplash.com/photo-1522338242992-e1a54571a7d8?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 1567,
    badge: "hot",
    stock: 38,
    description: "Hot air brush for salon-quality blowouts at home."
  },
  {
    id: 15,
    name: "Chi Flat Iron Ceramic Hair Straightener",
    category: "haircare",
    brand: "chi",
    price: 14990,
    originalPrice: 21990,
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 432,
    badge: "sale",
    stock: 27,
    description: "1-inch ceramic flat iron for smooth, shiny hair."
  },

  // FRAGRANCE
  {
    id: 16,
    name: "Chanel No. 5 Eau de Parfum",
    category: "fragrance",
    brand: "chanel",
    price: 89990,
    originalPrice: 119990,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 234,
    badge: "sale",
    stock: 8,
    description: "Iconic floral fragrance for women."
  },
  {
    id: 17,
    name: "Dior Sauvage Eau de Toilette",
    category: "fragrance",
    brand: "dior",
    price: 69990,
    originalPrice: 89990,
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 567,
    badge: "hot",
    stock: 12,
    description: "Fresh and spicy men's fragrance."
  },
  {
    id: 18,
    name: "Yves Saint Laurent Black Opium",
    category: "fragrance",
    brand: "ysl",
    price: 79990,
    originalPrice: 99990,
    image: "https://images.unsplash.com/photo-1594035910387-fbd1a376cb3a?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 345,
    badge: "new",
    stock: 15,
    description: "Addictive vanilla and coffee fragrance."
  },
  {
    id: 19,
    name: "Jo Malone Wood Sage & Sea Salt",
    category: "fragrance",
    brand: "jo malone",
    price: 59990,
    originalPrice: 74990,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 189,
    badge: "sale",
    stock: 10,
    description: "Unisex fragrance inspired by the British coast."
  },
  {
    id: 20,
    name: "Versace Bright Crystal Eau de Toilette",
    category: "fragrance",
    brand: "versace",
    price: 49990,
    originalPrice: 64990,
    image: "https://images.unsplash.com/photo-1592945675580-b47e6b4e7f56?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 278,
    badge: "sale",
    stock: 18,
    description: "Fresh and floral fragrance for women."
  },

  // ELECTRONICS
  {
    id: 21,
    name: "Apple AirPods Pro 2nd Generation",
    category: "electronics",
    brand: "apple",
    price: 119990,
    originalPrice: 149990,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 1234,
    badge: "hot",
    stock: 25,
    description: "Active noise cancellation and personalized spatial audio."
  },
  {
    id: 22,
    name: "Samsung Galaxy Buds2 Pro",
    category: "electronics",
    brand: "samsung",
    price: 79990,
    originalPrice: 99990,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 567,
    badge: "sale",
    stock: 34,
    description: "True wireless earbuds with 360 audio."
  },
  {
    id: 23,
    name: "Sony WH-1000XM5 Headphones",
    category: "electronics",
    brand: "sony",
    price: 149990,
    originalPrice: 189990,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 891,
    badge: "sale",
    stock: 18,
    description: "Industry-leading noise cancellation headphones."
  },
  {
    id: 24,
    name: "Anker PowerCore 20000mAh Power Bank",
    category: "electronics",
    brand: "anker",
    price: 12990,
    originalPrice: 18990,
    image: "https://images.unsplash.com/photo-1609091839311-d57678324509?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 2345,
    badge: "hot",
    stock: 67,
    description: "High-capacity portable charger with fast charging."
  },
  {
    id: 25,
    name: "JBL Tune 510BT Wireless Headphones",
    category: "electronics",
    brand: "jbl",
    price: 9990,
    originalPrice: 14990,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 1567,
    badge: "sale",
    stock: 45,
    description: "Pure bass sound wireless on-ear headphones."
  },

  // FASHION
  {
    id: 26,
    name: "Nike Air Max 270 Running Shoes",
    category: "fashion",
    brand: "nike",
    price: 49990,
    originalPrice: 69990,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 891,
    badge: "hot",
    stock: 32,
    description: "Iconic Max Air unit for unrivaled comfort."
  },
  {
    id: 27,
    name: "Adidas Originals Trefoil Hoodie",
    category: "fashion",
    brand: "adidas",
    price: 24990,
    originalPrice: 34990,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 456,
    badge: "sale",
    stock: 48,
    description: "Classic pullover hoodie with trefoil logo."
  },
  {
    id: 28,
    name: "Levi's 501 Original Fit Jeans",
    category: "fashion",
    brand: "levis",
    price: 19990,
    originalPrice: 29990,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 678,
    badge: "sale",
    stock: 55,
    description: "The original blue jean since 1873."
  },
  {
    id: 29,
    name: "Ray-Ban Aviator Classic Sunglasses",
    category: "fashion",
    brand: "ray-ban",
    price: 39990,
    originalPrice: 54990,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 345,
    badge: "new",
    stock: 21,
    description: "Iconic pilot sunglasses with UV protection."
  },
  {
    id: 30,
    name: "Gucci GG Marmont Small Shoulder Bag",
    category: "fashion",
    brand: "gucci",
    price: 199990,
    originalPrice: 249990,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 89,
    badge: "new",
    stock: 5,
    description: "Quilted leather shoulder bag with chain strap."
  },

  // HOME & KITCHEN
  {
    id: 31,
    name: "Dyson V15 Detect Cordless Vacuum",
    category: "home",
    brand: "dyson",
    price: 219990,
    originalPrice: 279990,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 456,
    badge: "sale",
    stock: 12,
    description: "Intelligent cordless vacuum with laser detection."
  },
  {
    id: 32,
    name: "KitchenAid Artisan Stand Mixer 5qt",
    category: "home",
    brand: "kitchenaid",
    price: 179990,
    originalPrice: 229990,
    image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 789,
    badge: "hot",
    stock: 8,
    description: "Iconic stand mixer for all your baking needs."
  },
  {
    id: 33,
    name: "Nespresso Vertuo Coffee Machine",
    category: "home",
    brand: "nespresso",
    price: 69990,
    originalPrice: 89990,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 567,
    badge: "sale",
    stock: 19,
    description: "Centrifusion brewing technology for perfect coffee."
  },
  {
    id: 34,
    name: "Instant Pot Duo 7-in-1 Pressure Cooker",
    category: "home",
    brand: "instant pot",
    price: 39990,
    originalPrice: 59990,
    image: "https://images.unsplash.com/photo-1585837146751-a441185979c7?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 2345,
    badge: "hot",
    stock: 42,
    description: "7 appliances in 1: pressure cooker, slow cooker, and more."
  },
  {
    id: 35,
    name: "Philips Hue Smart Bulb Starter Kit",
    category: "home",
    brand: "philips",
    price: 29990,
    originalPrice: 39990,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 345,
    badge: "new",
    stock: 28,
    description: "Smart LED lighting system with voice control."
  },

  // HEALTH & WELLNESS
  {
    id: 36,
    name: "Vitamin C 1000mg Supplements (60 tablets)",
    category: "health",
    brand: "nature's way",
    price: 4990,
    originalPrice: 7990,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 567,
    badge: "sale",
    stock: 89,
    description: "Immune support vitamin C supplements."
  },
  {
    id: 37,
    name: "Organic Ashwagandha Root Capsules",
    category: "health",
    brand: "garden of life",
    price: 6990,
    originalPrice: 9990,
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 345,
    badge: "new",
    stock: 56,
    description: "Adaptogenic herb for stress relief and energy."
  },
  {
    id: 38,
    name: "Fitbit Charge 5 Fitness Tracker",
    category: "health",
    brand: "fitbit",
    price: 89990,
    originalPrice: 119990,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 678,
    badge: "sale",
    stock: 31,
    description: "Advanced health & fitness tracker with GPS."
  },
  {
    id: 39,
    name: "Yoga Mat Premium 6mm Thick",
    category: "health",
    brand: "manduka",
    price: 12990,
    originalPrice: 18990,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 234,
    badge: "hot",
    stock: 45,
    description: "Non-slip eco-friendly yoga mat."
  },
  {
    id: 40,
    name: "Essential Oil Diffuser with Remote",
    category: "health",
    brand: "now solutions",
    price: 8990,
    originalPrice: 12990,
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 456,
    badge: "sale",
    stock: 62,
    description: "Ultrasonic aromatherapy diffuser with LED lights."
  }
];

// ===== HELPER FUNCTIONS =====
// Get active products: admin products if available, otherwise default PRODUCTS
function getActiveProducts() {
  const adminProducts = JSON.parse(localStorage.getItem('rb_admin_products'));
  if (adminProducts && adminProducts.length > 0) {
    return adminProducts;
  }
  return PRODUCTS;
}

function formatPrice(amount) {
  return '₦' + amount.toLocaleString('en-NG');
}

function calculateDiscount(original, current) {
  return Math.round(((original - current) / original) * 100);
}

function generateStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function getProductsByCategory(category) {
  return getActiveProducts().filter(p => p.category === category);
}

function getProductsByBrand(brand) {
  return getActiveProducts().filter(p => p.brand === brand);
}

function searchProducts(query) {
  const q = query.toLowerCase();
  return getActiveProducts().filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q)
  );
}

function getSaleProducts() {
  return getActiveProducts().filter(p => p.originalPrice > p.price);
}

function getNewProducts() {
  return getActiveProducts().filter(p => p.badge === 'new');
}

function getHotProducts() {
  return getActiveProducts().filter(p => p.badge === 'hot');
}

function getProductById(id) {
  return getActiveProducts().find(p => p.id === parseInt(id));
}

function getAllProducts() {
  return getActiveProducts();
}
