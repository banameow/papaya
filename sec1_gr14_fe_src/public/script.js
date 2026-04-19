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
  img.src = `/product_images/${product.image_url}`;
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
// document
//   .getElementById("addProductForm")
//   .addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const fileInput = document.getElementById("add-image");
//     const file = fileInput.files[0];

//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       const res = await fetch(`${BASE_SERVER_URL}/api/upload`, {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       console.log("Server response:", data);
//     } catch (err) {
//       console.log("Upload error:", err);
//     }
//   });

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
