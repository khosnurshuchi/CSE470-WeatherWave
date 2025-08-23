import mongoose from "mongoose";

const timeStampSchema = new mongoose.Schema({
    time: {
        type: Date,
        required: [true, "Time is required"],
        default: Date.now
    },
    weatherDataId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WeatherData',
        required: true
    }
}, {
    timestamps: true
});

// Methods
timeStampSchema.methods.setTime = function(time) {
    this.time = time || new Date();
    return this.save();
};

timeStampSchema.methods.getTime = function() {
    return {
        id: this._id,
        time: this.time,
        formattedTime: this.time.toISOString()
    };
};

// Index for efficient queries
timeStampSchema.index({ weatherDataId: 1, time: -1 });

export default mongoose.model("TimeStamp", timeStampSchema);