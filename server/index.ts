import express, { type Request, Response, NextFunction } from "express";
import http from "http";
import https from "https";
import { URL } from "url";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Dev proxy for NGO dashboard at /ngo-dashboard -> http://localhost:8080
// Keeps same-origin when main app runs on port 5000
app.use("/ngo-dashboard", (req: Request, res: Response) => {
  const target = new URL("http://localhost:5174/");
  const isHttps = target.protocol === "https:";
  const client = isHttps ? https : http;

  const upstreamReq = client.request(
    {
      hostname: target.hostname,
      port: target.port || (isHttps ? 443 : 80),
      method: req.method,
      path: req.originalUrl.replace(/^\/ngo-dashboard/, "" ) || "/",
      headers: {
        ...req.headers,
        host: target.host,
      },
    },
    (upstreamRes) => {
      res.writeHead(upstreamRes.statusCode || 502, upstreamRes.headers as any);
      upstreamRes.pipe(res);
    },
  );

  upstreamReq.on("error", () => {
    res.status(502).send("NGO dashboard dev server is not reachable on http://localhost:8080");
  });

  if (req.readable) {
    req.pipe(upstreamReq);
  } else {
    upstreamReq.end();
  }
});

// Serve static fallback of NGO dashboard build at /ngo-dashboard in production
app.use("/ngo-static", (req: Request, res: Response, next: NextFunction) => {
  const baseDir = path.resolve(import.meta.dirname, "..", "Ngo dashboard");
  const filePath = path.join(baseDir, req.path.replace(/^\/+ngo-static\/?/, ""));
  const resolvedPath = path.normalize(filePath);
  if (!resolvedPath.startsWith(baseDir)) {
    return res.status(400).send("Invalid path");
  }
  const target = fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()
    ? resolvedPath
    : path.join(baseDir, "index.html");
  res.sendFile(target);
});

// In production, serve the built NGO dashboard directly under /ngo-dashboard
if (process.env.NODE_ENV === 'production') {
  const ngoDistPath = path.resolve(import.meta.dirname, "..", "Ngo dashboard", "com-aid-system-main", "dist");
  if (fs.existsSync(ngoDistPath)) {
    app.use("/ngo-dashboard", express.static(ngoDistPath));
  }
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, "localhost", () => {
    log(`serving on port ${port}`);
  });
})();
