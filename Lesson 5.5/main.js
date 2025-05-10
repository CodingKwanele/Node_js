/**
 * @author: Kwanele Dladla
 * @version: 1.0.0  
 * @description: Basic HTTP server using Node.js and http-status-codes
 */

const http = require("http");
const httpStatus = require("http-status-codes");

const port = 3000;

// Create the HTTP server
const app = http.createServer((req, res) => {
  // Set response headers
  res.writeHead(httpStatus.OK, {
    "Content-Type": "text/html"
  });

  // Define the response body
  const responseMessage = "<h1>Welcome!</h1>";

  // Send the response
  res.end(responseMessage);
});

// Start the server
app.listen(port, () => {
  console.log(`The server has started and is listening on port number: ${port}`);
});
