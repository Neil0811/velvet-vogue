// public/js/scripts.js

// Include the Supabase JS library in your HTML before this script:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js/dist/umd/supabase.min.js"></script>

// Initialize Supabase client
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 1) Your product catalog
const products = [
  { id: 1, name: "Elegant Sporty T-Shirt", price: 89.99, image: "assets/images/product1.jpg", description: "This premium blazer is crafted with fine wool blend, tailored for modern comfort and elegance.", sizes: ["S", "M", "L", "XL"], colors: ["Black", "Navy Blue", "Grey"] },
  { id: 2, name: "Classic plain commfy T-Shirt", price: 69.99, image: "assets/images/product2.jpg", description: "A timeless denim jacket with a comfortable fit and durable stitching.", sizes: ["S", "M", "L", "XL"], colors: ["Blue", "Black"] },
  { id: 3, name: "Stylish Running T-Shirt", price: 129.99, image: "assets/images/product3.jpg", description: "Genuine leather jacket with a sleek silhouette and modern hardware.", sizes: ["S", "M", "L", "XL"], colors: ["Brown", "Black"] },
  { id: 4, name: "Born to Run Jogging T-Shirt", price: 49.99, image: "assets/images/product4.jpg", description: "Soft, cozy hoodie made from organic cotton with a relaxed fit.", sizes: ["S", "M", "L", "XL"], colors: ["Grey", "Black", "Navy"] }
];

// 2) Cart helpers
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function addToCart(prod, size, color, qty) {
  const cart = getCart();
  const existing = cart.find(i => i.id === prod.id && i.size === size && i.color === color);
  if (existing) existing.quantity += qty;
  else cart.push({ id: prod.id, name: prod.name, price: prod.price, size, color, quantity: qty });
  saveCart(cart);
}

// 3) Render Functions
function renderFeatured() { /* unchanged */ }
function renderProducts() { /* unchanged */ }
function renderDetail() { /* unchanged */ }
function renderCart() { /* unchanged */ }
function updateTotal() { /* unchanged */ }

// 4) DOM Ready: initialize everything
document.addEventListener('DOMContentLoaded', () => {
  console.log('Velvet Vogue initialized.');

  // Product UI
  if (document.getElementById('featured-row'))  renderFeatured();
  if (document.getElementById('product-list'))  renderProducts();
  if (document.getElementById('product-detail')) renderDetail();
  if (document.getElementById('cart-items'))    renderCart();

  // LOGIN via Supabase
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email    = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else {
        alert(`Welcome back, ${data.user.user_metadata.full_name || data.user.email}!`);
        // Optional: redirect or update UI
      }
    });
  }

  // SIGN UP via Supabase
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async e => {
      e.preventDefault();
      const name     = document.getElementById('signupName').value;
      const email    = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });
      if (error) alert(error.message);
      else {
        alert('Signup successful! Please check your email to confirm your account.');
        signupForm.reset();
      }
    });
  }

  // INQUIRY remains unchanged
  const inquiryForm = document.getElementById('inquiryForm');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', async e => {
      e.preventDefault();
      const name    = document.getElementById('inquiryName').value;
      const email   = document.getElementById('inquiryEmail').value;
      const message = document.getElementById('inquiryMessage').value;
      const res = await fetch('/send-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      const result = await res.json();
      alert(result.success ? 'Message sent successfully!' : 'Failed to send message.');
      if (result.success) inquiryForm.reset();
    });
  }
});
