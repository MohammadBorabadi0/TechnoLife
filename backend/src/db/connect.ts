import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        // Get the MongoDB URI from environment variables
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            throw new Error(
                "MONGO_URI is not defined in the environment variables."
            );
        }

        // Connect to MongoDB
        await mongoose.connect(mongoURI);

        console.log("Connected To MongoDB");
    } catch (err) {
        console.error("MongoDB connection failed", err);
        process.exit(1);
    }
};

export default connectDB;
