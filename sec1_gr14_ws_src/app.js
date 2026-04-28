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

// ======================================================================
// Testing Fetch Exclusive Products (Success)
// method: GET
// URL: http://localhost:5001/api/exclusive/products

// Testing Fetch Exclusive Products (Fail/Boundary - DB Down)
// method: GET
// URL: http://localhost:5001/api/exclusive/products
// (Note: Fails only if the database connection is lost, returning 500)
// ======================================================================
router.get("/api/exclusive/products", (req, res) => {
  let sql = "select * from product limit 4;";

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    return res.send(results);
  });
});

// ======================================================================
// Testing Insert a new Product (Success)
// method: POST
// URL: http://localhost:5001/api/add
// body: raw JSON
// {
//   "name": "Blue Box Wireless Mouse",
//   "brand": "Blue Box",
//   "category": "Accessory",
//   "price": 25.99,
//   "stock_quantity": 100,
//   "description": {"color": "Black", "wireless": true},
//   "image_url": "mouse.png"
// }

// Testing Insert a new Product (Fail - Missing Name & Negative Price)
// method: POST
// URL: http://localhost:5001/api/add
// body: raw JSON
// {
//   "brand": "Blue Box",
//   "category": "Accessory",
//   "price": -10,
//   "stock_quantity": 100
// }
// ======================================================================
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

    // --- VALIDATION START ---
    if (
      !name ||
      !brand ||
      !category ||
      price === undefined ||
      stock_quantity === undefined
    ) {
      return res.status(400).json({
        message:
          "Missing required fields (name, brand, category, price, stock_quantity)",
      });
    }
    if (isNaN(price) || Number(price) < 0) {
      return res
        .status(400)
        .json({ message: "Price must be a valid positive number" });
    }
    if (isNaN(stock_quantity) || Number(stock_quantity) < 0) {
      return res
        .status(400)
        .json({ message: "Stock quantity cannot be negative" });
    }
    // --- VALIDATION END ---

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
      JSON.stringify(description || {}),
      image_url || "",
    ];

    await connection.promise().execute(sql, values);
    res.json({ message: "Product added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ======================================================================
// Testing Fetch All Products (Success)
// method: GET
// URL: http://localhost:5001/api/products

// Testing Fetch All Products (Fail/Boundary - DB Down)
// method: GET
// URL: http://localhost:5001/api/products
// ======================================================================
router.get("/api/products", (req, res) => {
  connection.query("SELECT * FROM product", (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    return res.json(results);
  });
});

// ======================================================================
// Testing Fetch Unique Categories (Success)
// method: GET
// URL: http://localhost:5001/api/categories
// ======================================================================
router.get("/api/categories", async (req, res) => {
  try {
    // SELECT DISTINCT grabs only unique values, ignoring duplicates
    const [rows] = await connection.promise().query(
      "SELECT DISTINCT category FROM product WHERE category IS NOT NULL"
    );
    
    // Convert the database rows into a simple array of strings: ["Phone", "Laptop", ...]
    const categories = rows.map(row => row.category);
    
    res.json(categories);
  } catch (err) {
    console.error("Category fetch error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ======================================================================
// Testing Search Products (Success - No Criteria / All Results)
// method: GET
// URL: http://localhost:5001/api/products/search

// Testing Search Products (Success - With Criteria)
// method: GET
// URL: http://localhost:5001/api/products/search?name=iphone&category=phone&minPrice=300

// Testing Search Products (Fail - Invalid Price Ranges)
// method: GET
// URL: http://localhost:5001/api/products/search?minPrice=-50&maxPrice=abc
// ======================================================================
router.get("/api/products/search", async (req, res) => {
  try {
    // Extract query parameters from the URL
    const { name, category, brand, minPrice, maxPrice } = req.query;

    // --- VALIDATION START ---
    if (minPrice && (isNaN(minPrice) || Number(minPrice) < 0)) {
      return res
        .status(400)
        .json({ message: "minPrice must be a positive number" });
    }
    if (maxPrice && (isNaN(maxPrice) || Number(maxPrice) < 0)) {
      return res
        .status(400)
        .json({ message: "maxPrice must be a positive number" });
    }
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      return res
        .status(400)
        .json({ message: "minPrice cannot be greater than maxPrice" });
    }
    // --- VALIDATION END ---

    // Base SQL query (1=1 is a trick that allows us to easily append "AND" statements)
    let sql = "SELECT * FROM product WHERE 1=1";
    const values = [];

    // Dynamically build the criteria (supports 0 to 5 criteria combinations)
    if (name) {
      sql += " AND name LIKE ?";
      values.push(`%${name}%`);
    }
    if (category) {
      sql += " AND category = ?";
      values.push(category);
    }
    if (brand) {
      sql += " AND brand LIKE ?";
      values.push(`%${brand}%`);
    }
    if (minPrice) {
      sql += " AND price >= ?";
      values.push(Number(minPrice));
    }
    if (maxPrice) {
      sql += " AND price <= ?";
      values.push(Number(maxPrice));
    }

    const [rows] = await connection.promise().execute(sql, values);
    res.json(rows);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ======================================================================
// Testing Fetch existing product details (Success)
// method: GET
// URL: http://localhost:5001/api/products/5

// Testing Fetch product with invalid ID format (Fail - 400 Bad Request)
// method: GET
// URL: http://localhost:5001/api/products/abc
// ======================================================================
router.get("/api/products/:id", (req, res) => {
  const id = req.params.id;

  // --- VALIDATION START ---
  if (!id || isNaN(id) || Number(id) <= 0) {
    return res.status(400).json({
      message: "Invalid product ID format. Must be a positive number.",
    });
  }
  // --- VALIDATION END ---

  connection.query(
    "SELECT * FROM product WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });

      if (results.length === 0) {
        return res.status(404).json({ message: "Not found" });
      }

      return res.json(results[0]);
    },
  );
});

// ======================================================================
// Testing Checkout with sufficient stock (Success)
// method: POST
// URL: http://localhost:5001/api/checkout
// body: raw JSON
// {
//     "cart": [
//         {
//             "id": "2",
//             "name": "iPhone 13",
//             "price": 799,
//             "qty": 1,
//             "img": "Iphone 13.png"
//         }
//     ]
// }

// Testing Checkout with malicious quantity (Fail - 400 Bad Request)
// method: POST
// URL: http://localhost:5001/api/checkout
// body: raw JSON
// {
//     "cart": [
//         {
//             "id": "2",
//             "name": "iPhone 13",
//             "price": 799,
//             "qty": -5,
//             "img": "Iphone 13.png"
//         }
//     ]
// }
// ======================================================================
router.post("/api/checkout", async (req, res) => {
  try {
    const { cart } = req.body;

    // --- VALIDATION START ---
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res
        .status(400)
        .json({ message: "Cart is empty or invalid format" });
    }

    for (const item of cart) {
      if (!item.id || isNaN(item.id)) {
        return res.status(400).json({ message: "Invalid product ID in cart" });
      }
      if (!item.qty || isNaN(item.qty) || Number(item.qty) <= 0) {
        return res.status(400).json({
          message: `Invalid quantity for product ID ${item.id}. Must be greater than 0.`,
        });
      }
    }
    // --- VALIDATION END ---

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
    await connection.promise().query("ROLLBACK");
    console.error("Checkout error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ======================================================================
// Testing Update Product (Success)
// method: PUT
// URL: http://localhost:5001/api/products/1
// body: raw JSON (include updated fields)
//
// Testing Update Product (Fail - Invalid Price)
// method: PUT
// URL: http://localhost:5001/api/products/1
// body: raw JSON (price: -50)
// ======================================================================
router.put("/api/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, brand, category, price, stock_quantity, description, image_url } = req.body;

    // --- VALIDATION START ---
    if (!id || isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    if (!name || !category || price === undefined || stock_quantity === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (isNaN(price) || Number(price) < 0) return res.status(400).json({ message: "Invalid price" });
    if (isNaN(stock_quantity) || Number(stock_quantity) < 0) return res.status(400).json({ message: "Invalid stock" });
    // --- VALIDATION END ---

    const sql = `
      UPDATE product 
      SET name=?, brand=?, category=?, price=?, stock_quantity=?, description=?, image_url=? 
      WHERE id=?
    `;
    const values = [
      name, brand, category, price, stock_quantity, 
      JSON.stringify(description || {}), image_url, id
    ];

    const [result] = await connection.promise().execute(sql, values);
    
    if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated successfully" });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ======================================================================
// Testing Delete Product (Success)
// method: DELETE
// URL: http://localhost:5001/api/products/1
//
// Testing Delete Product (Fail - Invalid ID Format)
// method: DELETE
// URL: http://localhost:5001/api/products/abc
// ======================================================================
router.delete("/api/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    // Note: If you try to delete a product that exists in an Order, 
    // SQL will block it due to Foreign Key constraints. This is expected and safe!
    const [result] = await connection.promise().execute("DELETE FROM product WHERE id = ?", [id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });

  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ======================================================================
// Testing Admin Login (Success)
// method: POST
// URL: http://localhost:5001/api/auth/login
// body: raw JSON { "username": "admin0", "password": "admin0pass" }
//
// Testing Admin Login (Fail - Wrong Password)
// method: POST
// URL: http://localhost:5001/api/auth/login
// body: raw JSON { "username": "admin0", "password": "hehe" }
// ======================================================================
router.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    // 1. Check the database for a matching username and password
    const [rows] = await connection.promise().execute(
      "SELECT * FROM login_info WHERE username = ? AND password = ?",
      [username, password]
    );

    // 2. If no match is found, reject the login
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // 3. Update the last_login timestamp
    await connection.promise().execute(
      "UPDATE login_info SET last_login = NOW() WHERE id = ?",
      [rows[0].id]
    );

    // 4. Send success response
    res.json({ message: "Login successful", username: rows[0].username, role: "admin" });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ======================================================================
// Testing Fetch external news (Success)
// method: GET
// URL: http://localhost:5001/api/news

// Testing Fetch external news (Fail - API Key Invalid/Network Error)
// method: GET
// URL: http://localhost:5001/api/news
// (Note: Fails only if NewsAPI rejects the key or is unreachable)
// ======================================================================
router.get("/api/news", async (req, res) => {
  const API_KEY = "8889f4a6af0149889ac997eb879547bb";

  try {
    let newsReq = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${API_KEY}`;

    const newsRes = await fetch(newsReq);

    // --- VALIDATION START ---
    if (!newsRes.ok) {
      throw new Error(`News API responded with status: ${newsRes.status}`);
    }
    // --- VALIDATION END ---

    const result = await newsRes.json();
    res.send(result);
  } catch (err) {
    console.error("Failed to fetch news:", err.message);
    res.status(500).json({ message: "Failed to fetch news feed" });
  }
});

// #endregion API

// ===================== App Listen =====================
const PORT = 5001;

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
