const BASE_SERVER_URL = "https://papaya-backend-tn46.onrender.com";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function checkAdminAuth() {
  // List of pages that require admin access
  const adminPages = [
    "product-management.html",
    "add-product.html",
    "edit-product.html",
  ];

  // Get the current page filename
  const currentPage = window.location.pathname.split("/").pop();

  if (adminPages.includes(currentPage)) {
    const role = getCookie("papaya_role");

    if (role !== "admin") {
      alert("Unauthorized Access! Redirecting to login.");
      window.location.href = "login.html";
    }
  }
}

function updateAuthUI() {
  const role = getCookie("papaya_role");
  const username = getCookie("papaya_user");

  // If the user is recognized as an admin based on the cookie
  if (role === "admin") {
    // 1. If they try to go to the login page, redirect them to the panel immediately
    if (window.location.pathname.includes("login.html")) {
      window.location.href = "product-management.html";
      return;
    }

    // 2. Find all "log in" links on the current page and change them to "Admin Panel"
    document.querySelectorAll('a[href="login.html"]').forEach((link) => {
      link.href = "product-management.html";
      link.innerHTML = `<i class="bi bi-person-check-fill me-1"></i>${username} Panel`;
      link.classList.replace("btn-outline-dark", "btn-dark"); // Highlight it
    });

    // 3. Create a Logout button and place it in the top navigation bar
    const topbarDiv = document.querySelector(
      ".papaya-topbar .d-flex.align-items-center.gap-2",
    );
    if (topbarDiv && !document.getElementById("logoutBtn")) {
      const logoutBtn = document.createElement("button");
      logoutBtn.id = "logoutBtn";
      logoutBtn.className = "btn btn-outline-danger btn-sm rounded-pill px-3";
      logoutBtn.innerHTML = `<i class="bi bi-box-arrow-right"></i>`;
      logoutBtn.title = "Logout";
      logoutBtn.onclick = logoutAdmin;

      // Insert it right before the shopping cart icon
      const cartIcon = topbarDiv.querySelector('a[href="cart.html"]');
      topbarDiv.insertBefore(logoutBtn, cartIcon);
    }
  }
}

function logoutAdmin() {
  // Erase the cookies by setting their max-age to 0
  document.cookie = "papaya_user=; max-age=0; path=/";
  document.cookie = "papaya_role=; max-age=0; path=/";

  alert("Logged out successfully.");
  window.location.href = "index.html"; // Send them back to the public home page
}

// ------------------------ index.html --------------------------
function createProductCard(product) {
  const div = document.createElement("div");
  div.className = "col-6 col-md-3";

  const article = document.createElement("article");
  article.className = "product-card card border-0 bg-light rounded-4 p-2";
  article.setAttribute(
    "onclick",
    `location.href='detail.html?id=${product.id}'`,
  );
  article.setAttribute("tabindex", "0");
  article.setAttribute("role", "button");

  const img = document.createElement("img");
  img.src = `https://res.cloudinary.com/dctylcksu/image/upload/q_auto/f_auto/v1777085932/${product.image_url}`;
  img.alt = `${product.name} ${product.brand} ${product.category}`;
  img.className = "product-card-img rounded-3 bg-white";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body px-1 pb-1 pt-2";
  const p = document.createElement("p");
  p.className = "mb-1";
  p.style.fontSize = ".85rem";
  p.style.fontWeight = "600";
  p.textContent = product.name;

  const price = document.createElement("span");
  price.className = "text-price fw-bold";
  price.textContent = "$" + product.price;

  cardBody.appendChild(p);
  cardBody.appendChild(price);
  article.appendChild(img);
  article.appendChild(cardBody);
  div.appendChild(article);

  return div;
}

async function loadExclusiveProduct() {
  fetch(`${BASE_SERVER_URL}/api/exclusive/products`)
    .then((res) => res.json())
    .then((result) => {
      result.forEach((r) => {
        document
          .getElementById("product-container")
          .appendChild(createProductCard(r));
      });
    })
    .catch((err) => console.log(err));
}

