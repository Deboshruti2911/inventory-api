# Inventory Management API

A complete RESTful API built with Node.js, Express, MongoDB, and JWT for managing product inventory.

---

## Features

- User registration and login (with JWT authentication)
- Add, update, and fetch products
- Quantity update endpoint
- Error handling and schema validation
- Swagger documentation

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Deboshruti2911/inventory-api.git
cd inventory-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment

Create a `.env` file:

```
MONGO_URI=mongodb://localhost:27017/inventory
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 4. Run the server

```bash
node server.js
```

---

inventory-api/
├── backend/
│ ├── controllers/
│ │ ├── auth.controller.js # Handles user registration and login
│ │ └── product.controller.js # Handles product creation, update, fetch
│ │
│ ├── models/
│ │ ├── user.model.js # Mongoose schema for User
│ │ └── product.model.js # Mongoose schema for Product
│ │
│ ├── routes/
│ │ ├── auth.routes.js # Routes for /register and /login
│ │ └── product.routes.js # Routes for /products and related
│ │
│ ├── middleware/
│ │ └── auth.middleware.js # JWT verification middleware
│ │
│ ├── config/
│ │ └── db.js # MongoDB connection setup
│ │
│ ├── .env  
│ ├── .env.example  
│ ├── app.js  
│ ├── server.js # Entry point — starts the server
│ ├── swagger.json # Swagger API documentation
│ └── package.json # Dependencies and scripts
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── App.js  
│ │ └── ...
│ └── package.json # Frontend dependencies
│
├── test_api_fixed.py  
├── inventory-api.postman_collection.json  
├── README.md

```

---

## Authentication

All product routes are protected by JWT. Use the token from `/login` in the `Authorization` header:

```

Authorization: Bearer <token>

```

---

## API Documentation

Open `swagger.json` in [Swagger Editor](https://editor.swagger.io/) or use Swagger UI in your project.

---

## Sample Endpoints

- `POST /register` - Register new user
- `POST /login` - Login and get JWT
- `GET /products` - Get all products
- `POST /products` - Add a product
- `PUT /products/:id/quantity` - Update product quantity

---

## Postman Collection

This project includes a Postman collection to test all API routes.

### How to Use

1. Open [Postman](https://www.postman.com/)
2. Click **Import**
3. Select the file: `inventory-api.postman_collection.json`
4. Test available endpoints:
   - `POST /register`
   - `POST /login`
   - `POST /products` (requires Bearer token)
   - `GET /products` (requires Bearer token)
   - `PUT /products/:id/quantity` (requires Bearer token)
5. Optional: Replace `Authorization` Bearer token with your own
```
