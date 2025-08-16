import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/emailService.js";

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register user
router.post("/register", async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "User with this email already exists" 
            });
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create new user
        const user = new User({
            fullName,
            email,
            password,
            phoneNumber,
            verificationToken,
            verificationTokenExpires
        });

        await user.save();

        // Send verification email
        try {
            await sendVerificationEmail(email, verificationToken);
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            // Don't fail the registration if email fails
        }

        res.status(201).json({
            success: true,
            message: "User registered successfully. Please check your email for verification.",
            data: {
                userId: user._id,
                email: user.email,
                fullName: user.fullName
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
});

// Verify email
router.get("/verify-email/:token", async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification token"
            });
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpires = null;
        await user.save();

        res.json({
            success: true,
            message: "Email verified successfully. You can now login."
        });

    } catch (error) {
        console.error("Email verification error:", error);
        res.status(500).json({
            success: false,
            message: "Email verification failed",
            error: error.message
        });
    }
});

// Login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: "Please verify your email before logging in"
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    isVerified: user.isVerified
                }
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
});

// Resend verification email
router.post("/resend-verification", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified"
            });
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        user.verificationToken = verificationToken;
        user.verificationTokenExpires = verificationTokenExpires;
        await user.save();

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        res.json({
            success: true,
            message: "Verification email sent successfully"
        });

    } catch (error) {
        console.error("Resend verification error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to resend verification email",
            error: error.message
        });
    }
});

// Test email route (remove in production)
router.get("/test-email", async (req, res) => {
    try {
        const { testEmailConnection } = await import("../utils/emailService.js");
        const isValid = await testEmailConnection();
        
        if (isValid) {
            res.json({ success: true, message: "Email configuration is valid" });
        } else {
            res.status(500).json({ success: false, message: "Email configuration failed" });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Email test failed", 
            error: error.message 
        });
    }
});

export default router;