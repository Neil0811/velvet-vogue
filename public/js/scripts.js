// scripts.js

// -- 1) Static product data
const products = [
    {
      id: 1,
      name: "Elegant Blazer",
      price: 89.99,
      image: "assets/images/product1.jpg",
      description:
        "This premium blazer is crafted with fine wool blend, tailored for modern comfort and elegance.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Navy Blue", "Grey"]
    },
    {
      id: 2,
      name: "Classic Denim Jacket",
      price: 69.99,
      image: "assets/images/product2.jpg",
      description:
        "A timeless denim jacket with a comfortable fit and durable stitching.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Blue", "Black"]
    },
    {
      id: 3,
      name: "Stylish Leather Jacket",
      price: 129.99,
      image: "assets/images/product3.jpg",
      description:
        "Genuine leather jacket with a sleek silhouette and modern hardware.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Brown", "Black"]
    },
    {
      id: 4,
      name: "Comfort Hoodie",
      price: 49.99,
      image: "assets/images/product4.jpg",
      description:
        "Soft, cozy hoodie made from organic cotton with a relaxed fit.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Grey", "Black", "Navy"]
    }
  ];
  
  // -- 2) Cart helpers (localStorage)
  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  function addToCart(prod, size, color, qty) {
    const cart = getCart();
    const existing = cart.find(
      (i) => i.id === prod.id && i.size === size && i.color === color
    );
    if (existing) existing.quantity += qty;
    else
      cart.push({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        size,
        color,
        quantity: qty
      });
    saveCart(cart);
  }
  
  // -- 3) Render Featured (on index.html)
  function renderFeatured() {
    const row = document.getElementById("featured-row");
    products.slice(0, 3).forEach((p) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";
      col.innerHTML = `
        <div class="card h-100">
          <img src="${p.image}" class="card-img-top" alt="${p.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text">$${p.price.toFixed(2)}</p>
            <a href="product-detail.html?id=${p.id}" class="btn btn-primary mt-auto">View Details</a>
          </div>
        </div>`;
      row.appendChild(col);
    });
  }
  
  // -- 4) Render All Products (on products.html)
  function renderProducts() {
    const row = document.getElementById("product-list");
    products.forEach((p) => {
      const col = document.createElement("div");
      col.className = "col-md-3 mb-4";
      col.innerHTML = `
        <div class="card h-100">
          <img src="${p.image}" class="card-img-top" alt="${p.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text">$${p.price.toFixed(2)}</p>
            <a href="product-detail.html?id=${p.id}" class="btn btn-primary mt-auto">View Details</a>
          </div>
        </div>`;
      row.appendChild(col);
    });
  }
  
  // -- 5) Render Detail (on product-detail.html)
  function renderDetail() {
    const params = new URLSearchParams(location.search);
    const id = +params.get("id");
    const p = products.find((x) => x.id === id);
    const c = document.getElementById("product-detail");
    if (!p) return (c.innerHTML = "<p>Product not found.</p>");
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
              <select id="sizeSelect" class="form-control">
                ${p.sizes.map((s) => `<option>${s}</option>`).join("")}
              </select>
            </div>
            <div class="form-group">
              <label>Color</label>
              <select id="colorSelect" class="form-control">
                ${p.colors.map((c) => `<option>${c}</option>`).join("")}
              </select>
            </div>
            <div class="form-group">
              <label>Quantity</label>
              <input id="qtySelect" type="number" class="form-control" value="1" min="1">
            </div>
            <button class="btn btn-success">Add to Cart</button>
          </form>
        </div>
      </div>`;
    document.getElementById("addForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const size = document.getElementById("sizeSelect").value;
      const color = document.getElementById("colorSelect").value;
      const qty = +document.getElementById("qtySelect").value;
      addToCart(p, size, color, qty);
      location.href = "cart.html";
    });
  }
  
  // -- 6) Render Cart (on cart.html)
  function renderCart() {
    const cart = getCart();
    const container = document.getElementById("cart-items");
    if (cart.length === 0)
      return (container.innerHTML = "<p>Your cart is empty.</p>");
    cart.forEach((item, i) => {
      const row = document.createElement("div");
      row.className =
        "cart-item d-flex justify-content-between align-items-center border-bottom py-2";
      row.innerHTML = `
        <div>
          <h5>${item.name}</h5>
          <p>Size: ${item.size}, Color: ${item.color}</p>
          <p>$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <div>
          <input data-i="${i}" type="number" class="form-control d-inline-block input-small qty" value="${item.quantity}" min="1">
          <button data-i="${i}" class="btn btn-danger remove">Remove</button>
        </div>`;
      container.appendChild(row);
    });
    updateTotal();
    // handlers
    container.addEventListener("click", (e) => {
      if (e.target.matches(".remove")) {
        const i = e.target.dataset.i;
        cart.splice(i, 1);
        saveCart(cart);
        location.reload();
      }
    });
    container.addEventListener("change", (e) => {
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
    document.getElementById("cart-total").textContent = total.toFixed(2);
  }
  
  // -- 7) Init on DOM load
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("featured-row")) renderFeatured();
    if (document.getElementById("product-list")) renderProducts();
    if (document.getElementById("product-detail")) renderDetail();
    if (document.getElementById("cart-items")) renderCart();
  });
  