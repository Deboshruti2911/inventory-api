// Basic React frontend for Inventory Management
// Assumes backend is running at http://localhost:5000

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [token, setToken] = useState("");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    sku: "",
    image_url: "",
    description: "",
    quantity: 0,
    price: 0
  });
  const [error, setError] = useState("");
  const [newQuantity, setNewQuantity] = useState({});

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        username: "puja",
        password: "123"
      });
      setToken(res.data.access_token);
      setError("");
    } catch (err) {
      console.error("Login error:", err.response?.status, err.message);
      setError("Login failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/products", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
      setError("");
    } catch (err) {
      console.error("Fetch products error:", err.response?.status, err.message);
      setError("Failed to load products: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const handleAddProduct = async () => {
    const missingField = Object.entries(form).find(([_, val]) => val === "" || val === 0);
    if (missingField) {
      setError(`Please fill out all fields. Missing: ${missingField[0]}`);
      return;
    }

    try {
      await axios.post("http://localhost:5000/products", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setError("");
      setForm({
        name: "",
        type: "",
        sku: "",
        image_url: "",
        description: "",
        quantity: 0,
        price: 0
      });
      fetchProducts();
    } catch (err) {
      console.error("Add product error:", err.response?.status, err.message);
      setError(err.response?.data?.message || "Failed to add product");
    }
  };

  const handleUpdateQuantity = async (productId) => {
    if (!newQuantity[productId] || Number(newQuantity[productId]) < 0) {
      setError("Please enter a valid non-negative quantity.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/products/${productId}/quantity`,
        { quantity: Number(newQuantity[productId]) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError("");
      fetchProducts();
    } catch (err) {
      console.error("Update quantity error:", err.response?.status, err.message);
      setError("Failed to update quantity: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  return (
    <div className="container">
      <h1 className="title">Inventory Management</h1>

      {error && <div className="error-box">{error}</div>}

      {!token ? (
        <button onClick={handleLogin} className="btn btn-primary">
          Login as puja
        </button>
      ) : (
        <>
          <div className="section">
            <h2 className="section-title">Add Product</h2>
            {Object.entries(form).map(([key, value]) => (
              <input
                key={key}
                placeholder={key}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="input"
              />
            ))}
            <button onClick={handleAddProduct} className="btn btn-success">
              Add Product
            </button>
          </div>

          <div className="section">
            <h2 className="section-title">Product List</h2>
            {products.map(product => (
              <div key={product._id} className="card">
                <h3>{product.name}</h3>
                <p>Type: {product.type}</p>
                <p>Quantity: {product.quantity}</p>
                <p>Price: ₹{product.price}</p>
                <div className="update-row">
                  <input
                    type="number"
                    placeholder="New Quantity"
                    className="input small"
                    value={newQuantity[product._id] || ""}
                    onChange={e => setNewQuantity({ ...newQuantity, [product._id]: e.target.value })}
                  />
                  <button
                    onClick={() => handleUpdateQuantity(product._id)}
                    className="btn btn-warning"
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;