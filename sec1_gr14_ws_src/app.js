const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const router = express.Router();

// ===================== App =====================
app.use(cors());

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

app.use(router);

// #region ===================== Database Connection =====================
var connection = mysql.createConnection({
  host: "localhost",
  user: "PapayaUser",
  password: "PapayaUser_123",
  database: "papaya",
});

connection.connect(function (err) {
  if (err) throw err;

  console.log(`Connected DB: ${connection.config.database}`);
});
// #endregion

// #region ===================== API =====================

router.post("/api/add", async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      price,
      stock_quantity,
      description,
      image_url,
    } = req.body;

    const sql = `
      INSERT INTO product
      (name, brand, category, price, stock_quantity, description, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name,
      brand,
      category,
      price,
      stock_quantity,
      JSON.stringify(description),
      image_url,
    ];

    await connection.execute(sql, values);

    res.json({ message: "Product added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/api/exclusive/products", (req, res) => {
  let sql = "select * from product limit 4;";

  connection.query(sql, (err, results) => {
    if (err) throw err;

    return res.send(results);
  });
});

router.get("/api/news", async (req, res) => {
  const API_KEY = "8889f4a6af0149889ac997eb879547bb";

  try {
    let newsReq = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${API_KEY}`;

    const newsRes = await fetch(newsReq);
    const result = await newsRes.json();

    res.send(result);
  } catch (err) {
    console.log("Failed to fetch news:", err);
  }
});

// #endregion API

// ===================== App Listen =====================
const PORT = 5001;

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
