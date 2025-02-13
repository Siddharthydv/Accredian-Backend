"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
const authMiddleware_1 = require("../authMiddleware");
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
const router = express_1.default.Router();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = yield prismaClient_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ success: false, message: "Email already registered" });
            return;
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create user
        const user = yield prismaClient_1.default.user.create({
            data: { name, email, password: hashedPassword },
        });
        res.status(201).json({ success: true, message: "User registered successfully", user: user });
    }
    catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ success: false, message: "Signup failed" });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user
        const user = yield prismaClient_1.default.user.findUnique({ where: { email }, include: { referrals: true } }); // Include all referrals associated with each user
        if (!user) {
            res.status(400).json({ success: false, message: "Invalid credentials" });
            return;
        }
        // Compare password
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ success: false, message: "Invalid credentials" });
            return;
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
        // Set JWT in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true, // Prevent access from JavaScript
            secure: true, // Use secure cookies in production
            sameSite: "none", // Prevent CSRF attacks
            maxAge: 3600000, // 1 hour expiry
        });
        res.status(200).json({ success: true, message: "Signin successful", user: user });
    }
    catch (error) {
        console.error("Signin Error:", error);
        res.status(500).json({ success: false, message: "Signin failed" });
        return;
    }
}));
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = yield prismaClient_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ success: false, message: "Email already registered" });
            return;
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create user
        const user = yield prismaClient_1.default.user.create({
            data: { name, email, password: hashedPassword },
        });
        res.status(201).json({ success: true, message: "User registered successfully", user: user });
    }
    catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ success: false, message: "Signup failed" });
    }
}));
router.post("/signin/guest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find user
        const user = yield prismaClient_1.default.user.findUnique({ where: { email: 'guest@gmail.com' }, include: { referrals: true } }); // Include all referrals associated with each user
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user.id, email: user === null || user === void 0 ? void 0 : user.email }, SECRET_KEY, { expiresIn: "1h" });
        // Set JWT in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true, // Prevent access from JavaScript
            secure: true, // Use secure cookies in productionemail
            sameSite: "none", // Prevent CSRF attacks
            maxAge: 3600000, // 1 hour expiry
        });
        res.status(200).json({ success: true, message: "Signin successful", user: user });
    }
    catch (error) {
        console.error("Signin Error:", error);
        res.status(500).json({ success: false, message: "Signin failed" });
        return;
    }
}));
router.get("/logout", authMiddleware_1.authMiddleware, (req, res) => {
    res.clearCookie("token", { path: "/" });
    res.status(200).send("Logged out");
});
exports.default = router;
