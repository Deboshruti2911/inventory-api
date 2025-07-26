const jwt = require("jsonwebtoken"); // Import JWT library

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization; // Read Authorization header

  // Check if the Authorization header starts with 'Bearer '
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Extract the token from the header (format: "Bearer token")
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the secret key from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded token payload (e.g., user id) to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If token is invalid or expired
    res.status(401).json({ message: "Invalid token" });
  }
};
