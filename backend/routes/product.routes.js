const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
  addProduct,
  updateQuantity,
  getProducts,
} = require("../controllers/product.controller");

router.post("/products", auth, addProduct);
router.put("/products/:id/quantity", auth, updateQuantity);
router.get("/products", auth, getProducts);

module.exports = router;
