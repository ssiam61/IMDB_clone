const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_change_this_in_production";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false, 
        error: "No token provided. Authentication required." 
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false, 
        error: "Token expired. Please login again." 
      });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false, 
        error: "Invalid token. Authentication failed." 
      });
    }
    return res.status(401).json({ 
      success: false, 
      error: "Authentication failed." 
    });
  }
};

module.exports = { authMiddleware, JWT_SECRET };
