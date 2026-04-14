const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const path = require("path");
var cors = require("cors");

const app = express();
const router = express.Router();

// ===================== App =====================
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

app.use(router);

dotenv.config();

// ===================== Database Connection =====================
var connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

connection.connect(function (err) {
  if (err) throw err;

  console.log(`Connected DB: ${process.env.MYSQL_DATABASE}`);
});

// ===================== Pages Routing =====================
router.get(["/", "/index.html"], (req, res) => {
  res.sendFile(`${__dirname}/html/index.html`);
});

router.get("/products.html", (req, res) => {
  res.sendFile(`${__dirname}/html/products.html`);
});

router.get("/team.html", (req, res) => {
  res.sendFile(`${__dirname}/html/team.html`);
});

// ===================== Calling API =====================
router.get("/api/exclusive/products", (req, res) => {
  let sql = "select * from product limit 4;";

  connection.query(sql, (err, results) => {
    if (err) throw err;

    return res.send(results);
  });
});

router.get("/api/news", async (req, res) => {
  try {
    let newsReq = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${process.env.API_KEY}`;

    const newsRes = await fetch(newsReq);
    const result = await newsRes.json();

    res.send(result);
  } catch (err) {
    console.log("Failed to fetch news:", err);
  }
});

// ===================== Not Found page =====================
// Must be at the bottom of code
router.use((req, res, next) => {
  res.status(404).sendFile(`${__dirname}/html/notfound.html`);
});

// ===================== App Listen =====================
app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
