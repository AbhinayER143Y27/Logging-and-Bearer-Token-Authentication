import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

// 🔹 Custom Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 🔹 Bearer Token Authentication Middleware
function authMiddleware(req, res, next) {
  const header = req.headers["authorization"];
  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ message: "Missing or invalid token" });

  const token = header.split(" ")[1];
  if (token !== process.env.AUTH_TOKEN)
    return res.status(403).json({ message: "Unauthorized access" });

  next();
}

// Public Route
app.get("/", (req, res) => {
  res.send("Public route: no token required");
});

// Protected Route
app.get("/secure", authMiddleware, (req, res) => {
  res.send("✅ Access granted to secure route");
});

// Start server
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
