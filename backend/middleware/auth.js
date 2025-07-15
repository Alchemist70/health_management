const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication token is required" });
  }

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    req.user = {
      id: decoded.userId,
      role: decoded.role,
      name: decoded.name,
    };
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Admin authentication using a secret code
const authenticateAdmin = (req, res, next) => {
  const adminSecret = process.env.ADMIN_SECRET_CODE || "supersecret";
  const code = req.headers["x-admin-code"] || req.body.admin_code;
  if (code !== adminSecret) {
    return res.status(403).json({ message: "Forbidden: Invalid admin code" });
  }
  next();
};

module.exports = {
  authenticateToken,
  authenticateAdmin,
};
