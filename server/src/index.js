import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import weatherRoutes from "./routes/weather.js";

// Import models to ensure they are registered with mongoose
import User from "./models/User.js";
import Location from "./models/Location.js";
import UserLocation from "./models/UserLocation.js";
import WeatherData from "./models/WeatherData.js";
import WeatherAlert from "./models/WeatherAlert.js";
import TimeStamp from "./models/TimeStamp.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/weather", weatherRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Weather API is running",
        timestamp: new Date().toISOString(),
        models: {
            User: !!User,
            Location: !!Location,
            UserLocation: !!UserLocation,
            WeatherData: !!WeatherData,
            WeatherAlert: !!WeatherAlert,
            TimeStamp: !!TimeStamp
        }
    });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        console.log("📊 Registered Models:", Object.keys(mongoose.models));
    })
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Health check: http://localhost:${PORT}/api/health`);
});