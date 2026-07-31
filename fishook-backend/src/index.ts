import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { initDb } from "./db/index.js";
import { initWsServer } from "./ws/index.js";
import { sessionMiddleware } from "./middleware/session.js";

import sessionRoutes from "./routes/session.js";
import webhookRoutes from "./routes/webhook.js";

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/api/v1/session", express.json(), sessionMiddleware, sessionRoutes);

app.use("/api/v1", express.json(), webhookRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function start() {
  try {
    await initDb();
    initWsServer(server);

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