// ------------------------ add-product.html --------------------------
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addProductForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const errorDiv = document.getElementById("addError");
      errorDiv.classList.add("d-none");

      // --------- basic fields ----------
      const name = document.getElementById("add-name").value.trim();
      const brand = document.getElementById("add-brand").value;
      const category = document.getElementById("add-category").value.trim();
      const price = parseFloat(document.getElementById("add-price").value) || 0;
      const stock = parseInt(document.getElementById("add-stock").value) || 0;

      if (price < 0) {
        errorDiv.textContent = "Price cannot be a negative number!";
        errorDiv.classList.remove("d-none");
        return; // Stop the function
      }
      if (stock < 0) {
        errorDiv.textContent = "Stock quantity cannot be a negative number!";
        errorDiv.classList.remove("d-none");
        return; // Stop the function
      }

      // --------- extract specs ----------
      const specRows = document.querySelectorAll(".spec-row");

      const description = {};

      specRows.forEach((row) => {
        const key = row.querySelector(".spec-key").value.trim();
        const value = row.querySelector(".spec-value").value.trim();

        if (key && value) {
          description[key] = value;
        }
      });

      // --------- image upload ----------
      const fileInput = document.getElementById("add-image");
      const file = fileInput.files[0];

      let imageUrl = "";

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Uploading...';

        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "papaya_products");

          const res = await fetch(
            "https://api.cloudinary.com/v1_1/dctylcksu/upload",
            { method: "POST", body: formData },
          );

          const data = await res.json();
          imageUrl = `${data.public_id}.${data.format}`;
        }

        // --------- final product object ----------
        const product = {
          name,
          brand,
          category,
          price,
          stock_quantity: stock,
          description,
          image_url: imageUrl,
        };

        // --------- send to backend ----------
        const response = await fetch(`${BASE_SERVER_URL}/api/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to add product");
        }

        alert("Product added successfully!");
        form.reset();

        // optional: clear specs UI
        document.getElementById("spec-container").innerHTML = "";

        // clear image input
        document.getElementById("add-image").value = "";

        // clear preview
        const preview = document.getElementById("addImgPreview");
        preview.src = "";
        preview.classList.add("d-none");

        // reset file label
        document.getElementById("file-label").textContent = "file.png";
      } catch (err) {
        console.error(err);
        errorDiv.textContent = "Something went wrong";
        errorDiv.classList.remove("d-none");
      } finally {
        // This runs whether it succeeds or fails, so the button never gets stuck!
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("spec-container");
  const addBtn = document.getElementById("add-spec-btn");

  // Add new spec row
  function addSpecRow(key = "", value = "") {
    const row = document.createElement("div");
    row.className = "row g-2 mb-2 spec-row align-items-center";

    row.innerHTML = `
        <div class="col-5">
          <input type="text" class="form-control spec-key" placeholder="storage" value="${key}">
        </div>

        <div class="col-5">
          <input type="text" class="form-control spec-value" placeholder="1TB" value="${value}">
        </div>

        <div class="col-2 d-flex justify-content-center">
          <button type="button" class="btn btn-sm btn-outline-danger remove-spec">
            x
          </button>
        </div>
      `;

    // remove button
    row.querySelector(".remove-spec").addEventListener("click", () => {
      row.remove();
    });

    container.appendChild(row);
  }

  // Add first row by default
  addSpecRow();

  // Add button click
  addBtn.addEventListener("click", () => addSpecRow());

  // Extract specs into object (use this in your submit handler)
  window.getSpecs = function () {
    const specs = {};
    const rows = document.querySelectorAll(".spec-row");

    rows.forEach((row) => {
      const key = row.querySelector(".spec-key").value.trim();
      const value = row.querySelector(".spec-value").value.trim();

      if (key && value) {
        specs[key] = value;
      }
    });

    return specs;
  };
});

// ------------------------ Public API : newsapi.org --------------------------
async function loadCarouselNews() {
  try {
    const res = await fetch(`${BASE_SERVER_URL}/api/news`);
    const data = await res.json();

    const carouselInner = document.getElementById("carousel-inner");

    carouselInner.innerHTML = "";

    data.articles.slice(0, 5).forEach((article, index) => {
      const item = document.createElement("div");

      item.className = `carousel-item ${index === 0 ? "active" : ""}`;

      item.innerHTML = `
        <img 
          src="${article.urlToImage || "https://via.placeholder.com/1200x400"}" 
          class="d-block w-100"
          style="height: 450px; object-fit: cover;"
          alt="news image"
        >

        <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
          <h5>${article.title}</h5>
          <p>${article.description ? article.description.slice(0, 120) + "..." : ""}</p>
          <a href="${article.url}" target="_blank" class="btn btn-sm btn-primary">
            Read More
          </a>
        </div>
      `;

      carouselInner.appendChild(item);
    });
  } catch (err) {
    console.error("Carousel error:", err);
  }
}

loadExclusiveProduct();
loadCarouselNews(); // Do comment when developing, so it not waste the public request :>

// ------------------------ products.html --------------------------
async function loadAllProducts() {
  const container = document.getElementById("all-products-container");
  if (!container) return; // Only run if we are on the products.html page

  try {
    const res = await fetch(`${BASE_SERVER_URL}/api/products`);
    if (!res.ok) throw new Error("Failed to fetch products");

    const products = await res.json();
    container.innerHTML = ""; // Clear the loading spinner

    // 1. Group the products by their category
    const categories = {};
    products.forEach((p) => {
      const cat = p.category || "Other";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(p);
    });

    // 2. Loop through each category and build a section
    Object.keys(categories).forEach((cat) => {
      // Create the section wrapper
      const section = document.createElement("section");
      section.className = "mb-5 fade-in";

      // Add the Category Title
      section.innerHTML = `
        <h3 class="fw-bold mb-3 text-capitalize" style="font-size:1.1rem">${cat}s</h3>
        <div class="row g-3 product-row"></div>
      `;

      const row = section.querySelector(".product-row");

      // Loop through the products in this category and draw the cards
      categories[cat].forEach((p) => {
        row.appendChild(createProductCard(p));
      });

      // Add the finished section to the page
      container.appendChild(section);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = `<div class="text-danger text-center py-5">Failed to load products. Make sure your server is running!</div>`;
  }
}

// ------------------------ detail.html --------------------------
async function loadProductDetail() {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return;

  try {
    const res = await fetch(`${BASE_SERVER_URL}/api/products/${id}`);
    if (!res.ok) {
      location.href = "notfound.html";
      return;
    }

    const p = await res.json();

    // 1. Update the Main Text & Price
    document.getElementById("productName").textContent = p.name;
    document.getElementById("productPrice").textContent =
      "$" + Number(p.price).toLocaleString();
    document.title = `Papaya - ${p.name}`;

    // 2. Hide the mock "Old Price" and "Save" elements since your DB doesn't use them
    const oldPriceEl = document.getElementById("productOldPrice");
    const saveEl = document.getElementById("productSave");
    if (oldPriceEl) oldPriceEl.style.display = "none";
    if (saveEl) saveEl.style.display = "none";

    // --- NEW: Stock Management ---
    const stockEl = document.getElementById("productStock");
    // Target the add to cart button using its onclick attribute
    const addToCartBtn = document.querySelector(
      'button[onclick="addToCart()"]',
    );
    const qtyControl = document.querySelector(".qty-control");

    if (stockEl) {
      if (p.stock_quantity > 0) {
        stockEl.textContent = `In Stock: ${p.stock_quantity}`;
        stockEl.classList.add("text-success"); // Make it green

        if (addToCartBtn) {
          addToCartBtn.disabled = false;
        }
      } else {
        stockEl.textContent = "Out of Stock";
        stockEl.classList.add("text-danger"); // Make it red

        if (addToCartBtn) {
          addToCartBtn.disabled = true;
          // Change the appearance to look disabled
          addToCartBtn.classList.replace("btn-dark", "btn-secondary");
          addToCartBtn.innerHTML =
            '<i class="bi bi-x-circle me-2"></i>OUT OF STOCK';
        }

        // Optional: Fade out the quantity selector so they know they can't use it
        if (qtyControl) qtyControl.style.opacity = "0.5";
      }
    }
    // -----------------------------

    // 3. Update the Main Image
    const fullImageUrl = `https://res.cloudinary.com/dctylcksu/image/upload/q_auto/f_auto/v1777085932/${p.image_url}`;
    document.getElementById("mainImage").src = fullImageUrl;

    // 4. Handle the mock Thumbnails
    const thumbnails = document.querySelectorAll(".col-4 img");
    thumbnails.forEach((img) => {
      img.src = fullImageUrl;
    });

    // 5. Build the Specifications Table dynamically from your JSON column
    const desc =
      typeof p.description === "string"
        ? JSON.parse(p.description)
        : p.description;
    const tbody = document.querySelector(".spec-table tbody");
    tbody.innerHTML = ""; // Clears out the hardcoded specs

    // Let's add the Brand and Category from your DB first!
    tbody.innerHTML += `<tr><td class="fw-bold">Brand</td><td>${p.brand}</td></tr>`;
    tbody.innerHTML += `<tr><td class="fw-bold">Category</td><td>${p.category}</td></tr>`;

    // Loop through the JSON description object
    Object.entries(desc).forEach(([key, val]) => {
      // Capitalize the key and remove underscores
      const cleanKey =
        key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");

      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${cleanKey}</td><td>${val}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading product details:", err);
  }
}

// ------------------------ search.html --------------------------
async function loadSearchCategories() {
  const categorySelect = document.getElementById("search-category");
  if (!categorySelect) return; // Only run if we are on the search page

  try {
    const res = await fetch(`${BASE_SERVER_URL}/api/categories`);
    if (!res.ok) throw new Error("Failed to load categories");

    const categories = await res.json();

    // Loop through the database categories and create an <option> for each
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat; // This will send the exact DB value (e.g., "Phone") to the search API
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading categories:", err);
  }
}

// #region ------------------------ cart.html --------------------------
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}
function updateCartBadge() {
  const count = getCart().reduce((sum, i) => sum + i.qty, 0);
  document
    .querySelectorAll("#cartCount")
    .forEach((el) => (el.textContent = count));
}

