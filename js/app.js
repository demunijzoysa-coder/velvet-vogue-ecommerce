// Shared utilities and page controllers for Velvet Vogue

// Storage helpers
function getCart() {
  const raw = localStorage.getItem('vv_cart');
  try {
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Resetting cart', e);
    localStorage.removeItem('vv_cart');
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem('vv_cart', JSON.stringify(items));
  updateCartBadge();
}

function getUser() {
  const raw = localStorage.getItem('vv_user');
  try {
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    localStorage.removeItem('vv_user');
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem('vv_user', JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem('vv_user');
}

// Header/Footer
function renderShell() {
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');
  if (header) {
    header.innerHTML = `
      <div class="container nav">
        <a href="index.html" class="brand" aria-label="Velvet Vogue logo">
          <span>Velvet</span> Vogue
        </a>
        <nav class="nav-links" aria-label="Primary">
          <a href="index.html">Home</a>
          <a href="products.html">Products</a>
          <a href="about.html">About Us</a>
          <a href="contact.html">Contact</a>
        </nav>
        <div class="nav-actions">
          <button class="icon-btn" id="audio-toggle" aria-label="Toggle soundtrack" title="Toggle soundtrack">
            <span aria-hidden="true">♪</span>
          </button>
          <a href="${getUser() ? 'account.html' : 'auth.html'}" class="icon-btn" aria-label="User">
            <span aria-hidden="true">👤</span>
          </a>
          <a href="cart.html" class="icon-btn" aria-label="Cart">
            <span aria-hidden="true">🛍</span>
            <span class="cart-count" id="cart-count">0</span>
          </a>
          <button class="hamburger" id="hamburger" aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
      <div class="container mobile-nav" id="mobile-nav" aria-label="Mobile navigation">
        <a href="index.html">Home</a>
        <a href="products.html">Products</a>
        <a href="about.html">About Us</a>
        <a href="contact.html">Contact</a>
      </div>
    `;
  }
  if (footer) {
    footer.innerHTML = `
      <div class="container footer-grid">
        <div>
          <h4>Velvet Vogue</h4>
          <p class="muted">Luxury fashion, crafted for modern silhouettes.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <a href="products.html">Shop</a>
          <a href="account.html">Account</a>
          <a href="auth.html">Login</a>
        </div>
        <div>
          <h4>Support</h4>
          <a href="contact.html">Contact</a>
          <a href="products.html">Delivery</a>
          <a href="products.html">Returns</a>
        </div>
        <div>
          <h4>Newsletter</h4>
          <form id="footer-newsletter">
            <label class="sr-only" for="newsletter-email">Email</label>
            <input id="newsletter-email" type="email" name="email" placeholder="you@example.com" required>
            <button class="btn" type="submit">Subscribe</button>
          </form>
          <p class="muted" style="margin-top:8px;">No spam. Just refined drops.</p>
        </div>
      </div>
      <div class="container footer-meta">© ${new Date().getFullYear()} Velvet Vogue. All rights reserved.</div>
    `;
  }
}

function bindGlobalEvents() {
  const mobileNav = document.getElementById('mobile-nav');
  const hamburger = document.getElementById('hamburger');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }
  const newsletter = document.getElementById('footer-newsletter');
  if (newsletter) {
    newsletter.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Subscribed (simulation)');
      e.target.reset();
    });
  }

  const audioToggle = document.getElementById('audio-toggle');
  if (audioToggle) {
    const trackPath = 'assets/𝐓𝐢𝐦𝐞𝐥𝐞𝐬𝐬 𝐆𝐮𝐢𝐭𝐚𝐫 𝐑𝐞𝐦𝐢𝐱 (𝐓𝐢𝐤𝐭𝐨𝐤 𝐯𝐞𝐫𝐬𝐢𝐨𝐧) - Lυciѕѕ🪽 (youtube).mp3';
    const soundtrack = new Audio(trackPath);
    soundtrack.loop = true;
    soundtrack.preload = 'auto';

    const setState = (playing) => {
      audioToggle.textContent = playing ? '❚❚' : '♪';
      audioToggle.title = playing ? 'Pause soundtrack' : 'Play soundtrack';
      audioToggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
    };

    // Try to start softly; browsers may block until interaction
    soundtrack.play().then(() => setState(true)).catch(() => setState(false));

    audioToggle.addEventListener('click', () => {
      if (soundtrack.paused) {
        soundtrack.play().then(() => setState(true)).catch(() => setState(false));
      } else {
        soundtrack.pause();
        setState(false);
      }
    });
  }
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (badge) {
    const count = getCart().reduce((sum, item) => sum + item.qty, 0);
    badge.textContent = count;
  }
}

