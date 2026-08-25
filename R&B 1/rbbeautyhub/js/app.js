// ===== APP STATE =====
let cart = JSON.parse(localStorage.getItem('rb_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('rb_wishlist')) || [];
let currentUser = JSON.parse(localStorage.getItem('rb_user')) || null;
let orders = JSON.parse(localStorage.getItem('rb_orders')) || [];

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'toast show';
  if (type === 'error') toast.style.background = '#F44336';
  else toast.style.background = '#1a1a2e';
  setTimeout(() => toast.className = 'toast', 3000);
}

// ===== CART FUNCTIONS =====
function saveCart() {
  localStorage.setItem('rb_cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId, qty = 1) {
  const product = getProductById(productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart();
  showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  showToast('Item removed from cart');
}

function updateCartQty(productId, qty) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    if (qty <= 0) {
      removeFromCart(productId);
    } else {
      item.qty = qty;
      saveCart();
    }
  }
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const product = getProductById(item.id);
    return total + (product ? product.price * item.qty : 0);
  }, 0);
}

function getCartItemCount() {
  return cart.reduce((count, item) => count + item.qty, 0);
}

function updateCartCount() {
  const countEl = document.getElementById('cartCount');
  if (countEl) {
    const count = getCartItemCount();
    countEl.textContent = count;
    countEl.style.display = count > 0 ? 'inline' : 'none';
  }
}

// ===== WISHLIST FUNCTIONS =====
function saveWishlist() {
  localStorage.setItem('rb_wishlist', JSON.stringify(wishlist));
  updateWishlistCount();
}

function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast('Removed from wishlist');
  } else {
    wishlist.push(productId);
    showToast('Added to wishlist!');
  }
  saveWishlist();
}

function isInWishlist(productId) {
  return wishlist.includes(productId);
}

function updateWishlistCount() {
  const countEl = document.getElementById('wishlistCount');
  if (countEl) {
    countEl.textContent = wishlist.length;
    countEl.style.display = wishlist.length > 0 ? 'inline' : 'none';
  }
}

// ===== USER FUNCTIONS =====
function loginUser(email, password) {
  // Simulated login
  const users = JSON.parse(localStorage.getItem('rb_users')) || [];
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    localStorage.setItem('rb_user', JSON.stringify(user));
    updateUserUI();
    return { success: true };
  }
  return { success: false, message: 'Invalid email or password' };
}

function registerUser(name, email, password) {
  const users = JSON.parse(localStorage.getItem('rb_users')) || [];
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Email already registered' };
  }
  const user = {
    id: Date.now(),
    name,
    email,
    password,
    phone: '',
    address: '',
    createdAt: new Date().toISOString()
  };
  users.push(user);
  localStorage.setItem('rb_users', JSON.stringify(users));
  currentUser = user;
  localStorage.setItem('rb_user', JSON.stringify(user));
  updateUserUI();
  return { success: true };
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem('rb_user');
  updateUserUI();
  window.location.href = '../index.html';
}

