/**
 * @author : Kwanele Dladla
 * @version : 1.0.0
 */

const http = require("http");
const httpStatus = require("http-status-codes");

const port = 3000;

// Defining the routing responses for different URLs
const routeResponseMap = {
    "/info": "<h1>Info</h1>",
    "/about": "<h1>Learn more about Code College</h1>",
    "/contact": "<h1>Contact us</h1>",
    "/error": "<h1>The page you are looking for isn't here.</h1>",
    "/hello": "<h1>Hello World</h1>", // fixed the trailing space in the key
};

// Creating the server
const app = http.createServer((req, res) => {
    res.writeHead(httpStatus.OK, {
        "Content-Type": "text/html",
    });

    // Get the route from the request and match it
    const responseContent = routeResponseMap[req.url];

    if (responseContent) {
        res.end(responseContent);
    } else {
        res.end("<h1>Welcome to the server</h1>");
    }
});

// Start listening on port 3000
app.listen(port, () => {
    console.log(`The server has started and is listening on port number: ${port}`);
});
