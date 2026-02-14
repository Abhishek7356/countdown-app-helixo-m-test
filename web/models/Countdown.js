import mongoose from "mongoose";

const countdownSchema = new mongoose.Schema(
    {
        shop: {
            type: String,
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            default: "",
        },

        startAt: {
            type: Date,
            required: true,
        },

        endAt: {
            type: Date,
            required: true,
        },

        bgColor: {
            type: String,
            default: "#000000",
        },

        textColor: {
            type: String,
            default: "#ffffff",
        },

        size: {
            type: String,
            default: "medium",
        },

        position: {
            type: String,
            default: "top",
        },

        urgency: {
            type: String,
            default: "pulse",
            enum: ["pulse", "banner"],
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);


countdownSchema.index({ shop: 1, isActive: 1 });

countdownSchema.index({ shop: 1, isActive: 1, startAt: 1 });

countdownSchema.index({ title: "text" });

const Countdown = mongoose.model("Countdown", countdownSchema);

export default Countdown;
