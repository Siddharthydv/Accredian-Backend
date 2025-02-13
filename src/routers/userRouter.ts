import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prismaClient from "../prismaClient";
import { ApiResponse } from "../types";
import { authMiddleware } from "../authMiddleware";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
const router = express.Router();


router.post("/signup", async (req: Request, res: Response):Promise<void>=> {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prismaClient.user.findUnique({ where: { email } });
    if (existingUser) {
       res.status(400).json({ success: false, message: "Email already registered" });
       return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prismaClient.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({ success: true, message: "User registered successfully",user:user });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Signup failed" });
  }
});

router.post("/signin", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prismaClient.user.findUnique({ where: { email } ,include: {referrals: true}}); // Include all referrals associated with each user

    if (!user) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
      return;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
      return;
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

    // Set JWT in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent access from JavaScript
      secure:true, // Use secure cookies in production
      sameSite: "none", // Prevent CSRF attacks
      maxAge: 3600000, // 1 hour expiry
    });

    res.status(200).json({ success: true, message: "Signin successful",user:user });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ success: false, message: "Signin failed" });
    return;
  }
});

router.get("/logout",authMiddleware, (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).send("Logged out");
});
export default router;
