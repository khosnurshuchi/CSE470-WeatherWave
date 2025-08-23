import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    city: {
        type: String,
        required: [true, "City is required"],
        trim: true
    },
    country: {
        type: String,
        required: [true, "Country is required"],
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required"]
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    coordinates: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    }
}, {
    timestamps: true
});

// Methods
locationSchema.methods.setLocation = function(city, country, coordinates) {
    this.city = city;
    this.country = country;
    this.coordinates = coordinates;
    return this.save();
};

locationSchema.methods.getLocation = function() {
    return {
        id: this._id,
        city: this.city,
        country: this.country,
        coordinates: this.coordinates,
        isDefault: this.isDefault
    };
};

// Index for efficient queries
locationSchema.index({ userId: 1, city: 1, country: 1 });

export default mongoose.model("Location", locationSchema);