function addToCart() {
  const id = new URLSearchParams(location.search).get("id");
  const name = document.getElementById("productName").textContent;

  // Extract ONLY numbers and decimals to prevent NaN errors
  const rawPriceStr = document.getElementById("productPrice").textContent;
  const price = parseFloat(rawPriceStr.replace(/[^0-9.]/g, "")) || 0;

  const qty = parseInt(document.querySelector(".qty-val").value) || 1;
  const img = document.getElementById("mainImage").src;

  const cart = getCart();
  const existing = cart.find((i) => i.id === id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, name, price, qty, img });
  }

  saveCart(cart);

  const msg = document.getElementById("cartSuccess");
  if (msg) {
    msg.classList.remove("d-none");
    setTimeout(() => msg.classList.add("d-none"), 2000);
  }
}

function renderCart() {
  const cart = getCart();
  const section = document.querySelector("section[aria-label='Cart items']");
  if (!section) return;

  section.innerHTML = "";
  cart.forEach((item) => {
    const article = document.createElement("article");
    article.className =
      "cart-item d-flex align-items-center gap-3 bg-light rounded-4 p-3 mb-3";
    article.dataset.price = item.price;
    article.dataset.id = item.id;
    article.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="cart-item-img bg-white"/>
      <div class="flex-grow-1">
        <p class="fw-bold mb-0">${item.name}</p>
      </div>
      <span class="text-price fw-bold me-2">${Number(item.price).toLocaleString()}</span>
      <div class="qty-control border rounded-pill overflow-hidden">
        <button class="qty-btn qty-minus">−</button>
        <input class="qty-val" type="number" value="${item.qty}" min="1" readonly/>
        <button class="qty-btn qty-plus">+</button>
      </div>
      <button class="btn btn-link text-muted p-0 ms-1" onclick="removeCartItem(this)" aria-label="Remove">
        <i class="bi bi-trash3"></i>
      </button>`;
    section.appendChild(article);
  });

  document.getElementById("cartItemCount").textContent = `(${cart.length})`;
  updateSummary();
  initQtyButtons();
}

function removeCartItem(btn) {
  const article = btn.closest("article");
  const id = article.dataset.id;
  const cart = getCart().filter((i) => i.id !== id);
  saveCart(cart);
  renderCart();
}

function updateSummary() {
  const cart = getCart();

  // Safely calculate the subtotal
  const subtotal = cart.reduce(
    (sum, i) => sum + (i.price || 0) * (i.qty || 1),
    0,
  );

  const discountEl = document.getElementById("cart-discount");
  const discount = parseInt(discountEl?.dataset?.discount || 0);

  // Null-checks prevent the script from crashing if an ID is missing in the HTML
  const subtotalEl = document.getElementById("cart-subtotal");
  const totalEl = document.getElementById("cart-total");

  if (subtotalEl) subtotalEl.textContent = subtotal.toLocaleString();
  if (totalEl) totalEl.textContent = (subtotal - discount).toLocaleString();
}

function applyCoupon() {
  const code = document
    .getElementById("couponInput")
    .value.trim()
    .toUpperCase();
  const msg = document.getElementById("couponMsg");
  const discountEl = document.getElementById("cart-discount");
  const COUPONS = { PAPAYA10: 100, SAVE500: 500 }; // example

  if (COUPONS[code]) {
    discountEl.textContent = COUPONS[code].toLocaleString();
    discountEl.dataset.discount = COUPONS[code];
    msg.textContent = `✓ Coupon applied! -${COUPONS[code]} ฿`;
    msg.className = "mb-2 small text-success";
  } else {
    msg.textContent = "Invalid coupon code";
    msg.className = "mb-2 small text-danger";
  }
  updateSummary();
}

async function checkout() {
  const cart = getCart();

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  try {
    // 1. Send the cart data to our new backend route
    const res = await fetch(`${BASE_SERVER_URL}/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart: cart }),
    });

    const data = await res.json();

    // 2. Check if the backend threw an error (like out-of-stock)
    if (!res.ok) {
      throw new Error(data.message || "Checkout failed");
    }

    // 3. If successful, clear the cart and redirect
    localStorage.removeItem("cart");
    updateCartBadge();

    alert("Order placed successfully! 🎉 Stock has been updated.");
    location.href = "index.html";
  } catch (err) {
    console.error(err);
    alert("Checkout failed: " + err.message);
  }
}

