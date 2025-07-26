const Product = require("../models/product.model");

// Add new product
exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ product_id: product._id });
  } catch (err) {
    console.error("Add product error:", err);

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    if (err.code === 11000) {
      return res.status(400).json({ message: "SKU must be unique" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

// Update product quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || typeof quantity !== "number" || quantity < 0) {
      return res.status(400).json({ message: "Quantity must be a non-negative number" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.quantity = quantity;
    await product.save();

    res.status(200).json({ message: "Quantity updated", quantity: product.quantity });
  } catch (err) {
    console.error("Update quantity error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all products (with optional pagination)
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1, 10);
    const limit = parseInt(req.query.limit || 10, 10);

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      return res.status(400).json({ message: "Invalid pagination values" });
    }

    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json(products);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
