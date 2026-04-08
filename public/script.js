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
  img.src = `product_images/${product.image_url}`;
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

fetch("/api/exclusive/products")
  .then((res) => res.json())
  .then((result) => {
    result.forEach((r) => {
      document
        .getElementById("product-container")
        .appendChild(createProductCard(r));
    });
  })
  .catch((err) => console.log(err));