// Helpers
function formatPrice(value) {
  try {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(value);
  } catch (e) {
    return `LKR ${value.toFixed(2)}`;
  }
}

function showMessage(targetId, text, variant = 'notice') {
  const el = document.getElementById(targetId);
  if (el) {
    el.innerHTML = `<div class="${variant}">${text}</div>`;
  }
}

// Home page
function initHome() {
  const arrivalsContainer = document.getElementById('new-arrivals');
  if (arrivalsContainer) {
    const products = getAllProducts().slice(0, 4);
    arrivalsContainer.innerHTML = products
      .map(
        (p) => `
        <article class="product-card">
          <img src="${p.image}" alt="${p.name}">
          <div class="pill">${p.category}</div>
          <h3>${p.name}</h3>
          <p class="muted">${p.description.substring(0, 70)}...</p>
          <div class="product-meta">
            <span class="price">${formatPrice(p.price)}</span>
            <a class="btn btn-outline" href="product.html?id=${p.id}">View</a>
          </div>
        </article>
      `
      )
      .join('');
  }

  initLightModeTrigger('why-section', 'light-mode-home');
}

function initAbout() {
  initLightModeTrigger('about-trigger', 'gold-mode');
}

// Products page
function initProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  const sortSelect = document.getElementById('sort');
  const categorySelect = document.getElementById('category-filter');
  const sizeInputs = document.querySelectorAll('input[name="size-filter"]');
  const priceRange = document.getElementById('price-range');
  const priceValue = document.getElementById('price-value');
  const countLabel = document.getElementById('product-count');
  const drawerToggle = document.getElementById('drawer-toggle');
  const drawer = document.getElementById('filter-drawer');

  const urlCategory = new URLSearchParams(window.location.search).get('category');
  if (urlCategory && categorySelect) {
    categorySelect.value = urlCategory;
  }

  if (drawerToggle && drawer) {
    const updateState = () => {
      const expanded = !drawer.classList.contains('collapsed');
      drawerToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    };
    const toggle = () => {
      drawer.classList.toggle('collapsed');
      updateState();
    };
    drawerToggle.addEventListener('click', toggle);
    if (window.innerWidth < 900) {
      drawer.classList.add('collapsed');
      updateState();
    }
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 900) {
        drawer.classList.remove('collapsed');
      }
      updateState();
    });
  }

  const render = () => {
    const products = getAllProducts();
    const filters = {
      category: categorySelect ? categorySelect.value : 'All',
      sizes: Array.from(sizeInputs)
        .filter((i) => i.checked)
        .map((i) => i.value),
      price: priceRange ? Number(priceRange.value) : 1000,
      sort: sortSelect ? sortSelect.value : 'newest',
    };

    let filtered = products.filter((p) => {
      const matchesCategory = filters.category === 'All' || p.category === filters.category;
      const matchesSize = filters.sizes.length === 0 || p.sizes.some((s) => filters.sizes.includes(s));
      const matchesPrice = p.price <= filters.price;
      return matchesCategory && matchesSize && matchesPrice;
    });

    if (filters.sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-high') filtered.sort((a, b) => b.price - a.price);

    grid.innerHTML = filtered
      .map(
        (p) => `
        <article class="product-card">
          <img src="${p.image}" alt="${p.name}">
          <div class="pill">${p.category}</div>
          <h3>${p.name}</h3>
          <p class="muted">${p.description.substring(0, 70)}...</p>
          <div class="product-meta">
            <span class="price">${formatPrice(p.price)}</span>
            <a class="btn btn-outline" href="product.html?id=${p.id}">View</a>
          </div>
        </article>
      `
      )
      .join('');

    if (countLabel) {
      countLabel.textContent = `Showing ${filtered.length} of ${products.length} products`;
    }
    if (priceValue && priceRange) {
      priceValue.textContent = formatPrice(Number(priceRange.value));
    }
  };

  [sortSelect, categorySelect, priceRange].forEach((el) => {
    if (el) el.addEventListener('change', render);
  });
  sizeInputs.forEach((input) => input.addEventListener('change', render));

  render();
}

