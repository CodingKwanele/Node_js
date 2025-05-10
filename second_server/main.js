/**
 * @author: Kwanele Dladla 
 */

const { request } = require("http");

const port = 3000; 

http = require("http");
httpStatus = require("http-status-codes"); 

// Create the Server
app = http.createServer();

app.on("request", (req,res)=>{
    //Prepare a response 
    res.writeHead(httpStatus.OK, {
        "content-Type":"text/html"
    });

    let responseMessage = "<h1>This will show on the screen. </h1>"
    //Respond with HTML.
    res.end(responseMessage);
});

app.listen(port);
console.log(`The server has started and is listening on port number: ${port}`)