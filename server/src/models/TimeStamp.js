import mongoose from "mongoose";

const timeStampSchema = new mongoose.Schema({
    time: {
        type: Date,
        required: [true, "Time is required"],
        unique: true
    }
}, {
    timestamps: true
});

// Methods
timeStampSchema.methods.getTime = function () {
    return {
        id: this._id,
        time: this.time,
        formattedTime: this.time.toISOString()
    };
};

// Static method to find or create timestamp
timeStampSchema.statics.findOrCreate = async function (time) {
    let timestamp = await this.findOne({ time });

    if (!timestamp) {
        timestamp = await this.create({ time });
    }

    return timestamp;
};

// Static method to get timestamps within range
timeStampSchema.statics.getTimeRange = async function (startTime, endTime) {
    return await this.find({
        time: {
            $gte: startTime,
            $lte: endTime
        }
    }).sort({ time: 1 });
};

// Index for efficient queries
timeStampSchema.index({ time: 1 });

export default mongoose.model("TimeStamp", timeStampSchema);