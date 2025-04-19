// public/js/scripts.js

// 1) Your product catalog
const products = [
    {
      id: 1,
      name: "Elegant Sporty T-Shirt",
      price: 89.99,
      image: "assets/images/product1.jpg",
      description:
        "This premium blazer is crafted with fine wool blend, tailored for modern comfort and elegance.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Navy Blue", "Grey"]
    },
    {
      id: 2,
      name: "Classic plain commfy T-Shirt",
      price: 69.99,
      image: "assets/images/product2.jpg",
      description: "A timeless denim jacket with a comfortable fit and durable stitching.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Blue", "Black"]
    },
    {
      id: 3,
      name: "Stylish Running T-Shirt",
      price: 129.99,
      image: "assets/images/product3.jpg",
      description: "Genuine leather jacket with a sleek silhouette and modern hardware.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Brown", "Black"]
    },
    {
      id: 4,
      name: "Born to Run Jogging T-Shirt",
      price: 49.99,
      image: "assets/images/product4.jpg",
      description: "Soft, cozy hoodie made from organic cotton with a relaxed fit.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Grey", "Black", "Navy"]
    }
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
  
  // 3) Render Featured (on index.html)
  function renderFeatured() {
    const row = document.getElementById("featured-row");
    if (!row) return;
    row.innerHTML = ""; // clear any old content
    products.slice(0, 3).forEach((p) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";
      col.innerHTML = `
        <div class="card h-100">
          <img src="${p.image}" class="card-img-top product-image" alt="${p.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text">$${p.price.toFixed(2)}</p>
            <a href="product-detail.html?id=${p.id}" class="btn btn-primary mt-auto">View Details</a>
          </div>
        </div>
      `;
      row.appendChild(col);
    });
  }
  
  // 4) Render All Products (2 per row)
  function renderProducts() {
    const row = document.getElementById("product-list");
    if (!row) return;
    row.innerHTML = ""; // clear old cards
    products.forEach((p) => {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 mb-4"; 
      col.innerHTML = `
        <div class="card h-100">
          <img src="${p.image}" class="card-img-top product-image" alt="${p.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-price">$${p.price.toFixed(2)}</p>
            <a href="product-detail.html?id=${p.id}" class="btn btn-primary mt-auto">View Details</a>
          </div>
        </div>
      `;
      row.appendChild(col);
    });
  }
  
  // 5) Render Product Detail
  function renderDetail() {
    const container = document.getElementById("product-detail");
    if (!container) return;
  
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"), 10);
    const p = products.find((x) => x.id === id);
    if (!p) {
      container.innerHTML = "<p>Product not found.</p>";
      return;
    }
  
    container.innerHTML = `
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
      </div>
    `;
  
    document.getElementById("addForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const size = document.getElementById("sizeSelect").value;
      const color = document.getElementById("colorSelect").value;
      const qty = parseInt(document.getElementById("qtySelect").value, 10);
      addToCart(p, size, color, qty);
      window.location.href = "cart.html";
    });
  }
  
  // 6) Render Cart
  function renderCart() {
    const cart = getCart();
    const container = document.getElementById("cart-items");
    if (!container) return;
  
    if (cart.length === 0) {
      container.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }
  
    container.innerHTML = cart
      .map(
        (item, i) => `
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
      </div>`
      )
      .join("");
  
    updateTotal();
  
    container.addEventListener("click", (e) => {
      if (e.target.matches(".remove")) {
        const i = e.target.dataset.i;
        cart.splice(i, 1);
        saveCart(cart);
        renderCart(); // re-render
      }
    });
  
    container.addEventListener("change", (e) => {
      if (e.target.matches(".qty")) {
        const i = e.target.dataset.i;
        const v = parseInt(e.target.value, 10);
        if (v > 0) {
          cart[i].quantity = v;
          saveCart(cart);
          updateTotal();
        }
      }
    });
  }
  
  // 7) Update cart total
  function updateTotal() {
    const total = getCart().reduce((sum, x) => sum + x.price * x.quantity, 0);
    const el = document.getElementById("cart-total");
    if (el) el.textContent = total.toFixed(2);
  }
  document.addEventListener("DOMContentLoaded", function () {
    console.log("Velvet Vogue website loaded.");
  
    document.addEventListener("DOMContentLoaded", function () {
        console.log("Velvet Vogue website loaded.");
      
        // LOGIN
        const loginForm = document.getElementById("loginForm");
        if (loginForm) {
          loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
      
            const res = await fetch("/api/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password })
            });
      
            const data = await res.json();
            if (data.success) {
              alert(`Welcome, ${data.name}!`);
            } else {
              alert(data.message || "Login failed.");
            }
          });
        }
      
        // SIGN UP
        const signupForm = document.getElementById("signupForm");
        if (signupForm) {
          signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("signupName").value;
            const email = document.getElementById("signupEmail").value;
            const password = document.getElementById("signupPassword").value;
      
            const res = await fetch("/api/signup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, email, password })
            });
      
            const data = await res.json();
            if (data.success) {
              alert("Account created! Please log in.");
              signupForm.reset();
              document.querySelector("#login-tab").click();
            } else {
              alert(data.message || "Sign up failed.");
            }
          });
        }
      
        // INQUIRY
        const inquiryForm = document.getElementById("inquiryForm");
        if (inquiryForm) {
          inquiryForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("inquiryName").value;
            const email = document.getElementById("inquiryEmail").value;
            const message = document.getElementById("inquiryMessage").value;
      
            const res = await fetch("/send-inquiry", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, email, message })
            });
      
            const data = await res.json();
            if (data.success) {
              alert("Message sent successfully!");
              inquiryForm.reset();
            } else {
              alert("Failed to send message.");
            }
          });
        }
      });
      
  });
  
  // 8) Initialize on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("featured-row")) renderFeatured();
    if (document.getElementById("product-list")) renderProducts();
    if (document.getElementById("product-detail")) renderDetail();
    if (document.getElementById("cart-items")) renderCart();

    document.getElementById("inquiryForm").addEventListener("submit", async (e) => {
        e.preventDefault();
      
        const name = document.getElementById("inquiryName").value;
        const email = document.getElementById("inquiryEmail").value;
        const message = document.getElementById("inquiryMessage").value;
      
        const res = await fetch('/send-inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message })
        });
      
        const data = await res.json();
        if (data.success) {
          alert("Message sent successfully!");
          e.target.reset();
        } else {
          alert("Failed to send message.");
        }
      });
      
  });
  