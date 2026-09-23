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
  updateMiniCart();
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

// ===== CART SIDEBAR (WOW-FOOD STYLE) =====
function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (!sidebar || !overlay) return;
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
  if (sidebar.classList.contains('active')) {
    renderCartSidebar();
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

function renderCartSidebar() {
  const container = document.getElementById('cartSidebarItems');
  const footer = document.getElementById('cartSidebarFooter');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-cart"><p style="font-size:40px; margin-bottom:8px;">🛒</p><p>Your cart is empty</p></div>';
    if (footer) footer.style.display = 'none';
    return;
  }

  let html = '';
  cart.forEach(item => {
    const p = getProductById(item.id);
    if (!p) return;
    html += `
      <div class="cart-item">
        <img src="${p.image}" alt="${p.name}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/60'">
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">₦${(p.price * item.qty).toLocaleString()}</div>
          <div class="cart-item-qty">
            <button onclick="changeSidebarQty(${item.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeSidebarQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeSidebarItem(${item.id})">🗑</button>
      </div>
    `;
  });
  container.innerHTML = html;

  const total = getCartTotal();
  const totalEl = document.getElementById('cartSidebarTotal');
  if (totalEl) totalEl.textContent = '₦' + total.toLocaleString();
  if (footer) {
    footer.style.display = 'block';
    // Add shipping note if not already there
    if (!footer.querySelector('.shipping-note')) {
      const note = document.createElement('p');
      note.className = 'shipping-note';
      note.style.cssText = 'font-size:12px; color:#FF6B00; text-align:center; margin-bottom:8px; font-weight:500;';
      note.textContent = '🚚 Shipping fee is negotiable';
      footer.insertBefore(note, footer.firstChild);
    }
  }

  updateMiniCart();
}

function changeSidebarQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  saveCart();
  renderCartSidebar();
}

function removeSidebarItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCartSidebar();
  showToast('Item removed from cart');
}

// ===== MINI CART POPUP =====
function updateMiniCart() {
  const popup = document.getElementById('miniCartPopup');
  const countEl = document.getElementById('miniCartCount');
  if (!popup || !countEl) return;
  const count = getCartItemCount();
  if (count > 0) {
    popup.style.display = 'flex';
    countEl.textContent = count;
  } else {
    popup.style.display = 'none';
  }
}

// ===== CHECKOUT MODAL (WOW-FOOD STYLE) =====
let checkoutTotal = 0;
let isSubmitting = false;

function openCheckout() {
  if (cart.length === 0) {
    showToast('Your cart is empty', 'error');
    return;
  }
  toggleCart(); // close cart sidebar

  const overlay = document.getElementById('checkoutOverlay');
  if (!overlay) return;

  // Show step 1
  document.getElementById('checkoutStep1').style.display = 'block';
  document.getElementById('checkoutStep2').style.display = 'none';
  document.getElementById('checkoutStep3').style.display = 'none';
  overlay.style.display = 'flex';

  // Pre-fill if logged in
  if (currentUser) {
    document.getElementById('coName').value = currentUser.name || '';
    document.getElementById('coEmail').value = currentUser.email || '';
    document.getElementById('coPhone').value = currentUser.phone || '';
  }

  // Show order summary
  const storeSettings = JSON.parse(localStorage.getItem('rb_store_settings')) || {};
  checkoutTotal = getCartTotal();

  let items = cart.map(item => {
    const p = getProductById(item.id);
    return p ? `<div class="summary-item"><span>${p.name} x${item.qty}</span><span>₦${(p.price * item.qty).toLocaleString()}</span></div>` : '';
  }).join('');
  items += `<div class="summary-item"><span>Subtotal</span><span>₦${getCartTotal().toLocaleString()}</span></div>`;
  items += `<div class="summary-item"><span>Shipping</span><span style="color:#FF6B00; font-weight:600;">Negotiable</span></div>`;
  items += `<div class="summary-total"><span>Subtotal</span><span>₦${checkoutTotal.toLocaleString()}</span></div>`;

  document.getElementById('checkoutSummary').innerHTML = items;
}

function closeCheckout() {
  const overlay = document.getElementById('checkoutOverlay');
  if (overlay) overlay.style.display = 'none';
  isSubmitting = false;
}

