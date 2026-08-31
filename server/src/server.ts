import "dotenv/config";
import path from "node:path";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDb } from "./config/db.js";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});
app.use("/api", router);

if (process.env.NODE_ENV === "production") {
  const clientDist = path.resolve(import.meta.dirname, "../../client/dist");
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use(errorHandler);

const port = Number(process.env.PORT ?? 3000);

async function start(): Promise<void> {
  await connectDb();
  app.listen(port, () =>
    console.log(`[api] listening on http://localhost:${port}`),
  );
}

start().catch((err) => {
  console.error("[api] failed to start", err);
  process.exit(1);
});
