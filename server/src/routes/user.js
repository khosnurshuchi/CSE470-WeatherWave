import express from "express";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password -verificationToken -verificationTokenExpires');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get user profile",
            error: error.message
        });
    }
});

// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
    try {
        const { fullName, phoneNumber } = req.body;
        
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update allowed fields
        if (fullName) user.fullName = fullName;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        await user.save();

        // Return updated user without sensitive data
        const updatedUser = await User.findById(req.userId).select('-password -verificationToken -verificationTokenExpires');

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });

    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
});

// Change password
router.put("/change-password", authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required"
            });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to change password",
            error: error.message
        });
    }
});

// Delete user account
router.delete("/account", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(req.userId);

        res.json({
            success: true,
            message: "Account deleted successfully"
        });

    } catch (error) {
        console.error("Delete account error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete account",
            error: error.message
        });
    }
});

export default router;