/**
 * Robust HTTP server with logging, security, and graceful shutdown.
 * @module server
 * @author Kwanele
 * @version 2.1.0
 */

const http = require("http");
const httpStatus = require("http-status-codes");
const logger = require("./logger");

const PORT = process.env.PORT || 3000;

// In-memory rate limiting store
const ipHits = {};
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_HITS = 100;

// Simple cleanup every 15 mins to prevent memory leak
setInterval(() => {
  for (let ip in ipHits) {
    if (Date.now() - ipHits[ip].start > WINDOW_MS) delete ipHits[ip];
  }
}, WINDOW_MS);

// Utility: Set secure headers
function setSecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
}

const server = http.createServer((req, res) => {
  try {
    const ip = req.socket.remoteAddress;
    logger.info(`${req.method} ${req.url} – Incoming from ${ip}`);

    // Rate Limiting (for /login route)
    if (req.url === "/login") {
      const now = Date.now();
      if (!ipHits[ip]) {
        ipHits[ip] = { count: 1, start: now };
      } else {
        ipHits[ip].count++;
        if (ipHits[ip].count > MAX_HITS && now - ipHits[ip].start < WINDOW_MS) {
          res.writeHead(httpStatus.TOO_MANY_REQUESTS, { "Content-Type": "text/plain" });
          res.end("Too many requests. Try again later.");
          logger.warn(`Rate limit hit for ${ip}`);
          return;
        }
      }
    }

    // Set Security Headers
    setSecurityHeaders(res);

    // Routes
    if (req.url === "/health") {
      res.writeHead(httpStatus.OK, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "OK" }));
      return;
    }

    if (req.url === "/") {
      const body = "<h1>Hello, Universe!</h1>";
      res.writeHead(httpStatus.OK, { "Content-Type": "text/html" });
      res.end(body);
      logger.info(`Response sent (${body.length} bytes)`);
      return;
    }

    // 404 Not Found
    res.writeHead(httpStatus.NOT_FOUND, { "Content-Type": "text/plain" });
    res.end("Not Found");

  } catch (err) {
    logger.error(`Server error: ${err.message}`);
    res.writeHead(httpStatus.INTERNAL_SERVER_ERROR);
    res.end("Internal Server Error");
  }
});

// Graceful shutdown
const shutdown = () => {
  logger.info("Shutting down gracefully...");
  server.close(() => {
    logger.info("Server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  shutdown();
});
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  shutdown();
});

// Start server
server.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});
