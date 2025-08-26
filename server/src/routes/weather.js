import express from "express";
import Location from "../models/Location.js";
import UserLocation from "../models/UserLocation.js";
import WeatherData from "../models/WeatherData.js";
import WeatherAlert from "../models/WeatherAlert.js";
import TimeStamp from "../models/TimeStamp.js";
import { authenticateToken } from "../middleware/auth.js";
import { processPendingWeatherAlerts } from "../utils/emailService.js";

const router = express.Router();

// Get all user locations with current weather
router.get("/locations", authenticateToken, async (req, res) => {
    try {
        const userLocations = await UserLocation.find({ userId: req.userId })
            .populate('locationId')
            .sort({ isDefault: -1, createdAt: -1 });

        const locationsWithWeather = await Promise.all(
            userLocations.map(async (userLocation) => {
                const latestWeather = await WeatherData.getLatestForLocation(userLocation.locationId._id);

                return {
                    userLocationId: userLocation._id,
                    location: userLocation.locationId,
                    isDefault: userLocation.isDefault,
                    nickname: userLocation.nickname,
                    addedAt: userLocation.createdAt,
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

// Add new location for user
router.post("/locations", authenticateToken, async (req, res) => {
    try {
        const { city, country, coordinates, isDefault = false, nickname } = req.body;

        if (!city || !country || !coordinates) {
            return res.status(400).json({
                success: false,
                message: "City, country, and coordinates are required"
            });
        }

        // Find or create the location in the global locations table
        const location = await Location.findOrCreate(city, country, coordinates);

        try {
            // Add the location for this user
            const userLocation = await UserLocation.addLocationForUser(
                req.userId,
                location._id,
                isDefault,
                nickname
            );

            await userLocation.populate('locationId');

            res.status(201).json({
                success: true,
                message: "Location added successfully",
                data: {
                    userLocationId: userLocation._id,
                    location: userLocation.locationId,
                    isDefault: userLocation.isDefault,
                    nickname: userLocation.nickname,
                    addedAt: userLocation.createdAt
                }
            });

        } catch (userLocationError) {
            if (userLocationError.message.includes('already added')) {
                return res.status(400).json({
                    success: false,
                    message: "Location already exists in your list"
                });
            }
            throw userLocationError;
        }

    } catch (error) {
        console.error("Add location error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add location",
            error: error.message
        });
    }
});

// Remove location from user's list
router.delete("/locations/:userLocationId", authenticateToken, async (req, res) => {
    try {
        const { userLocationId } = req.params;

        const userLocation = await UserLocation.findOne({
            _id: userLocationId,
            userId: req.userId
        });

        if (!userLocation) {
            return res.status(404).json({
                success: false,
                message: "Location not found in your list"
            });
        }

        // Delete user's alerts for this location
        await WeatherAlert.deleteMany({
            locationId: userLocation.locationId,
            userId: req.userId
        });

        // Remove from user's location list
        await UserLocation.findByIdAndDelete(userLocationId);

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
router.put("/locations/:userLocationId/default", authenticateToken, async (req, res) => {
    try {
        const { userLocationId } = req.params;

        const userLocation = await UserLocation.findOne({
            _id: userLocationId,
            userId: req.userId
        });

        if (!userLocation) {
            return res.status(404).json({
                success: false,
                message: "Location not found"
            });
        }

        await userLocation.setAsDefault();
        await userLocation.populate('locationId');

        res.json({
            success: true,
            message: "Default location updated",
            data: {
                userLocationId: userLocation._id,
                location: userLocation.locationId,
                isDefault: userLocation.isDefault,
                nickname: userLocation.nickname
            }
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

        // Verify user has access to this location
        const userLocation = await UserLocation.findOne({
            locationId,
            userId: req.userId
        }).populate('locationId');

        if (!userLocation) {
            return res.status(404).json({
                success: false,
                message: "Location not found in your list"
            });
        }

        const weatherData = await WeatherData.getLatestForLocation(locationId);

        if (!weatherData) {
            return res.status(404).json({
                success: false,
                message: "No weather data found for this location"
            });
        }

        await weatherData.populate(['locationId', 'timestampId']);

        // Convert temperature and wind speed if needed
        const convertedWeather = {
            ...weatherData.toObject(),
            temperature: weatherData.convertTemperature(unit),
            temperatureType: unit,
            feelsLike: weatherData.feelsLike ?
                weatherData.convertTemperature(unit) : null,
            location: weatherData.locationId,
            timestamp: weatherData.timestampId
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

// UPDATED: Get hourly weather trends for location (enhanced with better data handling)
router.get("/locations/:locationId/hourly", authenticateToken, async (req, res) => {
    try {
        const { locationId } = req.params;
        const { unit = 'celsius', hours = 24 } = req.query;

        // Verify user has access to this location
        const userLocation = await UserLocation.findOne({
            locationId,
            userId: req.userId
        }).populate('locationId');

        if (!userLocation) {
            return res.status(404).json({
                success: false,
                message: "Location not found in your list"
            });
        }

        const hoursAgo = new Date(Date.now() - (hours * 60 * 60 * 1000));
        const now = new Date();

        const hourlyData = await WeatherData.getLocationHistory(locationId, hoursAgo, now, parseInt(hours));

        const convertedData = hourlyData.map(data => {
            const convertedTemp = unit === data.temperatureType ? data.temperature :
                (unit === 'celsius' ? (data.temperature - 32) * 5 / 9 : (data.temperature * 9 / 5) + 32);

            const convertedFeelsLike = data.feelsLike && unit !== data.temperatureType ?
                (unit === 'celsius' ? (data.feelsLike - 32) * 5 / 9 : (data.feelsLike * 9 / 5) + 32) :
                data.feelsLike;

            return {
                ...data,
                temperature: Math.round(convertedTemp * 10) / 10, // Round to 1 decimal
                temperatureType: unit,
                feelsLike: convertedFeelsLike ? Math.round(convertedFeelsLike * 10) / 10 : null,
                hourLabel: new Date(data.timestamp.time).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }),
                dateLabel: new Date(data.timestamp.time).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                })
            };
        });

        res.json({
            success: true,
            data: convertedData,
            meta: {
                location: userLocation.locationId,
                totalRecords: convertedData.length,
                timeRange: {
                    from: hoursAgo.toISOString(),
                    to: now.toISOString()
                },
                unit
            }
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
            .populate({
                path: 'weatherDataId',
                select: 'temperature description',
                populate: {
                    path: 'timestampId',
                    select: 'time'
                }
            })
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

// NEW ROUTE: Get weather alerts for user's default location
router.get("/alerts/default-location", authenticateToken, async (req, res) => {
    try {
        const { limit = 50 } = req.query;

        const alerts = await WeatherAlert.getAlertsForUserDefaultLocation(req.userId, limit);

        if (alerts.length === 0) {
            return res.json({
                success: true,
                message: "No alerts found for your default location",
                data: []
            });
        }

        // Group alerts by date for better presentation
        const alertsByDate = alerts.reduce((acc, alert) => {
            const date = new Date(alert.createdAt).toDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(alert);
            return acc;
        }, {});

        res.json({
            success: true,
            data: alerts,
            groupedByDate: alertsByDate,
            meta: {
                totalAlerts: alerts.length,
                unreadCount: alerts.filter(alert => !alert.isRead).length,
                activeCount: alerts.filter(alert => alert.isActive).length,
                emailSentCount: alerts.filter(alert => alert.emailSent).length
            }
        });

    } catch (error) {
        console.error("Get default location alerts error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get alerts for default location",
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

// NEW ROUTE: Process pending email alerts (manual trigger for testing)
router.post("/alerts/process-emails", authenticateToken, async (req, res) => {
    try {
        console.log("Manual trigger for processing weather alert emails");

        const result = await processPendingWeatherAlerts();

        res.json({
            success: true,
            message: "Email processing completed",
            data: result
        });

    } catch (error) {
        console.error("Process email alerts error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to process email alerts",
            error: error.message
        });
    }
});

// Update weather data (simulate fetching new data from weather API)
router.post("/locations/:locationId/update", authenticateToken, async (req, res) => {
    try {
        const { locationId } = req.params;
        const weatherUpdate = req.body;

        // Verify user has access to this location
        const userLocation = await UserLocation.findOne({
            locationId,
            userId: req.userId
        });

        if (!userLocation) {
            return res.status(404).json({
                success: false,
                message: "Location not found in your list"
            });
        }

        // Create or get timestamp
        const timestamp = await TimeStamp.findOrCreate(new Date());

        // Create new weather data
        const weatherData = new WeatherData({
            ...weatherUpdate,
            locationId,
            timestampId: timestamp._id
        });

        await weatherData.save();

        // Create alerts for all users who have this location
        const alerts = await WeatherAlert.createAlertsForLocation(weatherData, locationId);

        // NEW: Trigger email processing for urgent alerts
        if (alerts.some(alert => ['high', 'extreme'].includes(alert.severity))) {
            console.log("🚨 High/Extreme alerts detected, processing emails...");
            try {
                await processPendingWeatherAlerts();
            } catch (emailError) {
                console.error("Email processing failed:", emailError);
                // Don't fail the weather update if email fails
            }
        }

        res.json({
            success: true,
            message: "Weather data updated successfully",
            data: await weatherData.fetchData(),
            alertsCreated: alerts.length
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

// Get all available locations (for search/autocomplete)
router.get("/search", authenticateToken, async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Search query must be at least 2 characters"
            });
        }

        const locations = await Location.find({
            $or: [
                { city: { $regex: q, $options: 'i' } },
                { country: { $regex: q, $options: 'i' } }
            ]
        }).limit(10);

        res.json({
            success: true,
            data: locations
        });

    } catch (error) {
        console.error("Search locations error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to search locations",
            error: error.message
        });
    }
});

// Get all available locations
router.get("/locations/all", authenticateToken, async (req, res) => {
    try {
        const locations = await Location.find({}).sort({ country: 1, city: 1 });

        res.json({
            success: true,
            data: locations
        });

    } catch (error) {
        console.error("Get all locations error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get all locations",
            error: error.message
        });
    }
});

export default router;