// Step 1 → Step 2: Show bank transfer
function showBankTransferStep() {
  const name = document.getElementById('coName').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  const address = document.getElementById('coAddress').value.trim();

  if (!name || !phone || !address) {
    showToast('Please fill all required fields', 'error');
    return;
  }

  // Load bank details from admin settings
  const storeSettings = JSON.parse(localStorage.getItem('rb_store_settings')) || {};
  document.getElementById('coBankName').textContent = storeSettings.bankName || 'GTBank';
  document.getElementById('coAccountName').textContent = storeSettings.accountName || 'R&T Beauty Hub';
  document.getElementById('coAccountNumber').textContent = storeSettings.accountNumber || '0123456789';
  document.getElementById('coBankTotal').textContent = '₦' + checkoutTotal.toLocaleString();

  // Order summary
  let items = cart.map(item => {
    const p = getProductById(item.id);
    return p ? `<div class="summary-item"><span>${p.name} x${item.qty}</span><span>₦${(p.price * item.qty).toLocaleString()}</span></div>` : '';
  }).join('');
  items += `<div class="summary-item"><span>Shipping</span><span style="color:#FF6B00; font-weight:600;">Negotiable</span></div>`;
  items += `<div class="summary-total"><span>Subtotal</span><span>₦${checkoutTotal.toLocaleString()}</span></div>`;
  document.getElementById('bankTransferSummary').innerHTML = items;

  // Reset checkbox
  document.getElementById('confirmTransfer').checked = false;
  document.getElementById('confirmOrderBtn').disabled = true;

  // Switch to step 2
  document.getElementById('checkoutStep1').style.display = 'none';
  document.getElementById('checkoutStep2').style.display = 'block';
}

// Copy account number
function copyAccountNumber() {
  const num = document.getElementById('coAccountNumber').textContent;
  navigator.clipboard.writeText(num).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
  }).catch(() => {});
}

// Toggle confirm button
function toggleConfirmBtn() {
  const checked = document.getElementById('confirmTransfer').checked;
  document.getElementById('confirmOrderBtn').disabled = !checked;
}

