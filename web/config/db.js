import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/countdown-app";

        if (!mongoURI) {
            throw new Error("MONGO_URI not defined in .env");
        }

        await mongoose.connect(mongoURI);

        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error.message);
        process.exit(1); // stop server if DB fails
    }
};

export default connectDB;
