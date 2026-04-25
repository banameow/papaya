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
