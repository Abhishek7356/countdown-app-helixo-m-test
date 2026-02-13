import mongoose from "mongoose";

const countdownSchema = new mongoose.Schema(
    {
        shop: {
            type: String,
            required: true,
            index: true,
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
            index: true,
        },

        endAt: {
            type: Date,
            required: true,
            index: true,
        },

        bgColor: {
            type: String,
            default: "#000000",
        },

        textColor: {
            type: String,
            default: "#ffffff",
        },

        fontSize: {
            type: String,
            default: "16px",
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
            default: "none",
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Countdown = mongoose.model("Countdown", countdownSchema);

export default Countdown;
