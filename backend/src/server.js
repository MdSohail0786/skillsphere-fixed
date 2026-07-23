require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const passport = require("./config/passport");
const connectDB = require("./config/database");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const socketHandler = require("./socket/socketHandler");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const freelancerRoutes = require("./routes/freelancers");
const gigRoutes = require("./routes/gigs");
const jobRoutes = require("./routes/jobs");
const proposalRoutes = require("./routes/proposals");
const projectRoutes = require("./routes/projects");
const chatRoutes = require("./routes/chat");
const paymentRoutes = require("./routes/payments");
const reviewRoutes = require("./routes/reviews");
const notificationRoutes = require("./routes/notifications");
const aiRoutes = require("./routes/ai");
const adminRoutes = require("./routes/admin");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
});
socketHandler(io);
app.set("io", io);

app.use(
  helmet({ crossOriginEmbedderPolicy: false, contentSecurityPolicy: false }),
);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: "Too many requests" },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many auth attempts" },
});
app.use("/api/", limiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/signup", authLimiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(mongoSanitize());
app.use(compression());
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}
app.use(passport.initialize());

app.get("/health", (req, res) =>
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/freelancers", freelancerRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) =>
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  }),
);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const tryListen = (server, port, resolve, reject) => {
  server.once("error", (err) => {
    if (err.code === "EADDRINUSE") {
      logger.warn(`Port ${port} is in use, trying port ${port + 1}...`);
      tryListen(server, port + 1, resolve, reject);
    } else {
      reject(err);
    }
  });
  server.listen(port, () => {
    logger.info(
      `🚀 SkillSphere Backend running on port ${port} [${process.env.NODE_ENV}]`,
    );
    logger.info(`📡 Socket.IO ready`);
    logger.info(`🏥 Health: http://localhost:${port}/health`);
    resolve(port);
  });
};

const startServer = async () => {
  try {
    await connectDB();
    return new Promise((resolve, reject) => {
      tryListen(server, PORT, resolve, reject);
    });
  } catch (err) {
    logger.error("Server start failed:", err);
    process.exit(1);
  }
};

startServer();

process.on("SIGTERM", () => {
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
});

module.exports = { app, server };
