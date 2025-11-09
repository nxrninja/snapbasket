import mongoose from "mongoose";

let isConnected = false;

export const dbConnect = async (params) => {
    // If already connected, return
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log("Database already connected");
        return;
    }

    try {
        const dbUri = process.env.NODE_ENV === 'production' 
            ? process.env.PRODUCTION_DB_URI 
            : process.env.DEVLOPMENT_DB_URI;

        if (!dbUri) {
            console.error("Database URI is not set in environment variables");
            throw new Error("Database URI is missing");
        }

        await mongoose.connect(dbUri, {
            authSource: 'admin'
        });
        
        isConnected = true;
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        // Don't exit in serverless - let the function handle the error
        // process.exit(1); // Removed for serverless compatibility
        throw error;
    }
}

