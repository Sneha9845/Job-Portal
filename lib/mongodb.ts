// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents connections growing exponentially during API Route usage.
 */
declare global {
    var mongoose: any; // This must be a var and not a let / const
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
    console.log("dbConnect called");
    if (cached.conn) {
        console.log("Using cached connection");
        return cached.conn;
    }

    if (!cached.promise) {
        console.log("No cached promise, creating new connection to:", (MONGODB_URI as string).split('@')[1] || "HIDDEN_URI"); // Log part of URI for debug safety
        const opts = {
            bufferCommands: false,
        } as mongoose.ConnectOptions;

        cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
            console.log("Mongoose connected successfully");
            return mongoose;
        }).catch(err => {
            console.error("Mongoose connection error:", err);
            throw err;
        });
    }
    console.log("Awaiting connection promise...");
    cached.conn = await cached.promise;
    console.log("Connection established");
    return cached.conn;
}

export default dbConnect;