// Product detail page
function initProductDetail() {
  const detail = document.getElementById('product-detail');
  if (!detail) return;
  const id = new URLSearchParams(window.location.search).get('id');
  const product = id ? getProductById(id) : null;
  const relatedContainer = document.getElementById('related-products');

  if (!product) {
    detail.innerHTML = '<p class="notice">Product not found.</p>';
    return;
  }

  let selectedSize = product.sizes[0];
  let selectedColor = product.colors[0];
  let qty = 1;

  const renderOptions = () => {
    detail.innerHTML = `
      <div class="detail-media">
        <img id="main-img" src="${product.image}" alt="${product.name}">
        <div class="thumbs">
          ${product.colors
            .map(
              (c) =>
                `<img src="${product.image}" alt="Alternate view" data-src="${product.image}" role="button" tabindex="0">`
            )
            .join('')}
        </div>
      </div>
      <div class="detail-info">
        <h1>${product.name}</h1>
        <div class="product-meta">
          <span class="price">${formatPrice(product.price)}</span>
          <span class="muted">SKU ${product.id.toUpperCase()}</span>
        </div>
        <p class="muted">${product.description}</p>
        <div class="tags">
          ${product.tags.map((t) => `<span class="chip">${t}</span>`).join('')}
        </div>
        <div>
          <p class="muted">Size</p>
          <div class="options-row" id="size-options">
            ${product.sizes
              .map(
                (s) =>
                  `<button class="option-btn ${s === selectedSize ? 'active' : ''}" data-size="${s}">${s}</button>`
              )
              .join('')}
          </div>
        </div>
        <div>
          <p class="muted">Color</p>
          <div class="options-row" id="color-options">
            ${product.colors
              .map(
                (c) =>
                  `<button class="option-btn ${c === selectedColor ? 'active' : ''}" data-color="${c}">
                    <span class="color-dot" style="background:${c}"></span>
                  </button>`
              )
              .join('')}
          </div>
        </div>
        <div class="options-row" style="align-items:center;">
          <div class="qty-control">
            <button type="button" id="qty-dec" aria-label="Decrease quantity">-</button>
            <span id="qty-value">${qty}</span>
            <button type="button" id="qty-inc" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn" id="add-to-cart">Add to Cart</button>
        </div>
      </div>
    `;

    detail.querySelectorAll('#size-options .option-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedSize = btn.dataset.size;
        renderOptions();
      });
    });
    detail.querySelectorAll('#color-options .option-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedColor = btn.dataset.color;
        renderOptions();
      });
    });
    detail.querySelector('#qty-inc').addEventListener('click', () => {
      qty += 1;
      renderOptions();
    });
    detail.querySelector('#qty-dec').addEventListener('click', () => {
      qty = Math.max(1, qty - 1);
      renderOptions();
    });
    detail.querySelector('#add-to-cart').addEventListener('click', () => {
      addItemToCart(product, { size: selectedSize, color: selectedColor, qty });
      alert('Added to cart');
    });
    detail.querySelectorAll('.thumbs img').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const main = document.getElementById('main-img');
        if (main) main.src = thumb.dataset.src;
      });
      thumb.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') thumb.click();
      });
    });
    const qtyValue = detail.querySelector('#qty-value');
    if (qtyValue) qtyValue.textContent = qty;
  };

  renderOptions();

  if (relatedContainer) {
    const related = getAllProducts()
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
    relatedContainer.innerHTML = related
      .map(
        (p) => `
        <article class="product-card">
          <img src="${p.image}" alt="${p.name}">
          <div class="pill">${p.category}</div>
          <h3>${p.name}</h3>
          <div class="product-meta">
            <span class="price">${formatPrice(p.price)}</span>
            <a class="btn btn-outline" href="product.html?id=${p.id}">View</a>
          </div>
        </article>`
      )
      .join('');
  }
}

function addItemToCart(product, options) {
  const cart = getCart();
  const existing = cart.find(
    (item) => item.id === product.id && item.size === options.size && item.color === options.color
  );
  if (existing) {
    existing.qty += options.qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: options.size,
      color: options.color,
      qty: options.qty,
    });
  }
  saveCart(cart);
}

