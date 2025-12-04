import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  console.log("🔐 Incoming protected request:", req.method, req.originalUrl);

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("❌ No token found in request");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    console.log("✅ Token verified | UserID:", req.userId);
    next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;
