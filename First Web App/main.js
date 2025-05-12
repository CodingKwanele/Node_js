/**
 * @module main
 * @description Entry point for Confetti Cuisine web application
 * @version 2.1
 * @author Kwanele Dladla
 * @date 2025-04-30
 */

require('dotenv').config();
const http = require('http');
const path = require('path');
const httpStatus = require('http-status-codes');
const router = require('./router');
const utils = require('./utils');

// Configuration
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

// Create HTTP server
const server = http.createServer(async (req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  try {
    // Serve static files (CSS, JS, images, etc.)
    if (
      req.url.startsWith('/css/') ||
      req.url.startsWith('/js/') ||
      req.url.startsWith('/images/') ||
      req.url.startsWith('/fonts/')
    ) {
      const filePath = path.join(__dirname, 'public', req.url);
      return await utils.serveFile(filePath, res);
    }

    // Optionally handle favicon.ico
    if (req.url === '/favicon.ico') {
      const filePath = path.join(__dirname, 'public', 'favicon.ico');
      return await utils.serveFile(filePath, res);
    }

    // Handle routes
    router.handle(req, res);

  } catch (error) {
    console.error('Server error:', error);
    utils.sendError(res, 'Server Error', httpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

// Error handling
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use`);
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`
  ██████╗ ██████╗ ███╗   ██╗███████╗████████╗████████╗  ██╗
 ██╔════╝██╔═══██╗████╗  ██║██╔════╝╚══██╔══╝╚══██╔══╝  ██║
 ██║     ██║   ██║██╔██╗ ██║█████╗     ██║      ██║     ██║
 ██║     ██║   ██║██║╚██╗██║██╔══╝     ██║      ██║     ╚═╝
 ╚██████╗╚██████╔╝██║ ╚████║███████╗   ██║      ██║     ██╗
  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝   ╚═╝      ╚═╝     ╚═╝

  Server running in ${ENV} mode
  Listening on port ${PORT}
  http://localhost:${PORT}
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nServer shutting down...');
  server.close(() => {
    console.log('Server terminated');
    process.exit(0);
  });
});
