const express = require("express");
const path = require("path");
const dotenv = require("dotenv")

const app = express();
const router = express.Router();

// ===================== App =====================
app.use(express.static(path.join(__dirname, "public")));

app.use(router);
dotenv.config()

// ===================== Pages Routing =====================
router.get(["/", "/index.html"], (req, res) => {
  res.sendFile(`${__dirname}/html/index.html`);
});

router.get("/products.html", (req, res) => {
  res.sendFile(`${__dirname}/html/products.html`);
});

router.get("/add-product.html", (req, res) => {
  res.sendFile(`${__dirname}/html/add-product.html`);
});

router.get("/team.html", (req, res) => {
  res.sendFile(`${__dirname}/html/team.html`);
});

router.get("/detail.html", (req, res) => {
  res.sendFile(`${__dirname}/html/detail.html`);
});

router.get("/search.html", (req, res) => {
  res.sendFile(`${__dirname}/html/search.html`)
});

router.get("/cart.html", (req, res) => {
  res.sendFile(`${__dirname}/html/cart.html`);
});

router.get("/product-management.html", (req, res) => {
  res.sendFile(`${__dirname}/html/product-management.html`);
});

router.get("/add-product.html", (req, res) => {
  res.sendFile(`${__dirname}/html/add-product.html`);
});

router.get("/edit-product.html", (req, res) => {
  res.sendFile(`${__dirname}/html/edit-product.html`);
});

router.get("/login.html", (req, res) => {
  res.sendFile(`${__dirname}/html/login.html`);
});

// ===================== Not Found page =====================
// Must be at the bottom of code
router.use((req, res, next) => {
  res.status(404).sendFile(`${__dirname}/html/notfound.html`);
});

// ===================== App Listen =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
