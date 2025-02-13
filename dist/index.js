"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = require("./routers/router");
const authMiddleware_1 = require("./authMiddleware");
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.ALLOWED_URL || "http://localhost:3001", // Allow only this origin
    credentials: true, // If using cookies or authentication headers
}));
app.get('healthy', (req, res) => {
    res.json("healthy");
});
app.use('/user', userRouter_1.default);
app.use('/referral', authMiddleware_1.authMiddleware, router_1.referralRouter);
app.listen(3000, () => {
    console.log(`running on port ${process.env.PORT}`);
});
