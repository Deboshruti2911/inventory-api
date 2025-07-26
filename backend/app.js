const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use(require("./routes/auth.routes"));
app.use(require("./routes/product.routes"));

module.exports = app;
