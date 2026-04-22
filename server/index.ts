import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { progress } from "./routes/progress";
import { attempts } from "./routes/attempts";
import { srs } from "./routes/srs";
import { mock } from "./routes/mock";
import "./db"; // side-effect: initializes sqlite

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "http://localhost:4173"],
    credentials: true,
  }),
);

app.route("/api/progress", progress);
app.route("/api/attempts", attempts);
app.route("/api/srs", srs);
app.route("/api/mock", mock);

app.get("/api/health", (c) => c.json({ ok: true }));

const port = parseInt(process.env.PORT ?? "3001");

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`[server] running on http://localhost:${port}`);