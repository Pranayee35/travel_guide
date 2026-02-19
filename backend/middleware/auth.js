import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function auth(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers?.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function optionalAuth(req, res, next) {
  const token = req.cookies?.token || req.headers?.authorization?.replace("Bearer ", "");
  if (!token) return next();
  jwt.verify(token, process.env.JWT_SECRET || "secret", async (err, decoded) => {
    if (err) return next();
    try {
      const user = await User.findById(decoded.userId).select("-password");
      if (user) req.user = user;
    } catch (_) {}
    next();
  });
}
