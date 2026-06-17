const htmlRoot = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const seatButtons = document.querySelectorAll('.seatOption');
const selectedSeatLabel = document.getElementById('selectedSeat');
const openSeatModal = document.getElementById('openSeatModal');
const closeSeatModal = document.getElementById('closeSeatModal');
const seatModal = document.getElementById('seatModal');
const reservationBanner = document.getElementById('reservationBanner');
const bookingForm = document.getElementById('bookingForm');
const customerNameInput = document.getElementById('customerName');
const customerPhoneInput = document.getElementById('customerPhone');
const bookingDateTimeInput = document.getElementById('bookingDateTime');
const cartDrawer = document.getElementById('cartDrawer');
const cartBackdrop = document.getElementById('cartBackdrop');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTax = document.getElementById('cartTax');
const cartTotal = document.getElementById('cartTotal');
// Order modal elements (may be null on pages without the modal)
const orderNowButton = document.getElementById('orderNowButton');
const orderModal = document.getElementById('orderModal');
const orderModalBackdrop = document.getElementById('orderModalBackdrop');
const orderModalClose = document.getElementById('orderModalClose');
const proceedToPayment = document.getElementById('proceedToPayment');
const backToDetails = document.getElementById('backToDetails');
const confirmOrder = document.getElementById('confirmOrder');

