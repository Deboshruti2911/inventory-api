const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  type: { type: String, required: [true, "Type is required"] },
  sku: { type: String, required: [true, "SKU is required"], unique: true },
  image_url: { type: String},
  description: { type: String, required: [true, "Description is required"] },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity cannot be negative"]
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be a positive number"]
  }
});

module.exports = mongoose.model("Product", productSchema);
