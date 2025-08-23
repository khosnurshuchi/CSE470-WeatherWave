import express from "express";
import Location from "../models/Location.js";
import WeatherData from "../models/WeatherData.js";
import WeatherAlert from "../models/WeatherAlert.js";
import TimeStamp from "../models/TimeStamp.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all user locations with current weather
router.get("/locations", authenticateToken, async (req, res) => {
    try {
        const locations = await Location.find({ userId: req.userId }).sort({ isDefault: -1, createdAt: -1 });
        
        const locationsWithWeather = await Promise.all(
            locations.map(async (location) => {
                const latestWeather = await WeatherData.findOne({ locationId: location._id })
                    .sort({ createdAt: -1 })
                    .limit(1);
                
                return {
                    ...location.toObject(),
                    currentWeather: latestWeather
                };
            })
        );

        res.json({
            success: true,
            data: locationsWithWeather
        });

    } catch (error) {
        console.error("Get locations error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get locations",
            error: error.message
        });
    }
});

// Add new location
router.post("/locations", authenticateToken, async (req, res) => {
    try {
        const { city, country, coordinates, isDefault = false } = req.body;

        if (!city || !country || !coordinates) {
            return res.status(400).json({
                success: false,
                message: "City, country, and coordinates are required"
            });
        }

        // Check if location already exists for this user
        const existingLocation = await Location.findOne({
            userId: req.userId,
            city: city.toLowerCase(),
            country: country.toLowerCase()
        });

        if (existingLocation) {
            return res.status(400).json({
                success: false,
                message: "Location already exists"
            });
        }

        // If this is set as default, remove default from other locations
        if (isDefault) {
            await Location.updateMany(
                { userId: req.userId },
                { isDefault: false }
            );
        }

        const location = new Location({
            city,
            country,
            coordinates,
            userId: req.userId,
            isDefault
        });

        await location.save();

        res.status(201).json({
            success: true,
            message: "Location added successfully",
            data: location
        });

    } catch (error) {
        console.error("Add location error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add location",
            error: error.message
        });
    }
});

// Remove location
router.delete("/locations/:locationId", authenticateToken, async (req, res) => {
    try {
        const { locationId } = req.params;

        const location = await Location.findOne({ 
            _id: locationId, 
            userId: req.userId 
        });

        if (!location) {
            return res.status(404).json({
                success: false,
                message: "Location not found"
            });
        }

        // Delete associated weather data and alerts
        await WeatherData.deleteMany({ locationId });
        await WeatherAlert.deleteMany({ locationId });
        await Location.findByIdAndDelete(locationId);

        res.json({
            success: true,
            message: "Location removed successfully"
        });

    } catch (error) {
        console.error("Remove location error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to remove location",
            error: error.message
        });
    }
});

// Set default location
router.put("/locations/:locationId/default", authenticateToken, async (req, res) => {
    try {
        const { locationId } = req.params;

        // Remove default from all locations
        await Location.updateMany(
            { userId: req.userId },
            { isDefault: false }
        );

        // Set new default
        const location = await Location.findOneAndUpdate(
            { _id: locationId, userId: req.userId },
            { isDefault: true },
            { new: true }
        );

        if (!location) {
            return res.status(404).json({
                success: false,
                message: "Location not found"
            });
        }

        res.json({
            success: true,
            message: "Default location updated",
            data: location
        });

    } catch (error) {
        console.error("Set default location error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to set default location",
            error: error.message
        });
    }
});

// Get weather data for specific location
router.get("/locations/:locationId/weather", authenticateToken, async (req, res) => {
    try {
        const { locationId } = req.params;
        const { unit = 'celsius' } = req.query;

        const location = await Location.findOne({ 
            _id: locationId, 
            userId: req.userId 
        });

        if (!location) {
            return res.status(404).json({
                success: false,
                message: "Location not found"
            });
        }

        const weatherData = await WeatherData.findOne({ locationId })
            .sort({ createdAt: -1 })
            .populate('locationId');

        if (!weatherData) {
            return res.status(404).json({
                success: false,
                message: "No weather data found for this location"
            });
        }

        // Convert temperature and wind speed if needed
        const convertedWeather = {
            ...weatherData.toObject(),
            temperature: weatherData.convertTemperature(unit),
            temperatureType: unit,
            feelsLike: weatherData.feelsLike ? 
                (unit === weatherData.temperatureType ? weatherData.feelsLike : 
                 (unit === 'celsius' ? (weatherData.feelsLike - 32) * 5/9 : (weatherData.feelsLike * 9/5) + 32)) : null
        };

        res.json({
            success: true,
            data: convertedWeather
        });

    } catch (error) {
        console.error("Get weather error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get weather data",
            error: error.message
        });
    }
});

