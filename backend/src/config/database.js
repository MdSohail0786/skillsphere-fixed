// const mongoose = require("mongoose");
// const logger = require("../utils/logger");

// let isConnecting = false;

// const connectDB = async () => {
//   // Prevent multiple concurrent connection attempts
//   if (
//     mongoose.connection.readyState === 1 ||
//     mongoose.connection.readyState === 2
//   ) {
//     logger.info("MongoDB already connected");
//     return;
//   }
//   if (isConnecting) {
//     logger.info("MongoDB connection already in progress, waiting...");
//     while (isConnecting) {
//       await new Promise((resolve) => setTimeout(resolve, 100));
//     }
//     return;
//   }

//   isConnecting = true;
//   let uri = process.env.MONGODB_URI;

//   try {
//     // If URI is not set or running in dev/test without a real MongoDB, use in-memory server
//     if (!uri || process.env.USE_MEMORY_DB === "true") {
//       logger.info(
//         "No MONGODB_URI configured or USE_MEMORY_DB=true — starting in-memory MongoDB...",
//       );
//       const { MongoMemoryServer } = require("mongodb-memory-server");
//       const mongod = await MongoMemoryServer.create();
//       uri = mongod.getUri();
//       process.env.__MEMORY_DB_URI = uri;
//       logger.info(`In-memory MongoDB started at ${uri}`);
//     }

//     const conn = await mongoose.connect(uri);
//     logger.info(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     logger.error(`MongoDB Error: ${error.message}`);

//     // Fallback to in-memory MongoDB if real connection failed (dev mode only)
//     if (
//       process.env.NODE_ENV !== "production" &&
//       !uri.startsWith("mongodb://127.0.0.1")
//     ) {
//       logger.warn("Falling back to in-memory MongoDB server...");
//       try {
//         const { MongoMemoryServer } = require("mongodb-memory-server");
//         const mongod = await MongoMemoryServer.create();
//         const fallbackUri = mongod.getUri();
//         process.env.__MEMORY_DB_URI = fallbackUri;
//         const conn = await mongoose.connect(fallbackUri);
//         logger.info(`Connected to in-memory MongoDB: ${conn.connection.host}`);
//       } catch (fallbackError) {
//         logger.error(
//           `In-memory fallback also failed: ${fallbackError.message}`,
//         );
//         process.exit(1);
//       }
//     } else {
//       process.exit(1);
//     }
//   } finally {
//     isConnecting = false;
//   }
// };

// module.exports = connectDB;
const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Error: ${error.message}`);
    logger.warn("Starting in-memory MongoDB...");
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    logger.info("Connected to in-memory MongoDB");
  }
};

module.exports = connectDB;
