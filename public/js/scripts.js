// scripts.js

const products = [
    {
      id: 1,
      name: "Elegant Blazer",
      price: 89.99,
      image: "assets/images/product1.jpg",
      description: "This premium blazer is crafted with fine wool blend, tailored for modern comfort and elegance.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Navy Blue", "Grey"]
    },
    {
      id: 2,
      name: "Classic Denim Jacket",
      price: 69.99,
      image: "assets/images/product2.jpg",
      description: "A timeless denim jacket with a comfortable fit and durable stitching.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Blue", "Black"]
    },
    {
      id: 3,
      name: "Stylish Leather Jacket",
      price: 129.99,
      image: "assets/images/product3.jpg",
      description: "Genuine leather jacket with a sleek silhouette and modern hardware.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Brown", "Black"]
    },
    {
      id: 4,
      name: "Comfort Hoodie",
      price: 49.99,
      image: "assets/images/product4.jpg",
      description: "Soft, cozy hoodie made from organic cotton with a relaxed fit.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Grey", "Black", "Navy"]
    }
  ];
  
  // Cart helpers
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
  
  // Render products
  function renderFeatured() {
    const row = document.getElementById("featured-row");
    if (!row) return;
    products.slice(0, 3).forEach(p => {
      row.innerHTML += `
        <div class="col-md-4">
          <div class="card h-100">
            <img src="${p.image}" class="card-img-top" alt="${p.name}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${p.name}</h5>
              <p class="card-text">$${p.price.toFixed(2)}</p>
              <a href="product-detail.html?id=${p.id}" class="btn btn-primary mt-auto">View Details</a>
            </div>
          </div>
        </div>
      `;
    });
  }
  
  function renderProducts() {
    const row = document.getElementById("product-list");
    if (!row) return;
    products.forEach(p => {
      row.innerHTML += `
        <div class="col-md-3">
          <div class="card h-100">
            <img src="${p.image}" class="card-img-top" alt="${p.name}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${p.name}</h5>
              <p class="card-text">$${p.price.toFixed(2)}</p>
              <a href="product-detail.html?id=${p.id}" class="btn btn-primary mt-auto">View Details</a>
            </div>
          </div>
        </div>
      `;
    });
  }
  
  function renderDetail() {
    const params = new URLSearchParams(location.search);
    const id = +params.get("id");
    const p = products.find(x => x.id === id);
    const c = document.getElementById("product-detail");
    if (!p || !c) return;
  
    c.innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <img src="${p.image}" class="img-fluid" alt="${p.name}">
        </div>
        <div class="col-md-6">
          <h2>${p.name}</h2>
          <p><strong>Price:</strong> $${p.price.toFixed(2)}</p>
          <p>${p.description}</p>
          <form id="addForm">
            <div class="form-group">
              <label>Size</label>
              <select id="sizeSelect" class="form-control">${p.sizes.map(s => `<option>${s}</option>`).join("")}</select>
            </div>
            <div class="form-group">
              <label>Color</label>
              <select id="colorSelect" class="form-control">${p.colors.map(c => `<option>${c}</option>`).join("")}</select>
            </div>
            <div class="form-group">
              <label>Quantity</label>
              <input id="qtySelect" type="number" class="form-control" value="1" min="1">
            </div>
            <button class="btn btn-success">Add to Cart</button>
          </form>
        </div>
      </div>
    `;
    document.getElementById("addForm").addEventListener("submit", e => {
      e.preventDefault();
      const size = document.getElementById("sizeSelect").value;
      const color = document.getElementById("colorSelect").value;
      const qty = +document.getElementById("qtySelect").value;
      addToCart(p, size, color, qty);
      location.href = "cart.html";
    });
  }
  
  function renderCart() {
    const cart = getCart();
    const container = document.getElementById("cart-items");
    if (!container) return;
    if (cart.length === 0) {
      container.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }
    cart.forEach((item, i) => {
      container.innerHTML += `
        <div class="cart-item d-flex justify-content-between align-items-center border-bottom py-2">
          <div>
            <h5>${item.name}</h5>
            <p>Size: ${item.size}, Color: ${item.color}</p>
            <p>$${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <div>
            <input data-i="${i}" type="number" class="form-control d-inline-block input-small qty" value="${item.quantity}" min="1">
            <button data-i="${i}" class="btn btn-danger remove">Remove</button>
          </div>
        </div>
      `;
    });
    updateTotal();
    container.addEventListener("click", e => {
      if (e.target.matches(".remove")) {
        const i = e.target.dataset.i;
        cart.splice(i, 1);
        saveCart(cart);
        location.reload();
      }
    });
    container.addEventListener("change", e => {
      if (e.target.matches(".qty")) {
        const i = e.target.dataset.i;
        const v = +e.target.value;
        if (v > 0) {
          cart[i].quantity = v;
          saveCart(cart);
          updateTotal();
        }
      }
    });
  }
  
  function updateTotal() {
    const total = getCart().reduce((sum, x) => sum + x.price * x.quantity, 0);
    const el = document.getElementById("cart-total");
    if (el) el.textContent = total.toFixed(2);
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    renderFeatured();
    renderProducts();
    renderDetail();
    renderCart();
  });
  