import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
    {
        shopUrl: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        accessToken: {
            type: String,
            required: true,
        },

        installedAt: {
            type: Date,
            default: Date.now,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);


storeSchema.index({ shopUrl: 1 }, { unique: true });

const Store = mongoose.model("Store", storeSchema);

export default Store;
