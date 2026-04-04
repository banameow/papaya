const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

const app = express();
const router = express.Router();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "html")));

app.use(router);

dotenv.config();

router.get("/", (req, res) => {
  res.sendFile(`${__dirname}/html/index.html`);
});

router.get("/signup", (req, res) => {
  res.sendFile(`${__dirname}/html/sign-up.html`);
});

router.get("/login", (req, res) => {
  res.sendFile(`${__dirname}/html/login.html`);
});

router.get("/search", (req, res) => {
  res.sendFile(`${__dirname}/html/search.html`);
});

router.get("/products", (req, res) => {
  res.sendFile(`${__dirname}/html/products.html`);
});

router.get("/product/detail", (req, res) => {
  res.sendFile(`${__dirname}/html/detail.html`);
});

router.get("/product/management", (req, res) => {
  res.sendFile(`${__dirname}/html/product-management.html`);
});

router.get("/team", (req, res) => {
  res.sendFile(`${__dirname}/html/team.html`);
});

router.use((req, res, next) => {
  res.status(404).sendFile(`${__dirname}/html/notfound.html`);
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
