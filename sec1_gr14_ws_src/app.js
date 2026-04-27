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
  database: "sec1_gr14_database",
});

connection.connect(function (err) {
  if (err) throw err;

  console.log(`Connected DB: ${connection.config.database}`);
});
// #endregion

// #region ===================== API =====================

router.get("/api/exclusive/products", (req, res) => {
  let sql = "select * from product limit 4;";

  connection.query(sql, (err, results) => {
    if (err) throw err;

    return res.send(results);
  });
});

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

    await connection.promise().execute(sql, values);

    res.json({ message: "Product added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/api/products/:id", (req, res) => {
  connection.query(
    "SELECT * FROM product WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });

      if (results.length === 0) {
        return res.status(404).json({ message: "Not found" });
      }

      return res.json(results[0]);
    },
  );
});

router.post("/api/checkout", async (req, res) => {
  try {
    const { cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Use .promise() locally so we can safely use async/await for the transaction
    const db = connection.promise();

    await db.query("START TRANSACTION");

    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];

      const [rows] = await db.execute(
        "SELECT stock_quantity, name FROM product WHERE id = ?",
        [item.id],
      );

      if (rows.length === 0) {
        throw new Error(`Product ID ${item.id} not found in database.`);
      }

      if (rows[0].stock_quantity < item.qty) {
        throw new Error(
          `Not enough stock for ${rows[0].name}. Only ${rows[0].stock_quantity} left!`,
        );
      }

      await db.execute(
        "UPDATE product SET stock_quantity = stock_quantity - ? WHERE id = ?",
        [item.qty, item.id],
      );
    }

    await db.query("COMMIT");
    res.json({ message: "Checkout successful, stock updated!" });
  } catch (err) {
    // Rollback if any item fails
    await connection.promise().query("ROLLBACK");
    console.error("Checkout error:", err);
    res.status(500).json({ message: err.message });
  }
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
