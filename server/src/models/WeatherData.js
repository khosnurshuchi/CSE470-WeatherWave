import mongoose from "mongoose";

const weatherDataSchema = new mongoose.Schema({
    temperature: {
        type: Number,
        required: [true, "Temperature is required"]
    },
    temperatureType: {
        type: String,
        required: [true, "Temperature type is required"],
        enum: ['celsius', 'fahrenheit'],
        default: 'celsius'
    },
    description: {
        type: String,
        required: [true, "Weather description is required"],
        trim: true
    },
    humidity: {
        type: Number,
        required: [true, "Humidity is required"],
        min: [0, "Humidity cannot be negative"],
        max: [100, "Humidity cannot exceed 100%"]
    },
    windSpeed: {
        type: Number,
        required: [true, "Wind speed is required"],
        min: [0, "Wind speed cannot be negative"]
    },
    windSpeedType: {
        type: String,
        required: [true, "Wind speed type is required"],
        enum: ['kmh', 'mph', 'ms'],
        default: 'kmh'
    },
    locationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: [true, "Location ID is required"]
    },
    icon: {
        type: String,
        trim: true
    },
    feelsLike: {
        type: Number
    },
    pressure: {
        type: Number
    },
    visibility: {
        type: Number
    },
    uvIndex: {
        type: Number
    }
}, {
    timestamps: true
});

// Methods
weatherDataSchema.methods.fetchData = async function() {
    // This method would typically fetch data from an external API
    // For now, it returns the current data
    return {
        id: this._id,
        temperature: this.temperature,
        temperatureType: this.temperatureType,
        description: this.description,
        humidity: this.humidity,
        windSpeed: this.windSpeed,
        windSpeedType: this.windSpeedType,
        icon: this.icon,
        feelsLike: this.feelsLike,
        pressure: this.pressure,
        visibility: this.visibility,
        uvIndex: this.uvIndex,
        lastUpdated: this.updatedAt
    };
};

// Method to convert temperature units
weatherDataSchema.methods.convertTemperature = function(toUnit) {
    if (this.temperatureType === toUnit) {
        return this.temperature;
    }
    
    if (this.temperatureType === 'celsius' && toUnit === 'fahrenheit') {
        return (this.temperature * 9/5) + 32;
    } else if (this.temperatureType === 'fahrenheit' && toUnit === 'celsius') {
        return (this.temperature - 32) * 5/9;
    }
    
    return this.temperature;
};

// Method to convert wind speed units
weatherDataSchema.methods.convertWindSpeed = function(toUnit) {
    if (this.windSpeedType === toUnit) {
        return this.windSpeed;
    }
    
    const conversions = {
        'kmh': { 'mph': 0.621371, 'ms': 0.277778 },
        'mph': { 'kmh': 1.60934, 'ms': 0.44704 },
        'ms': { 'kmh': 3.6, 'mph': 2.23694 }
    };
    
    return this.windSpeed * (conversions[this.windSpeedType][toUnit] || 1);
};

// Index for efficient queries
weatherDataSchema.index({ locationId: 1, createdAt: -1 });

export default mongoose.model("WeatherData", weatherDataSchema);