function initQtyButtons() {
  document.querySelectorAll(".cart-item").forEach((article) => {
    const minus = article.querySelector(".qty-minus");
    const plus = article.querySelector(".qty-plus");
    const input = article.querySelector(".qty-val");
    const id = article.dataset.id;

    plus.onclick = () => {
      input.value = +input.value + 1;
      updateCartQty(id, +input.value);
    };
    minus.onclick = () => {
      if (+input.value > 1) {
        input.value = +input.value - 1;
        updateCartQty(id, +input.value);
      }
    };
  });
}

function updateCartQty(id, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (item) item.qty = qty;
  saveCart(cart);
  updateSummary();
}

// #endregion

// #region ------------------------ Admin Management --------------------------
let productToDelete = null; // Global variable to hold the ID for the delete modal

async function loadAdminProducts() {
  const grid = document.getElementById("adminProductGrid");
  if (!grid) return;

  try {
    const res = await fetch(`${BASE_SERVER_URL}/api/products`);
    const products = await res.json();
    grid.innerHTML = "";

    products.forEach((p) => {
      const div = document.createElement("div");
      div.className = "col-6 col-md-3";
      div.innerHTML = `
        <article class="product-card card border-0 bg-light rounded-4 p-2 admin-card">
          <img src="https://res.cloudinary.com/dctylcksu/image/upload/q_auto/f_auto/v1777085932/${p.image_url}"
               alt="${p.name}" class="product-card-img rounded-3 bg-white" style="object-fit:contain;"/>
          <div class="card-body px-1 pb-1 pt-2">
            <p class="mb-1" style="font-size:.85rem;font-weight:600">${p.name}</p>
            <span class="text-price fw-bold">$${p.price}</span>
            <div class="text-muted small">Stock: ${p.stock_quantity}</div>
          </div>
          <div class="d-flex gap-2 justify-content-center pt-2 pb-1">
            <button class="btn btn-outline-primary btn-sm rounded-pill px-3" onclick="location.href='edit-product.html?id=${p.id}'">Edit</button>
            <button class="btn btn-outline-danger btn-sm rounded-pill px-3" onclick="triggerDeleteModal(${p.id}, '${p.name.replace(/'/g, "\\'")}')">Delete</button>
          </div>
        </article>
      `;
      grid.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<div class="text-danger text-center">Failed to load inventory.</div>`;
  }
}

// Opens the Bootstrap modal and sets the global variable
function triggerDeleteModal(id, name) {
  productToDelete = id;
  document.getElementById("deleteProductId").textContent = id;
  document.getElementById("deleteProductName").textContent = name;

  const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
  modal.show();
}

// Actually executes the delete fetch request
async function confirmDelete() {
  if (!productToDelete) return;

  // Find the button inside the modal
  const deleteBtn = document.querySelector('#deleteModal .btn-danger');
  const originalBtnText = deleteBtn.innerHTML;

  try {
    deleteBtn.disabled = true;
    deleteBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Deleting...';

    const res = await fetch(
      `${BASE_SERVER_URL}/api/products/${productToDelete}`,
      {
        method: "DELETE",
      },
    );

    if (!res.ok) throw new Error("Failed to delete product");

    alert("Product deleted successfully!");
    location.reload(); // Refresh the page to show updated list
  } catch (err) {
    console.error(err);
    alert("Error deleting product. It may be tied to existing orders.");

    // Unlock the button if it fails
    deleteBtn.disabled = false;
    deleteBtn.innerHTML = originalBtnText;
  }
}
// #endregion

// #region ------------------------ Edit Product --------------------------
async function loadEditForm() {
  const form = document.getElementById("editProductForm");
  if (!form) return;

  const id = new URLSearchParams(location.search).get("id");
  if (!id) {
    alert("No product ID provided!");
    location.href = "product-management.html";
    return;
  }

  // 1. Fetch existing data and pre-fill the form
  try {
    const res = await fetch(`${BASE_SERVER_URL}/api/products/${id}`);
    if (!res.ok) throw new Error(`Backend returned status: ${res.status}`);

    const p = await res.json();

    document.getElementById("edit-name").value = p.name;
    document.getElementById("edit-brand").value = p.brand;
    document.getElementById("edit-category").value = p.category;
    document.getElementById("edit-price").value = p.price;
    document.getElementById("edit-stock").value = p.stock_quantity;

    // Safely handle the description JSON
    let descObj = {};
    if (p.description) {
      descObj =
        typeof p.description === "string"
          ? JSON.parse(p.description)
          : p.description;
    }
    document.getElementById("edit-desc").value = JSON.stringify(
      descObj,
      null,
      2,
    );

    // Safely handle the image
    if (p.image_url) {
      const fullImageUrl = `https://res.cloudinary.com/dctylcksu/image/upload/q_auto/f_auto/v1777085932/${p.image_url}`;
      document.getElementById("editImgPreview").src = fullImageUrl;
      document.getElementById("editImgPreview").classList.remove("d-none");
      form.dataset.oldImage = p.image_url;
    } else {
      form.dataset.oldImage = "";
    }
  } catch (err) {
    console.error("Failed to load product details:", err);
    alert(
      "Failed to load product details. Check the browser console for errors.",
    );
  }

  // 2. Handle the Submit event
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const errorDiv = document.getElementById("editError");
    errorDiv.classList.add("d-none");

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Updating...';

      // FRONTEND VALIDATION
      const priceVal = parseFloat(document.getElementById("edit-price").value);
      const stockVal = parseInt(document.getElementById("edit-stock").value);

      if (isNaN(priceVal) || priceVal < 0)
        throw new Error("Price cannot be a negative number!");
      if (isNaN(stockVal) || stockVal < 0)
        throw new Error("Stock quantity cannot be a negative number!");

      // Parse the textarea string back into a JSON object
      let descriptionObj = {};
      try {
        const descText = document.getElementById("edit-desc").value;
        if (descText.trim() !== "") descriptionObj = JSON.parse(descText);
      } catch (e) {
        throw new Error(
          'Description must be valid JSON format (e.g., {"color": "red"})',
        );
      }

      let imageUrl = form.dataset.oldImage; // Default to old image
      const fileInput = document.getElementById("edit-image");
      const file = fileInput.files[0];

      // If they selected a new file, upload it
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "papaya_products");

        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/dctylcksu/upload",
          {
            method: "POST",
            body: formData,
          },
        );
        const uploadData = await uploadRes.json();
        imageUrl = `${uploadData.public_id}.${uploadData.format}`;
      }

      // Send the PUT request
      const productData = {
        name: document.getElementById("edit-name").value.trim(),
        brand: document.getElementById("edit-brand").value,
        category: document.getElementById("edit-category").value.trim(),
        price: priceVal,
        stock_quantity: stockVal,
        description: descriptionObj,
        image_url: imageUrl,
      };

      const updateRes = await fetch(`${BASE_SERVER_URL}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!updateRes.ok)
        throw new Error("Failed to update product on the server");

      alert("Product updated successfully!");
      location.href = "product-management.html";
    } catch (err) {
      console.error(err);
      errorDiv.textContent = err.message;
      errorDiv.classList.remove("d-none");

      // If there is an error, we need to unlock the button so they can try again.
      // (If it succeeds, the page redirects anyway, so we don't need a finally block here)
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}
// #endregion

// ------------------------ DOMContentLoaded --------------------------
document.addEventListener("DOMContentLoaded", () => {
  checkAdminAuth();
  updateAuthUI();

  updateCartBadge();

  // detail page
  if (document.getElementById("productName")) loadProductDetail();

  // cart page
  if (document.querySelector("section[aria-label='Cart items']")) renderCart();

  // products page (NEW)
  if (document.getElementById("all-products-container")) loadAllProducts();
  // detail page
  if (document.getElementById("productName")) loadProductDetail();

  // cart page
  if (document.querySelector("section[aria-label='Cart items']")) renderCart();

  // search page
  if (document.getElementById("search-category")) loadSearchCategories();

  // admin product management page
  if (document.getElementById("adminProductGrid")) loadAdminProducts();

  // edit product page
  if (document.getElementById("editProductForm")) loadEditForm();

  // qty buttons on detail page
  const minus = document.querySelector(".qty-minus");
  const plus = document.querySelector(".qty-plus");
  const input = document.querySelector(".qty-val");
  if (minus && plus && input && !document.querySelector(".cart-item")) {
    plus.onclick = () => {
      input.value = +input.value + 1;
    };
    minus.onclick = () => {
      if (+input.value > 1) input.value = +input.value - 1;
    };
  }
});
