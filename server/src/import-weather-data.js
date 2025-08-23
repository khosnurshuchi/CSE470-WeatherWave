import mongoose from "mongoose";
import dotenv from "dotenv";
import Location from "./models/Location.js";
import WeatherData from "./models/WeatherData.js";
import WeatherAlert from "./models/WeatherAlert.js";
import TimeStamp from "./models/TimeStamp.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const importWeatherData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Read the dummy data file
        const dummyDataPath = path.join(__dirname, 'weather-dummy-data.json');
        const dummyData = JSON.parse(fs.readFileSync(dummyDataPath, 'utf-8'));

        console.log("📊 Found data collections:", Object.keys(dummyData));

        // Clear existing weather-related data (keeping users intact)
        console.log("🗑️  Clearing existing weather data...");
        await Location.deleteMany({});
        console.log("   ✓ Cleared locations");
        
        await WeatherData.deleteMany({});
        console.log("   ✓ Cleared weather data");
        
        await WeatherAlert.deleteMany({});
        console.log("   ✓ Cleared weather alerts");
        
        await TimeStamp.deleteMany({});
        console.log("   ✓ Cleared timestamps");

        // Insert new data
        console.log("📥 Importing new data...");

        // Import Locations
        if (dummyData.locations && dummyData.locations.length > 0) {
            await Location.insertMany(dummyData.locations);
            console.log(`   ✅ Imported ${dummyData.locations.length} locations`);
            
            // Show imported locations
            const locationNames = dummyData.locations.map(loc => `${loc.city}, ${loc.country}`);
            console.log("   📍 Locations:", locationNames.join(", "));
        }

        // Import Weather Data
        if (dummyData.weatherdatas && dummyData.weatherdatas.length > 0) {
            await WeatherData.insertMany(dummyData.weatherdatas);
            console.log(`   ✅ Imported ${dummyData.weatherdatas.length} weather data records`);
        }

        // Import Weather Alerts
        if (dummyData.weatheralerts && dummyData.weatheralerts.length > 0) {
            await WeatherAlert.insertMany(dummyData.weatheralerts);
            console.log(`   ✅ Imported ${dummyData.weatheralerts.length} weather alerts`);
            
            // Show alert summary
            const alertSummary = dummyData.weatheralerts.reduce((acc, alert) => {
                acc[alert.alertCondition] = (acc[alert.alertCondition] || 0) + 1;
                return acc;
            }, {});
            console.log("   🚨 Alert types:", alertSummary);
        }

        // Import Timestamps
        if (dummyData.timestamps && dummyData.timestamps.length > 0) {
            await TimeStamp.insertMany(dummyData.timestamps);
            console.log(`   ✅ Imported ${dummyData.timestamps.length} timestamps`);
        }

        // Verify the import with counts
        console.log("\n📊 Final Database Counts:");
        console.log(`   📍 Locations: ${await Location.countDocuments()}`);
        console.log(`   🌤️  Weather Data: ${await WeatherData.countDocuments()}`);
        console.log(`   🚨 Weather Alerts: ${await WeatherAlert.countDocuments()}`);
        console.log(`   ⏰ Timestamps: ${await TimeStamp.countDocuments()}`);

        mongoose.connection.close();
        console.log("\n✅ Database connection closed");
        console.log("🎉 Weather data import completed successfully!");

    } catch (error) {
        console.error("❌ Error importing weather data:", error);
        if (mongoose.connection.readyState === 1) {
            mongoose.connection.close();
        }
        process.exit(1);
    }
};

// Run the import
importWeatherData();