// Cart page
function initCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  const summary = document.getElementById('cart-summary');
  const checkoutForm = document.getElementById('checkout-form');
  const render = () => {
    const cart = getCart();
    if (cart.length === 0) {
      container.innerHTML = '<div class="empty-state">Your cart is empty.</div>';
      if (summary) summary.innerHTML = '';
      return;
    }
    container.innerHTML = cart
      .map(
        (item, idx) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <h4>${item.name}</h4>
            <p class="muted">Size ${item.size} · Color ${item.color}</p>
            <div class="qty-control" aria-label="Quantity control">
              <button type="button" data-action="dec" data-idx="${idx}">-</button>
              <span>${item.qty}</span>
              <button type="button" data-action="inc" data-idx="${idx}">+</button>
            </div>
          </div>
          <div style="text-align:right;">
            <p class="price">${formatPrice(item.price * item.qty)}</p>
            <button class="btn btn-outline" data-action="remove" data-idx="${idx}">Remove</button>
          </div>
        </div>
      `
      )
      .join('');

    container.querySelectorAll('button[data-action]').forEach((btn) =>
      btn.addEventListener('click', () => {
        const index = Number(btn.dataset.idx);
        const cartItems = getCart();
        const target = cartItems[index];
        if (!target) return;
        if (btn.dataset.action === 'inc') target.qty += 1;
        if (btn.dataset.action === 'dec') target.qty = Math.max(1, target.qty - 1);
        if (btn.dataset.action === 'remove') cartItems.splice(index, 1);
        saveCart(cartItems);
        render();
      })
    );

    if (summary) {
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      const tax = subtotal * 0;
      const total = subtotal + tax;
      summary.innerHTML = `
        <div class="summary-row"><span>Subtotal</span><strong>${formatPrice(subtotal)}</strong></div>
        <div class="summary-row"><span>Shipping</span><span class="muted">Calculated at checkout</span></div>
        <div class="summary-row"><span>Tax</span><strong>${formatPrice(tax)}</strong></div>
        <div class="summary-row"><span>Total</span><strong>${formatPrice(total)}</strong></div>
        <a class="btn btn-outline" href="products.html">Continue Shopping</a>
        <button class="btn" type="button" id="checkout-btn">Proceed to Checkout</button>
      `;
      const checkoutBtn = document.getElementById('checkout-btn');
      if (checkoutBtn && checkoutForm) {
        checkoutBtn.addEventListener('click', () => checkoutForm.scrollIntoView({ behavior: 'smooth' }));
      }
    }
  };

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(checkoutForm);
      if (!data.get('name') || !data.get('email') || !data.get('address')) {
        alert('Please fill all required fields.');
        return;
      }
      alert('Order placed (simulation)');
      saveCart([]);
      render();
      checkoutForm.reset();
    });
  }

  render();
}

// Auth page
function initAuth() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const handleAuth = (payload) => {
    const isAdmin = payload.email.toLowerCase() === 'admin@velvetvogue.com';
    saveUser({ name: payload.name || 'Admin', email: payload.email, role: isAdmin ? 'admin' : 'customer' });
    window.location.href = isAdmin ? 'admin.html' : 'account.html';
  };

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(loginForm);
      const email = data.get('email');
      const password = data.get('password');
      if (!email || !password) return alert('Please fill in email and password.');
      handleAuth({ email, name: email.split('@')[0] });
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(registerForm);
      const name = data.get('name');
      const email = data.get('email');
      const password = data.get('password');
      if (!name || !email || !password) return alert('Please fill all fields.');
      handleAuth({ name, email });
    });
  }
}

// Account page
function initAccount() {
  const accountRoot = document.getElementById('account');
  if (!accountRoot) return;
  const user = getUser();
  if (!user) {
    window.location.href = 'auth.html';
    return;
  }
  const profile = document.getElementById('profile-panel');
  if (profile) {
    profile.innerHTML = `
      <p class="muted">Signed in as</p>
      <h3>${user.name}</h3>
      <p class="muted">${user.email}</p>
      <p class="notice">Edit profile coming soon.</p>
      <button class="btn btn-outline" id="logout-btn">Logout</button>
    `;
    document.getElementById('logout-btn').addEventListener('click', () => {
      logoutUser();
      window.location.href = 'auth.html';
    });
  }
}

// Contact page
function initContact() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    if (!data.get('name') || !data.get('email') || !data.get('message')) {
      alert('Please complete all required fields.');
      return;
    }
    alert('Message sent (simulation)');
    contactForm.reset();
  });
}

// Admin page
function initAdmin() {
  const adminTable = document.getElementById('admin-products');
  if (!adminTable) return;
  const user = getUser();
  if (!user || user.role !== 'admin') {
    window.location.href = 'auth.html';
    return;
  }
  const modal = document.getElementById('product-modal');
  const modalContent = document.getElementById('product-modal-content');
  const openModalBtn = document.getElementById('add-product-btn');
  const closeModal = () => modal && modal.classList.remove('open');

  const renderTable = (query = '') => {
    const products = getAllProducts().filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    adminTable.innerHTML = `
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${products
          .map(
            (p) => `
          <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${formatPrice(p.price)}</td>
            <td><span class="badge">In Stock</span></td>
            <td class="actions">
              <button class="btn btn-outline" data-delete="${p.id}">Delete</button>
            </td>
          </tr>`
          )
          .join('')}
      </tbody>
    `;
    adminTable.querySelectorAll('button[data-delete]').forEach((btn) =>
      btn.addEventListener('click', () => {
        const id = btn.dataset.delete;
        const stored = getStoredAdminProducts().filter((p) => p.id !== id);
        saveAdminProducts(stored);
        renderTable();
      })
    );
  };

  const bindModalForm = () => {
    const form = document.getElementById('add-product-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const product = {
        id: `vvA${Date.now()}`,
        name: data.get('name'),
        category: data.get('category'),
        price: Number(data.get('price')) || 0,
        sizes: data.get('sizes').split(',').map((s) => s.trim()).filter(Boolean),
        colors: data.get('colors').split(',').map((c) => c.trim()).filter(Boolean),
        description: data.get('description'),
        tags: data.get('tags').split(',').map((t) => t.trim()).filter(Boolean),
        image: data.get('image') || 'assets/placeholder.svg',
      };
      addAdminProduct(product);
      renderTable();
      form.reset();
      closeModal();
    });
  };

  if (openModalBtn && modal) {
    openModalBtn.addEventListener('click', () => modal.classList.add('open'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  const searchInput = document.getElementById('admin-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => renderTable(searchInput.value));
  }

  renderTable();
  bindModalForm();
}

function init() {
  renderShell();
  bindGlobalEvents();
  updateCartBadge();
  initHeaderFinisher();

  initCursorTrail();

  const page = document.body.dataset.page;
  if (page === 'home') initHome();
  if (page === 'products') initProducts();
  if (page === 'product') initProductDetail();
  if (page === 'cart') initCart();
  if (page === 'auth') initAuth();
  if (page === 'contact') initContact();
  if (page === 'account') initAccount();
  if (page === 'admin') initAdmin();
  if (page === 'about') initAbout();
}

document.addEventListener('DOMContentLoaded', init);

// Gold cursor trail effect
function initCursorTrail() {
  if (document.querySelector('.cursor-layer')) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'cursor-layer';
  const ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const maxParticles = 120;
  const gold = '212, 175, 55';

  function addParticle(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 1.5 + 0.5;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: Math.random() * 0.02 + 0.015,
      size: Math.random() * 10 + 6,
    });
    if (particles.length > maxParticles) particles.shift();
  }

  window.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 4; i++) addParticle(e.clientX, e.clientY);
  });

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      const alpha = Math.max(p.life, 0);
      if (alpha <= 0) return;
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      gradient.addColorStop(0, `rgba(${gold}, ${alpha})`);
      gradient.addColorStop(1, `rgba(${gold}, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].life <= 0) particles.splice(i, 1);
    }
    requestAnimationFrame(render);
  }

  render();
}

// Header particle finisher effect
function initHeaderFinisher() {
  const header = document.getElementById('site-header');
  if (!header || header.dataset.finisher === 'on') return;
  header.dataset.finisher = 'on';

  const canvas = document.createElement('canvas');
  canvas.className = 'header-finisher';
  header.prepend(canvas);
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width = header.clientWidth;
    canvas.height = header.clientHeight || 120;
  };
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 50 }).map(() => seedParticle());

  function seedParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 8 + 3,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.3,
    };
  }

  function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(step);
  }

  step();
}

// Light mode trigger for sections
function initLightModeTrigger(triggerId, className = 'light-mode-home') {
  const el = document.getElementById(triggerId);
  if (!el) return;
  const classes = ['light-mode-home', 'gold-mode'];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          classes.forEach((c) => {
            if (c !== className) document.body.classList.remove(c);
          });
          document.body.classList.add(className);
        } else {
          document.body.classList.remove(className);
        }
      });
    },
    { threshold: 0.35 }
  );
  observer.observe(el);
}
