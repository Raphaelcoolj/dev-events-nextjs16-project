import mongoose from 'mongoose';

// Define the shape of our cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global type to include our mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Initialize the cached connection object
let cached: MongooseCache = global.mongoose || {
  conn: null,
  promise: null,
};

// Cache the connection globally to prevent multiple connections in development
if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes and returns a cached MongoDB connection using Mongoose.
 * Reuses existing connections to prevent connection exhaustion in serverless environments.
 * 
 * @returns {Promise<typeof mongoose>} The Mongoose instance with an active connection
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection promise if one doesn't exist
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable command buffering for better error handling
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    // Wait for the connection to establish and cache it
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise on error to allow retry on next call
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
