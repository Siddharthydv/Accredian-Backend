"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Use environment variable
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    // console.log(token)
    if (!token) {
        res.status(401).json({ success: false, message: "Access denied. No token provided." });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY); // Verify token
        req.user = decoded;
        console.log(decoded); // Attach user info to request
        next();
    }
    catch (error) {
        res.status(403).json({ success: false, message: "Invalid token." });
    }
};
exports.authMiddleware = authMiddleware;
