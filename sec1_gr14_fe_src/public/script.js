const BASE_SERVER_URL = "http://localhost:5001";

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

      try {
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
// loadCarouselNews(); // Do comment when developing, so it not waste the public request :>

// ------------------------ detail.html --------------------------
async function loadProductDetail() {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return;

  try {
    const res = await fetch(`${BASE_SERVER_URL}/api/products/${id}`);
    if (!res.ok) { location.href = "notfound.html"; return; }
    const p = await res.json();

    // populate ข้อมูล
    document.getElementById("productName").textContent = p.name;
    document.getElementById("productPrice").textContent = Number(p.price).toLocaleString();
    document.getElementById("mainImage").src =
      `https://res.cloudinary.com/dctylcksu/image/upload/q_auto/f_auto/v1777085932/${p.image_url}`;
    document.title = `Papaya – ${p.name}`;

    // ถ้า description เป็น JSON object → สร้าง spec table
    const desc = typeof p.description === "string" ? JSON.parse(p.description) : p.description;
    const tbody = document.querySelector(".spec-table tbody");
    tbody.innerHTML = "";
    Object.entries(desc).forEach(([key, val]) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${key}</td><td>${val}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

// ------------------------ cart.html --------------------------
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}
function updateCartBadge() {
  const count = getCart().reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll("#cartCount").forEach(el => el.textContent = count);
}

function addToCart() {
  const id    = new URLSearchParams(location.search).get("id");
  const name  = document.getElementById("productName").textContent;
  const price = parseInt(document.getElementById("productPrice").textContent.replace(/,/g, ""));
  const qty   = parseInt(document.querySelector(".qty-val").value);
  const img   = document.getElementById("mainImage").src;

  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += qty;
  else cart.push({ id, name, price, qty, img });
  saveCart(cart);

  const msg = document.getElementById("cartSuccess");
  msg.classList.remove("d-none");
  setTimeout(() => msg.classList.add("d-none"), 2000);
}

// render cart items ใน cart.html
function renderCart() {
  const cart = getCart();
  const section = document.querySelector("section[aria-label='Cart items']");
  if (!section) return;

  section.innerHTML = "";
  cart.forEach(item => {
    const article = document.createElement("article");
    article.className = "cart-item d-flex align-items-center gap-3 bg-light rounded-4 p-3 mb-3";
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
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

function updateSummary() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = parseInt(document.getElementById("cart-discount")?.dataset.discount || 0);
  document.getElementById("cart-subtotal").textContent = subtotal.toLocaleString();
  document.getElementById("cart-total").textContent = (subtotal - discount).toLocaleString();
}

function applyCoupon() {
  const code = document.getElementById("couponInput").value.trim().toUpperCase();
  const msg  = document.getElementById("couponMsg");
  const discountEl = document.getElementById("cart-discount");
  const COUPONS = { "PAPAYA10": 100, "SAVE500": 500 }; // ตัวอย่าง

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
function checkout() {
  localStorage.removeItem("cart");
  updateCartBadge();
  
  location.href = "index.html";
}
function checkout() {
  localStorage.removeItem("cart");
  updateCartBadge();
  alert("Order placed successfully! 🎉");
  location.href = "index.html";
}

function initQtyButtons() {
  document.querySelectorAll(".cart-item").forEach(article => {
    const minus = article.querySelector(".qty-minus");
    const plus  = article.querySelector(".qty-plus");
    const input = article.querySelector(".qty-val");
    const id    = article.dataset.id;

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
  const item = cart.find(i => i.id === id);
  if (item) item.qty = qty;
  saveCart(cart);
  updateSummary();
}

// ------------------------ DOMContentLoaded --------------------------
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  
  // detail page
  if (document.getElementById("productName")) loadProductDetail();

  // cart page  
  if (document.querySelector("section[aria-label='Cart items']")) renderCart();

  // qty buttons on detail page
  const minus = document.querySelector(".qty-minus");
  const plus  = document.querySelector(".qty-plus");
  const input = document.querySelector(".qty-val");
  if (minus && plus && input && !document.querySelector(".cart-item")) {
    plus.onclick  = () => { input.value = +input.value + 1; };
    minus.onclick = () => { if (+input.value > 1) input.value = +input.value - 1; };
  }
});