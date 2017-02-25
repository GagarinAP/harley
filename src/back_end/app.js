var http = require("http"),
    express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    passport = require("passport"),
    bcrypt = require("bcrypt-nodejs"),
    session = require("express-session"),
    logger = require("./services/logger"),
    configService = require("./services/ConfigService"),
    user = require("./services/userService"),
    cookieParser = require("cookie-parser"),
    flash = require("connect-flash");
weatherController = require("./controllers/weather");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(require("express-session")({
    secret: "someFunnyPhrase",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.post("/login", user.login);

app.post("/signup", user.register);

app.get("/logout", user.logout);

// route middleware to make sure
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect("/");
}

app.get("/profile", isLoggedIn, function(req, res) {
    res.render("profile.ejs", {
        user : req.user
    });
});

// // route for facebook authentication and login
// app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
//
// // handle the callback after facebook has authenticated the user
// app.get('/auth/facebook/callback',
//     passport.authenticate('facebook', {
//         successRedirect : '/profile',
//         failureRedirect : '/'
// }));

app.get("/users", function (req, res) {
    res.send("hello " + req.session.passport.user.username + "<br/><a href=\"/logout\">Logout</a>");
});

// route to mock data with services statistics per day
app.get("/weather/v01/stat/service/day", function (req, res) {
    "use strict";
    weatherController.getServiceDayStat(req.query.from, req.query.to, req.query.service).then(function (data) {
        res.send(data);
    });
});
// route to mock data with services statistics per month
app.get("/weather/v01/stat/service/month", function (req, res) {
    "use strict";
    weatherController.getServiceMonthStat(req.query.from, req.query.service).then(function (data) {
        res.send(data);
    });
});
// route to mock data with cities statistics per day
app.get("/weather/v01/stat/city/day", function (req, res) {
    "use strict";
    weatherController.getCityDayStat(req.query.from, req.query.to, req.query.city).then(function (data) {
        res.send(data);
    });
});
// route to mock data with cities statistics per month
app.get("/weather/v01/stat/city/month", function (req, res) {
    "use strict";
    weatherController.getCityMonthStat(req.query.from, req.query.city).then(function (data) {
        res.send(data);
    });
});
app.get("/weather/v01/current", function (req, res) {
    "use strict";
    weatherController.getCurrentWeather().then(function (data) {
        res.send(data);
    });
});
//Example of url: http://localhost:3000/weather/v01/stat/service-by-city/day?from=2017-01-01&to=2017-01-20&city=Rivne
app.get("/weather/v01/stat/service-by-city/day", function (req, res) {
    "use strict";
    weatherController.getServiceStatByCities(req.query.from, req.query.to, req.query.city).then(function (data) {
        res.send(data);
    });
});

app.get("/weather/v01/statistic/day", function (req, res) {
    "use strict";
    weatherController.getServiceDayStat(req.query.from, req.query.to).then(function (data) {
        res.send(data);
    });
});

app.get("/weather/v01/settings", function (req, res) {
    "use strict";
    res.send(configService.getSettings());
});

app.get("/weather/v01/configs", function (req, res) {
    "use strict";
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send(configService.getTotalConfig());
});

http.createServer(app).listen(3000, function () {
    "use strict";
    console.log("App listening on port 3000!");
});