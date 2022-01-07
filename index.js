require("dotenv").config();
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const path = require("path");



const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// config multers.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    const filename = file.mimetype.includes('image') ? `${file.fieldname}-${Date.now()}.jpg` : `${file.fieldname}-${Date.now()}.mp4`
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// create datbase connection
const dbConn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  port: 3306
});

dbConn.connect(function (err) {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log("Database was connected");
  require("./routes")({ app, dbConn, upload });

});

app.listen(process.env.DB_SERVER || 3003, () => {
  console.log(`Server is listening on port `);
});