const custPhone = document.getElementById('custPhone');
const custWhatsApp = document.getElementById('custWhatsApp');
const custAddress = document.getElementById('custAddress');
const custCity = document.getElementById('custCity');
const custCountry = document.getElementById('custCountry');
const paymentOptionCOD = document.getElementById('paymentOptionCOD');
const paymentOptionOnline = document.getElementById('paymentOptionOnline');
const cartButton = document.getElementById('openCartButton');
const storedTheme = localStorage.getItem('gustooro-theme');
const storedCart = JSON.parse(localStorage.getItem('gustooro-cart') || '{}');
const WEBSITE_CONFIG = {
  whatsappNumber: '8801717193544',
  merchantPayPalEmail: 'PLACEHOLDER_EMAIL',
  isPaymentActive: false
};
const WA_PHONE = WEBSITE_CONFIG.whatsappNumber;
// assets/js/main.js line 53: PAYMENT_GATEWAY_CONFIG block for future payment provider integration.
// Insert Stripe / PayPal / bank credentials here to replace the simulated online flow.
const PAYMENT_GATEWAY_CONFIG = {
  // bankAccount: {
  //   IBAN: 'YOUR_IBAN',
  //   SWIFT_BIC: 'YOUR_SWIFT',
  //   accountName: 'YOUR_ACCOUNT_NAME'
  // },
  // stripe: {
  //   publishableKey: 'pk_live_xxx',
  //   secretKey: 'sk_live_xxx'
  // },
  // paypal: {
  //   clientId: 'YOUR_PAYPAL_CLIENT_ID',
  //   secret: 'YOUR_PAYPAL_SECRET'
  // }
};
const salesTaxRate = 0.08;
let cart = storedCart || {};
let testimonialIndex = 0;
const testimonialsIntervalMs = 6500;
const testimonialTimer = () => setInterval(() => showTestimonial((testimonialIndex + 1) % testimonialSlides.length), testimonialsIntervalMs);
let testimonialInterval = null;
function applyTheme(theme) {
  if (theme === 'dark') {
    htmlRoot.classList.add('dark');
    localStorage.setItem('gustooro-theme', 'dark');
  } else {
    htmlRoot.classList.remove('dark');
    localStorage.setItem('gustooro-theme', 'light');
  }
}
function initializeTheme() {
  if (storedTheme === 'dark') {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }
}
function toggleTheme() {
  const isDark = htmlRoot.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
}
function toggleMobileMenu() {
  mobileMenu?.classList.toggle('hidden');
}
function showTestimonial(index) {
  testimonialSlides.forEach((slide, idx) => {
    slide.classList.toggle('hidden', idx !== index);
    slide.classList.toggle('opacity-100', idx === index);
  });
  testimonialDots.forEach((dot, idx) => {
    dot.classList.toggle('bg-amber-500', idx === index);
    dot.classList.toggle('bg-slate-300', idx !== index);
  });
  testimonialIndex = index;
}
function openSeatSelection() {
  seatModal?.classList.remove('hidden');
}
function closeSeatSelection() {
  seatModal?.classList.add('hidden');
}
function flashReservationSuccess() {
  if (!reservationBanner) return;
  reservationBanner.classList.remove('hidden');
  reservationBanner.classList.add('animate-fade-in');
  setTimeout(() => reservationBanner?.classList.add('hidden'), 3200);
}
function saveCart() {
  localStorage.setItem('gustooro-cart', JSON.stringify(cart));
}
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}
function updateCartTotals() {
  const items = Object.values(cart);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * salesTaxRate;
  const total = subtotal + tax;
  if (cartSubtotal) cartSubtotal.textContent = formatCurrency(subtotal);
  if (cartTax) cartTax.textContent = formatCurrency(tax);
  if (cartTotal) cartTotal.textContent = formatCurrency(total);
}
function renderCart() {
  if (!cartItemsContainer) return;
  cartItemsContainer.innerHTML = '';
  const items = Object.values(cart);
  if (!items.length) {
    cartItemsContainer.innerHTML = '<p class="text-sm text-slate-500 dark:text-slate-400">Your cart is empty. Add a dish to begin your bespoke order.</p>';
    updateCartTotals();
    return;
  }
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900';
    card.innerHTML = `
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="font-semibold text-slate-950 dark:text-slate-100">${item.title}</p>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">${item.quantity} x ${formatCurrency(item.price)}</p>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <button class="cart-decrease inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-800 transition hover:border-amber-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" data-product="${item.id}">-</button>
          <span class="w-8 text-center">${item.quantity}</span>
          <button class="cart-increase inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-800 transition hover:border-amber-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" data-product="${item.id}">+</button>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(card);
  });
  const decreaseButtons = cartItemsContainer.querySelectorAll('.cart-decrease');
  const increaseButtons = cartItemsContainer.querySelectorAll('.cart-increase');
  decreaseButtons.forEach(btn => btn.addEventListener('click', handleCartDecrease));
  increaseButtons.forEach(btn => btn.addEventListener('click', handleCartIncrease));
  updateCartTotals();
}
function handleCartDecrease(event) {
  const id = event.currentTarget.dataset.product;
  if (!cart[id]) return;
  cart[id].quantity -= 1;
  if (cart[id].quantity <= 0) delete cart[id];
  saveCart();
  renderCart();
}
function handleCartIncrease(event) {
  const id = event.currentTarget.dataset.product;
  if (!cart[id]) return;
  cart[id].quantity += 1;
  saveCart();
  renderCart();
}
function openCart() {
  cartDrawer?.classList.remove('hidden');
  cartBackdrop?.classList.remove('hidden');
  renderCart();
}
function closeCartDrawer() {
  cartDrawer?.classList.add('hidden');
  cartBackdrop?.classList.add('hidden');
}
function addToCart(product) {
  if (!cart[product.id]) {
    cart[product.id] = { ...product, quantity: 0 };
  }
  cart[product.id].quantity += 1;
  saveCart();
  openCart();
}
function loadMenuItems() {
  const menuGrid = document.getElementById('menuGrid');
  if (!menuGrid) return;
  const isDessertPage = location.pathname.includes('menu2.html');
  const items = isDessertPage ? [
    { id: 'dessert1', title: 'Golden Millefeuille', category: 'desserts', price: 22, description: 'Crisp layers of pastry, citrus cream and caramelized figs.', image: 'assets/images/golden-m.jpg', tags: ['Vegetarian', 'Signature'] },
    { id: 'dessert2', title: 'Cocoa Dome', category: 'desserts', price: 24, description: 'Dark chocolate mousse with gilded hazelnut crumble.', image: 'assets/images/c-dome.jpg', tags: ['Gluten-free', 'Intense'] },
    { id: 'coffee1', title: 'Single Origin Espresso', category: 'coffee', price: 8, description: 'Velvety brew prepared from selected dark roast beans.', image: 'assets/images/s-origin.jpg', tags: ['Artisan', 'Warm'] },
    { id: 'coffee2', title: 'Amber Latte', category: 'coffee', price: 12, description: 'Spiced latte with cardamom foam and caramel notes.', image: 'assets/images/amber.jpg', tags: ['Signature', 'Creamy'] },
    { id: 'wine1', title: 'Vintage Rosé', category: 'wines', price: 26, description: 'Elegant notes of cherry, rose petals and silk tannin.', image: 'assets/images/v-rose.jpg', tags: ['Fine Wine', 'Reserve'] },
    { id: 'wine2', title: 'Champagne Cuvée', category: 'wines', price: 34, description: 'Bright bubbles paired with subtle pear and almond.', image: 'assets/images/c-cuvee.jpg', tags: ['Celebration', 'Lux'] } 
  ] : [
    { id: 'starter1', title: 'Truffle Cauliflower', category: 'starters', price: 18, description: 'Charred cauliflower with black truffle vinaigrette.', image: 'assets/images/t-cauliflower.jpg', tags: ['Vegetarian', 'Truffle'] },
    { id: 'starter2', title: 'Beetroot Carpaccio', category: 'starters', price: 17, description: 'Golden beet slices with citrus fennel and queso fresco.', image: 'assets/images/beetroot-c.jpg', tags: ['Vegan', 'Fresh'] },
    { id: 'main1', title: 'Wagyu Short Rib', category: 'mains', price: 42, description: 'Slow-braised wagyu with smoked parsnip purée.', image: 'assets/images/w-s-rib.jpg', tags: ['Rich', 'Prime'] },
    { id: 'main2', title: 'Sea Bass En Papillote', category: 'mains', price: 38, description: 'Silky bass with preserved lemon and herb broth.', image: 'assets/images/s-b-papillote.jpg', tags: ['Seafood', 'Light'] },
    { id: 'dessert1', title: 'Saffron Creme Brûlée', category: 'desserts', price: 16, description: 'Silk custard with amber brûlée and rose touch.', image: 'assets/images/s-c-brulee.jpg', tags: ['Delicate', 'Signature'] },
    { id: 'dessert2', title: 'Pistachio Baba', category: 'desserts', price: 18, description: 'Rum-soaked pastry with pistachio cream and gold leaf.', image: 'assets/images/p-babe.jpg', tags: ['Luxe', 'Sweet'] }
  ];
  menuGrid.innerHTML = '';
  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'group rounded-[2rem] border border-slate-200 bg-white/95 p-5 shadow-xl shadow-amber-100/20 transition hover:-translate-y-1 hover:border-amber-300 dark:border-slate-700 dark:bg-slate-950/90 dark:shadow-slate-900/20';
    card.dataset.category = item.category;
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="w-full h-64 object-cover rounded-lg shadow-md" />
      <div class="mt-6 space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-2xl font-semibold text-slate-950 dark:text-slate-50">${item.title}</h3>
            <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">${item.description}</p>
          </div>
          <p class="text-xl font-semibold text-amber-600 dark:text-amber-300">${formatCurrency(item.price)}</p>
        </div>
        <div class="flex flex-wrap gap-2 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          ${item.tags.map(tag => `<span class="rounded-full border border-slate-200 px-3 py-2 dark:border-slate-700">${tag}</span>`).join('')}
        </div>
        <button class="addToCartButton mt-4 inline-flex w-full items-center justify-center rounded-3xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400" data-product='${JSON.stringify(item)}'>Add to Cart</button>
      </div>
    `;
    menuGrid.appendChild(card);
  });
  const addButtons = document.querySelectorAll('.addToCartButton');
  addButtons.forEach(button => button.addEventListener('click', event => {
    const payload = JSON.parse(event.currentTarget.dataset.product);
    addToCart(payload);
  }));
}
function filterMenu(event) {
  const button = event.currentTarget;
  if (!button.classList.contains('category-button')) return;
  const filter = button.dataset.filter;
  document.querySelectorAll('.category-button').forEach(btn => btn.classList.toggle('active', btn === button));
  document.querySelectorAll('#menuGrid article').forEach(card => {
    if (filter === 'all' || card.dataset.category === filter) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}
function handleCheckout() {
  const items = Object.values(cart);
  if (!items.length) return;
  const lines = items.map(item => `${item.quantity} x ${item.title} - ${formatCurrency(item.price)}`);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * salesTaxRate;
  const total = subtotal + tax;
  const message = `Hello GustoOro, I would like to place an order:%0A${encodeURIComponent(lines.join('%0A'))}%0A%0ASubtotal: ${encodeURIComponent(formatCurrency(subtotal))}%0ATax: ${encodeURIComponent(formatCurrency(tax))}%0ATotal: ${encodeURIComponent(formatCurrency(total))}`;
  window.open(`https://wa.me/${WEBSITE_CONFIG.whatsappNumber}?text=${message}`, '_blank');
}
function handleOnlinePayment() {
  const items = Object.values(cart);
  if (!items.length) return;
  if (!WEBSITE_CONFIG.isPaymentActive) {
    alert('Online payment setup is in progress. Please use Checkout with WhatsApp for now.');
    return;
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * salesTaxRate;
  const total = subtotal + tax;
  const paypalEmail = WEBSITE_CONFIG.merchantPayPalEmail;
  const paypalParams = new URLSearchParams({
    cmd: '_xclick',
    business: paypalEmail,
    item_name: 'GustoOro Order',
    amount: total.toFixed(2),
    currency_code: 'USD',
    tax: tax.toFixed(2)
  });
  window.open(`https://www.paypal.com/cgi-bin/webscr?${paypalParams.toString()}`, '_blank');
}
// assets/js/main.js lines 293-368: New Order Modal Flow and conditional submit handlers.
// This block includes the paymentStatus logic for Hand Cash and Online Payment.
// Paste exactly into assets/js/main.js between existing helper functions and initialization.
// Future buyer can extend simulateOnlinePayment() with real Stripe/PayPal SDK calls here.
function openOrderModal() {
  if (!Object.values(cart).length) return;
  orderModal?.classList.remove('hidden');
  document.getElementById('orderStep1')?.classList.remove('hidden');
  document.getElementById('orderStep2')?.classList.add('hidden');
}
function closeOrderModal() {
  orderModal?.classList.add('hidden');
}
function showPaymentStep() {
  if (!custPhone?.value.trim() || !custAddress?.value.trim()) {
    alert('Please enter at least a phone number and address.');
    return;
  }
  document.getElementById('orderStep1')?.classList.add('hidden');
  document.getElementById('orderStep2')?.classList.remove('hidden');
}
function showDetailsStep() {
  document.getElementById('orderStep2')?.classList.add('hidden');
  document.getElementById('orderStep1')?.classList.remove('hidden');
}
function simulateOnlinePayment() {
  return new Promise(resolve => {
    // Placeholder payment flow for future Stripe/PayPal integration.
    // Replace this with the real SDK checkout flow when ready.
    const success = window.confirm('Simulate online payment success? Click OK to confirm payment.');
    resolve(success);
  });
}
function buildOrderMessage(paymentMethod, paymentStatus) {
  const items = Object.values(cart);
  const itemLines = items.map(i => `${i.title} x ${i.quantity}`).join('%0A');
  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const tax = subtotal * salesTaxRate;
  const phone = custPhone?.value.trim() || 'N/A';
  const wapp = custWhatsApp?.value.trim() || 'N/A';
  const address = `${custAddress?.value.trim() || 'N/A'}, ${custCity?.value.trim() || 'N/A'}, ${custCountry?.value.trim() || 'N/A'}`;
  const lines = [];
  lines.push('*New Restaurant Order Confirmed!*');
  lines.push('*Customer Details:*');
  lines.push(`*Phone:* ${phone}`);
  lines.push(`*WhatsApp:* ${wapp}`);
  lines.push(`*Address:* ${address}`);
  lines.push('*Ordered Items:*');
  lines.push(itemLines || 'None');
  lines.push('*Order Checklist & Billing:*');
  lines.push(`*Payment Method:* ${paymentMethod}`);
  lines.push(`*Payment Status:* ${paymentStatus}`);
  lines.push(`*Subtotal:* ${formatCurrency(subtotal)}`);
  lines.push(`*VAT:* ${formatCurrency(tax)}`);
  lines.push(`*Total Bill:* ${formatCurrency(subtotal + tax)}`);
  return encodeURIComponent(lines.join('%0A'));
}
async function finalizeOrder() {
  const paymentMethod = paymentOptionOnline?.checked ? 'Online Payment' : 'Hand Cash';
  let paymentStatus = 'Cash on Delivery';
  if (paymentMethod === 'Online Payment') {
    const paymentSuccess = await simulateOnlinePayment();
    if (!paymentSuccess) {
      alert('Online payment was not completed. Please try again or choose Hand Cash.');
      return;
    }
    paymentStatus = 'Paid';
  }
  const msg = buildOrderMessage(paymentMethod, paymentStatus);
  window.open(`https://wa.me/${WEBSITE_CONFIG.whatsappNumber}?text=${msg}`, '_blank');
  closeOrderModal();
}

function initializeCartButtons() {
  const categoryButtons = document.querySelectorAll('.category-button');
  categoryButtons.forEach(button => button.addEventListener('click', filterMenu));
  const openCartButtons = document.querySelectorAll('[data-open-cart]');
  openCartButtons.forEach(btn => btn.addEventListener('click', openCart));
  closeCart?.addEventListener('click', closeCartDrawer);
  cartBackdrop?.addEventListener('click', closeCartDrawer);
  // Replace previous separate checkout buttons with unified Order Now flow
  orderNowButton?.addEventListener('click', openOrderModal);
  orderModalClose?.addEventListener('click', closeOrderModal);
  // close when clicking outside the modal content
  orderModalBackdrop?.addEventListener('click', closeOrderModal);
  proceedToPayment?.addEventListener('click', showPaymentStep);
  backToDetails?.addEventListener('click', showDetailsStep);
  confirmOrder?.addEventListener('click', finalizeOrder);
}
function initializeReservation() {
  if (!bookingForm) return;
  openSeatModal?.addEventListener('click', openSeatSelection);
  closeSeatModal?.addEventListener('click', closeSeatSelection);
  seatButtons.forEach(button => button.addEventListener('click', () => {
    selectedSeatLabel.innerHTML = `Selected zone: <span class="font-semibold">${button.dataset.seat}</span>`;
    bookingForm.dataset.seating = button.dataset.seat;
    seatButtons.forEach(btn => btn.classList.remove('border-amber-500', 'bg-amber-500/10'));
    button.classList.add('border-amber-500', 'bg-amber-500/10');
    closeSeatSelection();
  }));
  bookingForm.addEventListener('submit', event => {
    event.preventDefault();

    const name = customerNameInput?.value.trim() || 'N/A';
    const phone = customerPhoneInput?.value.trim() || 'N/A';
    const bookingDateTime = bookingDateTimeInput?.value.trim() || 'N/A';
    const seatingPreference = bookingForm.dataset.seating || 'None';

    const message = `Hello GustoOro,\nI would like to book a table.\nName: ${name}\nPhone: ${phone}\nDate & Time: ${bookingDateTime}\nSeating preference: ${seatingPreference}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WA_PHONE}?text=${encodedMessage}`, '_blank');

    flashReservationSuccess();
    bookingForm.reset();
    selectedSeatLabel.innerHTML = 'Selected zone: <span class="font-semibold">None</span>';
    bookingForm.dataset.seating = '';
  });
}
function initializeNavigation() {
  themeToggle?.addEventListener('click', toggleTheme);
  mobileMenuButton?.addEventListener('click', toggleMobileMenu);
  document.addEventListener('click', event => {
    if (!mobileMenu?.contains(event.target) && !mobileMenuButton?.contains(event.target) && !mobileMenu?.classList.contains('hidden')) {
      if (!event.target.closest('#mobileMenu')) {
        mobileMenu?.classList.add('hidden');
      }
    }
  });
}
function initializeTestimonials() {
  if (!testimonialSlides.length || !testimonialDots.length) return;
  showTestimonial(0);
  testimonialDots.forEach(dot => dot.addEventListener('click', () => {
    const index = Number(dot.dataset.index);
    showTestimonial(index);
    clearInterval(testimonialInterval);
    testimonialInterval = testimonialTimer();
  }));
  testimonialInterval = testimonialTimer();
}
function initializePage() {
  initializeTheme();
  initializeNavigation();
  initializeTestimonials();
  initializeCartButtons();
  initializeReservation();
  loadMenuItems();
  renderCart();
}
initializePage();
