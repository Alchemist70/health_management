const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("\n=== Auth Middleware ===");
  console.log("Headers:", req.headers);

  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Extracted token:", token ? "Present" : "Not present");

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    console.log("Decoded token:", decoded);
    req.user = decoded;
    console.log("User set in request:", req.user);
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