function updateUserUI() {
  const userText = document.getElementById('userText');
  const logoutBtn = document.getElementById('logoutBtn');
  if (userText) {
    if (currentUser) {
      userText.textContent = currentUser.name.split(' ')[0];
      if (logoutBtn) logoutBtn.style.display = 'block';
    } else {
      userText.textContent = 'Sign In';
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
  }
}

// ===== ORDER FUNCTIONS =====
function createOrder(shippingAddress, paymentMethod) {
  const order = {
    id: 'RB' + Date.now().toString().slice(-8),
    items: [...cart],
    subtotal: getCartTotal(),
    shipping: 1500,
    total: getCartTotal() + 1500,
    shippingAddress,
    paymentMethod,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  localStorage.setItem('rb_orders', JSON.stringify(orders));
  cart = [];
  saveCart();
  return order;
}

// ===== PRODUCT CARD RENDERER =====
function renderProductCard(product) {
  const discount = calculateDiscount(product.originalPrice, product.price);
  const inWishlist = isInWishlist(product.id);

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-card-img">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
        <div class="product-card-badges">
          ${product.badge === 'sale' ? '<span class="product-badge badge-sale">SALE</span>' : ''}
          ${product.badge === 'new' ? '<span class="product-badge badge-new">NEW</span>' : ''}
          ${product.badge === 'hot' ? '<span class="product-badge badge-hot">HOT</span>' : ''}
        </div>
        <div class="product-card-actions">
          <button class="product-action-btn" onclick="toggleWishlist(${product.id}); this.innerHTML='${inWishlist ? '♡' : '♥'}'; showToast('${inWishlist ? 'Removed from' : 'Added to'} wishlist');">
            ${inWishlist ? '♥' : '♡'}
          </button>
          <button class="product-action-btn" onclick="window.location.href='pages/product.html?id=${product.id}'">👁</button>
        </div>
      </div>
      <div class="product-card-body">
        <div class="product-card-cat">${product.category}</div>
        <a href="pages/product.html?id=${product.id}" class="product-card-name">${product.name}</a>
        <div class="product-card-rating">
          <span class="stars">${generateStars(product.rating)}</span>
          <span class="rating-count">(${product.reviews})</span>
        </div>
        <div class="product-card-price">
          <span class="current-price">${formatPrice(product.price)}</span>
          <span class="original-price">${formatPrice(product.originalPrice)}</span>
          <span class="discount-pct">-${discount}%</span>
        </div>
      </div>
      <div class="product-card-footer">
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    </div>
  `;
}

function renderProductGrid(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = products.map(renderProductCard).join('');
}

// ===== HERO SLIDER =====
function initHeroSlider() {
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('heroDots');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  
  if (!slides.length || !dotsContainer) return;

  let current = 0;
  let interval;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goTo(i);
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    slides[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function prev() {
    goTo((current - 1 + slides.length) % slides.length);
  }

  if (prevBtn) prevBtn.onclick = () => { prev(); resetInterval(); };
  if (nextBtn) nextBtn.onclick = () => { next(); resetInterval(); };

  function startInterval() {
    // Auto-slide disabled - only manual navigation
  }

  function resetInterval() {
    // No-op - auto-slide disabled
  }

  startInterval();
}

// ===== FLASH SALE TIMER =====
function initFlashTimer() {
  const timerEl = document.getElementById('flashTimer');
  if (!timerEl) return;

  let totalSeconds = 5 * 3600 + 23 * 60 + 47;

  function update() {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    timerEl.textContent =
      String(h).padStart(2, '0') + ':' +
      String(m).padStart(2, '0') + ':' +
      String(s).padStart(2, '0');
    if (totalSeconds > 0) totalSeconds--;
  }

  update();
  setInterval(update, 1000);
}

// ===== BACK TO TOP =====
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  });

  btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== SEARCH =====
function initSearch() {
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const catSelect = document.getElementById('searchCat');

  if (!form) return;

  form.onsubmit = (e) => {
    e.preventDefault();
    const query = input.value.trim();
    const cat = catSelect ? catSelect.value : 'all';
    if (query) {
      window.location.href = `pages/products.html?q=${encodeURIComponent(query)}&cat=${cat}`;
    }
  };
}

// ===== NEWSLETTER =====
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.onsubmit = (e) => {
    e.preventDefault();
    showToast('Thanks for subscribing!');
    form.reset();
  };
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('heroSidebar');
  if (!btn || !sidebar) return;

  btn.onclick = () => {
    sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
  };
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  // Render products on homepage using active products
  const activeProducts = getActiveProducts();
  renderProductGrid('flashSaleGrid', getSaleProducts().slice(0, 6));
  renderProductGrid('featuredGrid', activeProducts.slice(0, 8));
  renderProductGrid('topSellersGrid', getHotProducts().slice(0, 6));
  renderProductGrid('newArrivalsGrid', getNewProducts().slice(0, 6));

  // Init components
  initHeroSlider();
  initFlashTimer();
  initBackToTop();
  initSearch();
  initNewsletter();
  initMobileMenu();

  // Update UI
  updateCartCount();
  updateWishlistCount();
  updateUserUI();

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = (e) => {
      e.preventDefault();
      logoutUser();
    };
  }

  // User dropdown toggle
  const userDropdown = document.getElementById('userDropdown');
  const headerUser = document.getElementById('headerUser');
  if (headerUser && userDropdown) {
    headerUser.addEventListener('mouseenter', () => userDropdown.classList.add('show'));
    headerUser.addEventListener('mouseleave', () => userDropdown.classList.remove('show'));
  }
});