// Get hourly weather trends for location
router.get("/locations/:locationId/hourly", authenticateToken, async (req, res) => {
    try {
        const { locationId } = req.params;
        const { unit = 'celsius', hours = 24 } = req.query;

        const location = await Location.findOne({ 
            _id: locationId, 
            userId: req.userId 
        });

        if (!location) {
            return res.status(404).json({
                success: false,
                message: "Location not found"
            });
        }

        const hoursAgo = new Date(Date.now() - (hours * 60 * 60 * 1000));
        
        const hourlyData = await WeatherData.find({ 
            locationId,
            createdAt: { $gte: hoursAgo }
        }).sort({ createdAt: -1 }).limit(parseInt(hours));

        const convertedData = hourlyData.map(data => ({
            ...data.toObject(),
            temperature: data.convertTemperature(unit),
            temperatureType: unit,
            feelsLike: data.feelsLike ? data.convertTemperature(unit) : null
        }));

        res.json({
            success: true,
            data: convertedData
        });

    } catch (error) {
        console.error("Get hourly trends error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get hourly weather trends",
            error: error.message
        });
    }
});

// Get weather alerts
router.get("/alerts", authenticateToken, async (req, res) => {
    try {
        const { isActive = true, limit = 50 } = req.query;
        
        const query = { userId: req.userId };
        if (isActive !== 'all') {
            query.isActive = isActive === 'true';
        }

        const alerts = await WeatherAlert.find(query)
            .populate('locationId', 'city country')
            .populate('weatherDataId', 'temperature description')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: alerts
        });

    } catch (error) {
        console.error("Get alerts error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get weather alerts",
            error: error.message
        });
    }
});

// Mark alert as read
router.put("/alerts/:alertId/read", authenticateToken, async (req, res) => {
    try {
        const { alertId } = req.params;

        const alert = await WeatherAlert.findOne({ 
            _id: alertId, 
            userId: req.userId 
        });

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: "Alert not found"
            });
        }

        await alert.markAsRead();

        res.json({
            success: true,
            message: "Alert marked as read"
        });

    } catch (error) {
        console.error("Mark alert as read error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark alert as read",
            error: error.message
        });
    }
});

// Dismiss alert
router.put("/alerts/:alertId/dismiss", authenticateToken, async (req, res) => {
    try {
        const { alertId } = req.params;

        const alert = await WeatherAlert.findOne({ 
            _id: alertId, 
            userId: req.userId 
        });

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: "Alert not found"
            });
        }

        await alert.deactivate();

        res.json({
            success: true,
            message: "Alert dismissed"
        });

    } catch (error) {
        console.error("Dismiss alert error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to dismiss alert",
            error: error.message
        });
    }
});

// Update weather data (simulate fetching new data)
router.post("/locations/:locationId/update", authenticateToken, async (req, res) => {
    try {
        const { locationId } = req.params;
        const weatherUpdate = req.body;

        const location = await Location.findOne({ 
            _id: locationId, 
            userId: req.userId 
        });

        if (!location) {
            return res.status(404).json({
                success: false,
                message: "Location not found"
            });
        }

        // Create new weather data
        const weatherData = new WeatherData({
            ...weatherUpdate,
            locationId
        });

        await weatherData.save();

        // Create timestamp
        const timestamp = new TimeStamp({
            weatherDataId: weatherData._id
        });

        await timestamp.save();

        // Check for alerts
        const alertConditions = await WeatherAlert.checkAndCreateAlerts(weatherData);
        
        for (const alertData of alertConditions) {
            const alert = new WeatherAlert({
                ...alertData,
                userId: req.userId
            });
            await alert.save();
            await alert.sendAlert();
        }

        res.json({
            success: true,
            message: "Weather data updated successfully",
            data: weatherData,
            alerts: alertConditions.length
        });

    } catch (error) {
        console.error("Update weather error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update weather data",
            error: error.message
        });
    }
});

export default router;