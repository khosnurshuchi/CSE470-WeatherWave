import mongoose from "mongoose";

const userLocationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required"]
    },
    locationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: [true, "Location ID is required"]
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    nickname: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Methods
userLocationSchema.methods.setAsDefault = async function () {
    // Remove default from all user's other locations
    await this.constructor.updateMany(
        { userId: this.userId, _id: { $ne: this._id } },
        { isDefault: false }
    );

    // Set this as default
    this.isDefault = true;
    return this.save();
};

// Static method to get user's locations with weather data
userLocationSchema.statics.getUserLocationsWithWeather = async function (userId) {
    return await this.find({ userId })
        .populate('locationId')
        .sort({ isDefault: -1, createdAt: -1 });
};

// Static method to add location for user
userLocationSchema.statics.addLocationForUser = async function (userId, locationId, isDefault = false, nickname = null) {
    // Check if user already has this location
    const existing = await this.findOne({ userId, locationId });
    if (existing) {
        throw new Error('Location already added for this user');
    }

    // If this is set as default, remove default from other locations
    if (isDefault) {
        await this.updateMany(
            { userId },
            { isDefault: false }
        );
    }

    return await this.create({
        userId,
        locationId,
        isDefault,
        nickname
    });
};

// Compound unique index to prevent duplicate user-location pairs
userLocationSchema.index({ userId: 1, locationId: 1 }, { unique: true });
userLocationSchema.index({ userId: 1, isDefault: 1 });

export default mongoose.model("UserLocation", userLocationSchema);