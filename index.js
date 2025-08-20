import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import session from "express-session";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if database connection fails
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

const app = express();

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: true,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
  }
};

if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    ...sessionOptions.cookie,
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}

app.use(session(sessionOptions));
const allowedOrigins = [
  process.env.NETLIFY_URL,
  process.env.FRONTEND_URL,
  process.env.LOCAL_FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  // Add your specific Netlify URL
  "https://a6--anand-kambaz.netlify.app",
  // Allow all Netlify preview URLs
  /^https:\/\/.*--anand-kambaz\.netlify\.app$/,
].filter(Boolean);

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      // Allow localhost for development
      const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
      if (isLocalhost) {
        return callback(null, true);
      }
      
      // Check against allowed origins
      for (const allowedOrigin of allowedOrigins) {
        if (typeof allowedOrigin === 'string' && allowedOrigin === origin) {
          return callback(null, true);
        }
        if (allowedOrigin instanceof RegExp && allowedOrigin.test(origin)) {
          return callback(null, true);
        }
      }
      
      // For production, allow all Netlify domains
      if (process.env.NODE_ENV === 'production' && origin.includes('netlify.app')) {
        return callback(null, true);
      }
      
      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

// Debug endpoint to check environment variables
app.get("/debug/env", (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    NODE_SERVER_DOMAIN: process.env.NODE_SERVER_DOMAIN,
    SESSION_SECRET: process.env.SESSION_SECRET ? "SET" : "NOT SET",
    NETLIFY_URL: process.env.NETLIFY_URL
  });
});

// Debug endpoint to check active sessions
app.get("/debug/sessions", (req, res) => {
  const store = req.sessionStore;
  store.all((err, sessions) => {
    if (err) {
      res.status(500).json({ error: "Failed to get sessions" });
      return;
    }
    
    const sessionInfo = Object.entries(sessions).map(([sessionId, session]) => ({
      sessionId: sessionId.substring(0, 8) + "...",
      userId: session.currentUser?._id,
      username: session.currentUser?.username,
      createdAt: session.cookie?.originalMaxAge
    }));
    
    res.json({
      totalSessions: Object.keys(sessions).length,
      sessions: sessionInfo
    });
  });
});

Lab5(app);
Hello(app);
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
EnrollmentsRoutes(app);
AssignmentsRoutes(app);
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