// Step 2 → Step 3: Confirm order
function confirmOrder() {
  if (isSubmitting) return;
  isSubmitting = true;

  const btn = document.getElementById('confirmOrderBtn');
  btn.textContent = 'Processing...';
  btn.disabled = true;

  const name = document.getElementById('coName').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  const email = document.getElementById('coEmail').value.trim();
  const address = document.getElementById('coAddress').value.trim();
  const note = document.getElementById('coNote').value.trim();

  // Generate order ID
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
  const orderId = 'RT-' + dateStr + '-' + randomSuffix;

  // Build order object
  const order = {
    id: orderId,
    items: cart.map(item => {
      const p = getProductById(item.id);
      return p ? { id: p.id, name: p.name, price: p.price, qty: item.qty, image: p.image, subtotal: p.price * item.qty } : null;
    }).filter(Boolean),
    total: checkoutTotal,
    customer: name,
    phone: phone,
    email: email,
    address: address,
    note: note,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Pending Verification',
    orderStatus: 'Pending Confirmation',
    date: now.toISOString()
  };

  // Save order
  orders.unshift(order);
  localStorage.setItem('rb_orders', JSON.stringify(orders));

  // Build WhatsApp message
  const storeSettings = JSON.parse(localStorage.getItem('rb_store_settings')) || {};
  const bizName = storeSettings.businessName || 'R&T Beauty Hub';

  let itemsText = cart.map(item => {
    const p = getProductById(item.id);
    return p ? `• ${item.qty} x ${p.name} — ₦${(p.price * item.qty).toLocaleString()}` : '';
  }).join('\n');

  const whatsappMessage = `🛍️ *${bizName.toUpperCase()}* 🛍️
━━━━━━━━━━━━━━━━━━━━━━
✨ *ORDER RECEIPT* ✨
━━━━━━━━━━━━━━━━━━━━━━

📋 *Order ID:* ${orderId}
📅 *Date:* ${now.toLocaleDateString('en-NG')}
⏰ *Time:* ${now.toLocaleTimeString('en-NG')}

━━━━━━━━━━━━━━━━━━━━━━
👤 *Customer:* ${name}
📞 *Phone:* ${phone}
${email ? `📧 *Email:* ${email}\n` : ''}📍 *Address:* ${address}
━━━━━━━━━━━━━━━━━━━━━━

🛒 *ORDER ITEMS:*
${itemsText}

━━━━━━━━━━━━━━━━━━━━━━
💰 *TOTAL: ₦${checkoutTotal.toLocaleString()}*
🚚 *Shipping: To be discussed*
━━━━━━━━━━━━━━━━━━━━━━

💳 *Payment Method:* Bank Transfer
⏳ *Payment Status:* _Pending Verification_

━━━━━━━━━━━━━━━━━━━━━━

✅ I have made the transfer.
📤 I will send my proof of payment here for verification.

🙏 Please confirm my order. Thank you!
🌟 *${bizName}* 🌟`;

  const encodedMessage = encodeURIComponent(whatsappMessage);
  const whatsappNumber = storeSettings.whatsapp || '2348000000000';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  // Clear cart
  cart = [];
  saveCart();
  renderCartSidebar();

  // Show success step
  document.getElementById('checkoutStep2').style.display = 'none';
  document.getElementById('checkoutStep3').style.display = 'block';
  document.getElementById('successOrderId').textContent = orderId;

  // WhatsApp button
  const waBtn = document.getElementById('whatsappBtn');
  if (waBtn) waBtn.onclick = () => {
    if (window._whatsappCountdown) clearInterval(window._whatsappCountdown);
    window.open(whatsappUrl, '_blank');
  };

  // Countdown auto-redirect (8 seconds)
  let count = 0;
  const totalDuration = 8000;
  const interval = 50;
  const fill = document.getElementById('countdownFill');
  const countdownEl = document.getElementById('countdownNum');
  window._whatsappCountdown = setInterval(() => {
    count += interval;
    if (fill) fill.style.width = ((count / totalDuration) * 100) + '%';
    if (countdownEl) countdownEl.textContent = Math.ceil((totalDuration - count) / 1000);
    if (count >= totalDuration) {
      clearInterval(window._whatsappCountdown);
      window.open(whatsappUrl, '_blank');
    }
  }, interval);

  isSubmitting = false;
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
function loginUser(email, password, role = 'user') {
  // Simulated login
  const users = JSON.parse(localStorage.getItem('rb_users')) || [];
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    user.role = role;
    localStorage.setItem('rb_user', JSON.stringify(user));
    updateUserUI();
    showToast('Login successful!');
    setTimeout(() => {
      if (role === 'admin') {
        window.location.href = 'admin/index.html';
      } else {
        window.location.href = 'index.html';
      }
    }, 1500);
    return { success: true };
  }
  return { success: false, message: 'Invalid email or password' };
}

function registerUser(name, email, password, role = 'user') {
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
    role: role,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  localStorage.setItem('rb_users', JSON.stringify(users));
  currentUser = user;
  localStorage.setItem('rb_user', JSON.stringify(user));
  updateUserUI();
  showToast('Account created successfully!');
  setTimeout(() => {
    if (role === 'admin') {
      window.location.href = 'admin/index.html';
    } else {
      window.location.href = 'index.html';
    }
  }, 1500);
  return { success: true };
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem('rb_user');
  updateUserUI();
  window.location.href = '../index.html';
}

