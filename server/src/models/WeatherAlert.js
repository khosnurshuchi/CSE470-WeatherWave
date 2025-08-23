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
    }
}, {
    timestamps: true
});

// Methods
weatherAlertSchema.methods.sendAlert = async function() {
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
weatherAlertSchema.methods.markAsRead = function() {
    this.isRead = true;
    return this.save();
};

// Method to deactivate alert
weatherAlertSchema.methods.deactivate = function() {
    this.isActive = false;
    this.endTime = new Date();
    return this.save();
};

// Static method to create alert based on weather conditions
weatherAlertSchema.statics.checkAndCreateAlerts = async function(weatherData) {
    const alerts = [];
    
    // Temperature alerts
    if (weatherData.temperature > 35) {
        alerts.push({
            severity: 'high',
            message: `Extreme heat warning: ${weatherData.temperature}°${weatherData.temperatureType.charAt(0).toUpperCase()}`,
            alertCondition: 'extreme_heat',
            weatherDataId: weatherData._id,
            locationId: weatherData.locationId
        });
    } else if (weatherData.temperature < -10) {
        alerts.push({
            severity: 'high',
            message: `Extreme cold warning: ${weatherData.temperature}°${weatherData.temperatureType.charAt(0).toUpperCase()}`,
            alertCondition: 'extreme_cold',
            weatherDataId: weatherData._id,
            locationId: weatherData.locationId
        });
    }
    
    // Wind speed alerts
    if (weatherData.windSpeed > 50) {
        alerts.push({
            severity: 'moderate',
            message: `High wind warning: ${weatherData.windSpeed} ${weatherData.windSpeedType}`,
            alertCondition: 'high_wind',
            weatherDataId: weatherData._id,
            locationId: weatherData.locationId
        });
    }
    
    // Weather condition alerts
    const rainConditions = ['rain', 'heavy rain', 'thunderstorm'];
    const snowConditions = ['snow', 'heavy snow', 'blizzard'];
    
    if (rainConditions.some(condition => weatherData.description.toLowerCase().includes(condition))) {
        alerts.push({
            severity: 'low',
            message: `Rain alert: ${weatherData.description}`,
            alertCondition: weatherData.description.toLowerCase().includes('thunder') ? 'thunderstorm' : 'rain',
            weatherDataId: weatherData._id,
            locationId: weatherData.locationId
        });
    }
    
    if (snowConditions.some(condition => weatherData.description.toLowerCase().includes(condition))) {
        alerts.push({
            severity: 'moderate',
            message: `Snow alert: ${weatherData.description}`,
            alertCondition: 'snow',
            weatherDataId: weatherData._id,
            locationId: weatherData.locationId
        });
    }
    
    return alerts;
};

// Index for efficient queries
weatherAlertSchema.index({ userId: 1, isActive: 1, createdAt: -1 });
weatherAlertSchema.index({ locationId: 1, alertCondition: 1 });

export default mongoose.model("WeatherAlert", weatherAlertSchema);