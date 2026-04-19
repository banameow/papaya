const express = require("express");
const mysql = require("mysql2");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const upload = multer({ dest: "papaya/" });
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

// #region ===================== Cloudinary: for images =====================
const API_KEY = "137843743929997";
const API_SECRET = "Zh0leDXTB-TmiBe7rq_6hHYP2gM";
const CLOUD_NAME = "dctylcksu";

const CLOUDINARY_URL = `cloudinary://${API_KEY}:${API_SECRET}@${CLOUD_NAME}`;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const uploadImage = async (imagePath) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);

    return result.public_id;
  } catch (error) {
    console.error(error);
  }
};
// #endregion

// #region ===================== API =====================
router.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const publicId = await uploadImage(file.path);

    res.json({
      msg: "Upload complete",
      image_publicId: publicId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.get('/api/temp/product', (req, res) => {
  res.send(`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/b95247e8e4a7589b8c7d3319267c90c3.jpg`)
})

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
