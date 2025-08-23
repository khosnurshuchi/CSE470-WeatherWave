import mongoose from "mongoose";
import dotenv from "dotenv";
import Location from "./models/Location.js";
import UserLocation from "./models/UserLocation.js";
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
        console.log("🗑️ Clearing existing weather data...");

        await WeatherAlert.deleteMany({});
        console.log("   ✓ Cleared weather alerts");

        await WeatherData.deleteMany({});
        console.log("   ✓ Cleared weather data");

        await TimeStamp.deleteMany({});
        console.log("   ✓ Cleared timestamps");

        await UserLocation.deleteMany({});
        console.log("   ✓ Cleared user locations");

        await Location.deleteMany({});
        console.log("   ✓ Cleared locations");

        // Import new data in correct order (due to references)
        console.log("📥 Importing new data...");

        // 1. Import Locations (no dependencies)
        if (dummyData.locations && dummyData.locations.length > 0) {
            await Location.insertMany(dummyData.locations);
            console.log(`   ✅ Imported ${dummyData.locations.length} locations`);

            // Show imported locations
            const locationNames = dummyData.locations.map(loc => `${loc.city}, ${loc.country}`);
            console.log("   🌍 Locations:", locationNames.join(", "));
        }

        // 2. Import UserLocations (depends on locations and users)
        if (dummyData.userlocations && dummyData.userlocations.length > 0) {
            await UserLocation.insertMany(dummyData.userlocations);
            console.log(`   ✅ Imported ${dummyData.userlocations.length} user-location relationships`);

            // Show user location summary
            const userLocationSummary = dummyData.userlocations.reduce((acc, ul) => {
                acc[ul.userId] = (acc[ul.userId] || 0) + 1;
                return acc;
            }, {});
            console.log("   👥 User locations:", userLocationSummary);
        }

        // 3. Import Timestamps (no dependencies)
        if (dummyData.timestamps && dummyData.timestamps.length > 0) {
            await TimeStamp.insertMany(dummyData.timestamps);
            console.log(`   ✅ Imported ${dummyData.timestamps.length} timestamps`);

            // Show time range
            const times = dummyData.timestamps.map(t => new Date(t.time));
            const minTime = new Date(Math.min(...times));
            const maxTime = new Date(Math.max(...times));
            console.log(`   ⏰ Time range: ${minTime.toISOString()} to ${maxTime.toISOString()}`);
        }

        // 4. Import Weather Data (depends on locations and timestamps)
        if (dummyData.weatherdatas && dummyData.weatherdatas.length > 0) {
            await WeatherData.insertMany(dummyData.weatherdatas);
            console.log(`   ✅ Imported ${dummyData.weatherdatas.length} weather data records`);

            // Show weather data summary by location
            const weatherSummary = dummyData.weatherdatas.reduce((acc, wd) => {
                const location = dummyData.locations.find(l => l._id === wd.locationId);
                const locationName = location ? `${location.city}, ${location.country}` : wd.locationId;
                acc[locationName] = (acc[locationName] || 0) + 1;
                return acc;
            }, {});
            console.log("   🌤️ Weather data by location:", weatherSummary);
        }

        // 5. Import Weather Alerts (depends on weather data, locations, and users)
        if (dummyData.weatheralerts && dummyData.weatheralerts.length > 0) {
            await WeatherAlert.insertMany(dummyData.weatheralerts);
            console.log(`   ✅ Imported ${dummyData.weatheralerts.length} weather alerts`);

            // Show alert summary
            const alertSummary = dummyData.weatheralerts.reduce((acc, alert) => {
                acc[alert.alertCondition] = (acc[alert.alertCondition] || 0) + 1;
                return acc;
            }, {});
            console.log("   🚨 Alert types:", alertSummary);

            const severitySummary = dummyData.weatheralerts.reduce((acc, alert) => {
                acc[alert.severity] = (acc[alert.severity] || 0) + 1;
                return acc;
            }, {});
            console.log("   ⚠️ Alert severity:", severitySummary);
        }

        // Verify the import with counts and relationships
        console.log("\n📊 Final Database Counts:");
        console.log(`   🌍 Locations: ${await Location.countDocuments()}`);
        console.log(`   👥 User-Location Relations: ${await UserLocation.countDocuments()}`);
        console.log(`   ⏰ Timestamps: ${await TimeStamp.countDocuments()}`);
        console.log(`   🌤️ Weather Data: ${await WeatherData.countDocuments()}`);
        console.log(`   🚨 Weather Alerts: ${await WeatherAlert.countDocuments()}`);

        // Verify relationships
        console.log("\n🔗 Verifying Relationships:");

        // Check if all weather data has valid location and timestamp references
        const weatherWithInvalidLocation = await WeatherData.countDocuments({
            locationId: { $nin: dummyData.locations.map(l => new mongoose.Types.ObjectId(l._id)) }
        });
        console.log(`   🌤️ Weather data with invalid location refs: ${weatherWithInvalidLocation}`);

        const weatherWithInvalidTimestamp = await WeatherData.countDocuments({
            timestampId: { $nin: dummyData.timestamps.map(t => new mongoose.Types.ObjectId(t._id)) }
        });
        console.log(`   🌤️ Weather data with invalid timestamp refs: ${weatherWithInvalidTimestamp}`);

        // Check user-location relationships
        const userLocationsWithInvalidLocation = await UserLocation.countDocuments({
            locationId: { $nin: dummyData.locations.map(l => new mongoose.Types.ObjectId(l._id)) }
        });
        console.log(`   👥 User-locations with invalid location refs: ${userLocationsWithInvalidLocation}`);

        // Sample data verification - get latest weather for each location
        console.log("\n📈 Sample Latest Weather Data:");
        for (const location of dummyData.locations.slice(0, 3)) {
            const latestWeather = await WeatherData.getLatestForLocation(location._id);
            if (latestWeather) {
                await latestWeather.populate(['locationId', 'timestampId']);
                console.log(`   📍 ${latestWeather.locationId.city}: ${latestWeather.temperature}°${latestWeather.temperatureType} - ${latestWeather.description}`);
            }
        }

        mongoose.connection.close();
        console.log("\n✅ Database connection closed");
        console.log("🎉 Normalized weather data import completed successfully!");
        console.log("\n💡 New Structure Benefits:");
        console.log("   - Locations are now global (no user-specific duplicates)");
        console.log("   - User-Location relationships are properly normalized");
        console.log("   - Timestamps are reusable across multiple weather records");
        console.log("   - Weather data is linked to both location and timestamp");
        console.log("   - Alerts are properly linked to all related entities");

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