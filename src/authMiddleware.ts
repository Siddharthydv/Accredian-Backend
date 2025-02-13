import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Use environment variable

export interface AuthRequest extends Request {
  user?: any; // Extend request object to include user
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;
  // console.log(token)

  if (!token) {
    res.status(401).json({ success: false, message: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verify token
    req.user = decoded;
    console.log(decoded) // Attach user info to request
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: "Invalid token." });
  }
};
