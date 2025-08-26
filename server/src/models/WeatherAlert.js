import mongoose from "mongoose";

const weatherAlertSchema = new mongoose.Schema({
    severity: {
        type: String,
        required: [true, "Severity is required"],
        enum: ['low', 'moderate', 'high', 'extreme'],
        default: 'low'
    },
    message: {
        type: String,
        required: [true, "Alert message is required"],
        trim: true
    },
    alertCondition: {
        type: String,
        required: [true, "Alert condition is required"],
        enum: ['rain', 'snow', 'extreme_heat', 'extreme_cold', 'high_wind', 'thunderstorm', 'fog', 'uv_warning'],
        trim: true
    },
    weatherDataId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WeatherData',
        required: [true, "Weather data ID is required"]
    },
    locationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: [true, "Location ID is required"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    isRead: {
        type: Boolean,
        default: false
    },
    // NEW FIELDS FOR EMAIL FUNCTIONALITY
    emailSent: {
        type: Boolean,
        default: false
    },
    emailSentAt: {
        type: Date,
        default: null
    },
    isForDefaultLocation: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Methods
weatherAlertSchema.methods.sendAlert = async function () {
    // This method would typically send notifications (email, push, etc.)
    // For now, it just marks the alert as active and returns alert data
    this.isActive = true;
    await this.save();

    return {
        id: this._id,
        severity: this.severity,
        message: this.message,
        alertCondition: this.alertCondition,
        startTime: this.startTime,
        endTime: this.endTime,
        isActive: this.isActive,
        sentAt: new Date()
    };
};

// Method to mark alert as read
weatherAlertSchema.methods.markAsRead = function () {
    this.isRead = true;
    return this.save();
};

// Method to deactivate alert
weatherAlertSchema.methods.deactivate = function () {
    this.isActive = false;
    this.endTime = new Date();
    return this.save();
};

// NEW METHOD: Mark email as sent
weatherAlertSchema.methods.markEmailAsSent = function () {
    this.emailSent = true;
    this.emailSentAt = new Date();
    return this.save();
};

// Static method to create alerts for users who have this location
weatherAlertSchema.statics.createAlertsForLocation = async function (weatherData, locationId) {
    const UserLocation = mongoose.model('UserLocation');

    // Find all users who have this location
    const userLocations = await UserLocation.find({ locationId }).populate('userId');

    const alerts = [];
    const alertConditions = await this.checkWeatherConditions(weatherData);

    for (const userLocation of userLocations) {
        for (const alertData of alertConditions) {
            const alert = new this({
                ...alertData,
                weatherDataId: weatherData._id,
                locationId: locationId,
                userId: userLocation.userId._id,
                isForDefaultLocation: userLocation.isDefault
            });

            await alert.save();
            await alert.sendAlert();
            alerts.push(alert);
        }
    }

    return alerts;
};

// NEW STATIC METHOD: Get unsent email alerts for default locations (next 24 hours)
weatherAlertSchema.statics.getUnsentEmailAlertsForDefaultLocations = async function () {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    return await this.find({
        isForDefaultLocation: true,
        emailSent: false,
        isActive: true,
        startTime: { $lte: tomorrow }
    }).populate(['userId', 'locationId', 'weatherDataId']);
};

// NEW STATIC METHOD: Get alerts for user's default location
weatherAlertSchema.statics.getAlertsForUserDefaultLocation = async function (userId, limit = 50) {
    const UserLocation = mongoose.model('UserLocation');

    // Find user's default location
    const defaultLocation = await UserLocation.findOne({ userId, isDefault: true });

    if (!defaultLocation) {
        return [];
    }

    return await this.find({
        userId,
        locationId: defaultLocation.locationId,
        isForDefaultLocation: true
    }).populate(['locationId', 'weatherDataId'])
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));
};

// Static method to check weather conditions and determine alert types
weatherAlertSchema.statics.checkWeatherConditions = async function (weatherData) {
    const alerts = [];

    // Temperature alerts
    if (weatherData.temperature > 35) {
        alerts.push({
            severity: 'high',
            message: `Extreme heat warning: ${weatherData.temperature}°${weatherData.temperatureType.charAt(0).toUpperCase()}`,
            alertCondition: 'extreme_heat'
        });
    } else if (weatherData.temperature < -10) {
        alerts.push({
            severity: 'high',
            message: `Extreme cold warning: ${weatherData.temperature}°${weatherData.temperatureType.charAt(0).toUpperCase()}`,
            alertCondition: 'extreme_cold'
        });
    }

    // Wind speed alerts
    if (weatherData.windSpeed > 50) {
        alerts.push({
            severity: 'moderate',
            message: `High wind warning: ${weatherData.windSpeed} ${weatherData.windSpeedType}`,
            alertCondition: 'high_wind'
        });
    }

    // Weather condition alerts
    const rainConditions = ['rain', 'heavy rain', 'thunderstorm'];
    const snowConditions = ['snow', 'heavy snow', 'blizzard'];

    if (rainConditions.some(condition => weatherData.description.toLowerCase().includes(condition))) {
        alerts.push({
            severity: weatherData.description.toLowerCase().includes('heavy') ? 'moderate' : 'low',
            message: `Rain alert: ${weatherData.description}`,
            alertCondition: weatherData.description.toLowerCase().includes('thunder') ? 'thunderstorm' : 'rain'
        });
    }

    if (snowConditions.some(condition => weatherData.description.toLowerCase().includes(condition))) {
        alerts.push({
            severity: 'moderate',
            message: `Snow alert: ${weatherData.description}`,
            alertCondition: 'snow'
        });
    }

    // UV Index alerts
    if (weatherData.uvIndex && weatherData.uvIndex > 8) {
        alerts.push({
            severity: 'low',
            message: `High UV warning: UV Index ${weatherData.uvIndex}`,
            alertCondition: 'uv_warning'
        });
    }

    return alerts;
};

// Index for efficient queries
weatherAlertSchema.index({ userId: 1, isActive: 1, createdAt: -1 });
weatherAlertSchema.index({ locationId: 1, alertCondition: 1 });
weatherAlertSchema.index({ weatherDataId: 1 });
// NEW INDEXES
weatherAlertSchema.index({ isForDefaultLocation: 1, emailSent: 1, startTime: 1 });
weatherAlertSchema.index({ userId: 1, isForDefaultLocation: 1 });

export default mongoose.model("WeatherAlert", weatherAlertSchema);