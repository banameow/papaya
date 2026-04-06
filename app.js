const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const router = express.Router();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "html")));

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

app.use(router);

dotenv.config();

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

router.get("/", (req, res) => {});

router.use((req, res, next) => {
  res.status(404).sendFile(`${__dirname}/html/notfound.html`);
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