// ===== SOCIAL LOGIN =====
function socialLogin(provider) {
  const providerNames = { google: 'Google', microsoft: 'Microsoft', yahoo: 'Yahoo' };
  const providerName = providerNames[provider] || provider;

  const popup = window.open('', '_blank', 'width=480,height=600,scrollbars=yes');
  popup.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sign in with ${providerName}</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .popup-card { background: #fff; border-radius: 12px; padding: 32px; width: 380px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        .popup-logo { text-align: center; margin-bottom: 8px; }
        .popup-logo img { width: 48px; height: 48px; border-radius: 8px; }
        .popup-title { text-align: center; font-size: 18px; font-weight: 600; color: #1a1a2e; margin-bottom: 4px; }
        .popup-subtitle { text-align: center; font-size: 13px; color: #666; margin-bottom: 24px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 13px; font-weight: 500; color: #333; margin-bottom: 4px; }
        .form-group input { width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; font-family: inherit; }
        .form-group input:focus { outline: none; border-color: #FF6B00; }
        .popup-btn { width: 100%; padding: 12px; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; margin-top: 8px; }
        .popup-btn-primary { background: #FF6B00; color: #fff; }
        .popup-btn-primary:hover { background: #E65100; }
        .popup-btn-cancel { background: #f0f0f0; color: #666; margin-top: 8px; }
        .popup-btn-cancel:hover { background: #e0e0e0; }
        .popup-or { text-align: center; font-size: 12px; color: #999; margin: 16px 0; position: relative; }
        .popup-or::before, .popup-or::after { content: ''; position: absolute; top: 50%; width: 40%; height: 1px; background: #ddd; }
        .popup-or::before { left: 0; }
        .popup-or::after { right: 0; }
        .popup-footer { text-align: center; font-size: 11px; color: #999; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="popup-card">
        <div class="popup-logo">
          <img src="../images/logo.png" alt="R&T Beauty Hub">
        </div>
        <div class="popup-title">Continue with ${providerName}</div>
        <div class="popup-subtitle">Enter your ${providerName} account details</div>
        <form id="socialForm">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="socialName" required placeholder="John Doe">
          </div>
          <div class="form-group">
            <label>${providerName} Email</label>
            <input type="email" id="socialEmail" required placeholder="you@${provider === 'google' ? 'gmail' : provider === 'yahoo' ? 'yahoo' : 'outlook'}.com">
          </div>
          <button type="submit" class="popup-btn popup-btn-primary">Continue</button>
          <button type="button" class="popup-btn popup-btn-cancel" onclick="window.close()">Cancel</button>
        </form>
        <div class="popup-footer">By continuing, you agree to R&T Beauty Hub's Terms of Service</div>
      </div>
      <script>
        document.getElementById('socialForm').addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.getElementById('socialName').value.trim();
          const email = document.getElementById('socialEmail').value.trim();
          if (name && email) {
            window.opener.postMessage({ type: 'social-login', provider: '${provider}', name: name, email: email }, '*');
            window.close();
          }
        });
      </script>
    </body>
    </html>
  `);
}

window.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'social-login') {
    const { provider, name, email } = e.data;
    const result = socialLoginUser(name, email, provider);
    if (result.success) {
      showToast('Signed in with ' + provider.charAt(0).toUpperCase() + provider.slice(1) + '!');
      setTimeout(() => window.location.href = '../index.html', 1000);
    }
  }
});

function socialLoginUser(name, email, provider) {
  const users = JSON.parse(localStorage.getItem('rb_users')) || [];
  let user = users.find(u => u.email === email);
  if (!user) {
    user = {
      id: Date.now(),
      name: name,
      email: email,
      password: '',
      phone: '',
      address: '',
      provider: provider,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    localStorage.setItem('rb_users', JSON.stringify(users));
  }
  currentUser = user;
  localStorage.setItem('rb_user', JSON.stringify(user));
  updateUserUI();
  return { success: true };
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
// ===== AUTH CHECK =====
function checkAuth() {
  const user = JSON.parse(localStorage.getItem('rb_user
# Repo Structure and Setup

The project structure for the most part is at `C:\Users\DELU XT\`×
function loadSocialLinks() {
  const settings = JSON.parse(localStorage.getItem('rb_store_settings')) || {};
  if (settings.facebook) {
    const el = document.getElementById('socialFacebook');
    if (el) { el.href = settings.facebook; el.target = '_blank'; }
  }
  if (settings.instagram) {
    const el = document.getElementById('socialInstagram');
    if (el) { el.href = settings.instagram; el.target = '_blank'; }
  }
  if (settings.twitter) {
    const el = document.getElementById('socialTwitter');
    if (el) { el.href = settings.twitter; el.target = '_blank'; }
  }
  if (settings.tiktok) {
    const el = document.getElementById('socialTiktok');
    if (el) { el.href = settings.tiktok; el.target = '_blank'; }
  }
}

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

  // Checkout form submit
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showBankTransferStep();
    });
  }

  // Update UI
  updateCartCount();
  updateMiniCart();
  updateWishlistCount();
  updateUserUI();
  loadSocialLinks();

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
