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
locationSchema.methods.getLocation = function () {
    return {
        id: this._id,
        city: this.city,
        country: this.country,
        coordinates: this.coordinates
    };
};

// Static method to find or create location
locationSchema.statics.findOrCreate = async function (city, country, coordinates) {
    let location = await this.findOne({
        city: city.trim(),
        country: country.trim()
    });

    if (!location) {
        location = await this.create({
            city: city.trim(),
            country: country.trim(),
            coordinates
        });
    }

    return location;
};

// Index for efficient queries
locationSchema.index({ city: 1, country: 1 }, { unique: true });

export default mongoose.model("Location", locationSchema);