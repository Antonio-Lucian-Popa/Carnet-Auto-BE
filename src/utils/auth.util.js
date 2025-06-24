const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const getCurrentUser = (authHeader) => {
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) throw new Error("Token lipsă");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id || decoded.userId;
  } catch (error) {
    throw new Error("Token invalid sau expirat");
  }
};

module.exports = { getCurrentUser };
