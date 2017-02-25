var http = require("http"),
    express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    logger = require("./services/logger.js"),
    getDataController = require("./controllers/getDataController");


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static("public"));

http.createServer(app).listen(3001, function () {
    "use strict";
    console.log("Data collection program launched on port 3001");
});

getDataController.initialize();