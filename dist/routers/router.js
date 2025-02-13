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
exports.referralRouter = void 0;
const express_1 = require("express");
const prismaClient_1 = __importDefault(require("../prismaClient"));
const sendEmail_1 = require("../sendEmail");
exports.referralRouter = (0, express_1.Router)();
exports.referralRouter.get('/healthy', (req, res) => {
    res.json("healthy").status(200);
});
exports.referralRouter.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield prismaClient_1.default.user.findUnique({
            where: { id: Number(id) }, // Convert id to number if it's stored as an integer
        });
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}));
exports.referralRouter.get('/getReferrals', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const referrals = yield prismaClient_1.default.referral.findMany({
            where: { referrerId: userId }
        });
        res.json({ success: true, referrals });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch referrals" });
    }
}));
exports.referralRouter.get("/getDetails", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const users = yield prismaClient_1.default.user.findMany({
            where: { id: userId },
            include: {
                referrals: true, // Include all referrals associated with each user
            },
        });
        res.json({ success: true, users });
    }
    catch (error) {
        console.error("Error fetching users with referrals:", error);
        res.status(500).json({ success: false, message: "Failed to fetch data." });
    }
}));
exports.referralRouter.post("/createReferral", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refereeName, refereeEmail, courseInterested } = req.body;
        const referrerId = req.user.id || 1;
        // Validate required fields
        if (!referrerId || !refereeName || !refereeEmail || !courseInterested) {
            res.status(400).json({ success: false, message: "All fields are required" });
            return;
        }
        // Ensure the referrer exists
        const referrer = yield prismaClient_1.default.user.findUnique({ where: { id: referrerId } });
        if (!referrer) {
            res.status(404).json({ success: false, message: "Referrer not found" });
            return;
        }
        // Create referral entry in the database
        const referral = yield prismaClient_1.default.referral.create({
            data: {
                referrerId,
                refereeName,
                refereeEmail,
                courseInterested,
            },
        });
        (0, sendEmail_1.sendEmail)({ refereeName, refereeEmail, courseInterested });
        // Send an email notification to the referee
        // const mailOptions = {
        //   from: process.env.GMAIL_USER,
        //   to: refereeEmail,
        //   subject: "You've Been Referred!",
        //   text: `Hi ${refereeName},\n\n${referrer.name} has referred you for the ${courseInterested} course.\nSign up today to get started!\n\nBest,\nYour Team`,
        // };
        // await transporter.sendMail(mailOptions);
        res.status(201).json({ success: true, message: "Referral created successfully", referral });
    }
    catch (error) {
        console.error("Error creating referral:", error);
        res.status(500).json({ success: false, message: "Referral creation failed" });
    }
}));
exports.default = exports.referralRouter;
