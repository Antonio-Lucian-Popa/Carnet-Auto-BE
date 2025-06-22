const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret123";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifică dacă există token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token lipsă sau invalid." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // userId + email
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token invalid sau expirat." });
  }
};

module.exports = authenticate;
