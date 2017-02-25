var passport = require("passport"),
    session = require("express-session"),
    LocalStrategy = require("passport-local").Strategy,
    FacebookStrategy = require("passport-facebook").Strategy,
    config = require("./../config/config.json"),
    bcrypt = require("bcrypt-nodejs"),
    logger = require("./logger.js"),
    mongoose = require("mongoose");

module.exports = (function () {
    var db = mongoose.connection;
    mongoose.connect("mongodb://localhost:27017/Users");
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
        logger.logInfo("DB opened");
    });

    var Schema = mongoose.Schema;

    var userSchema = new Schema({
        local: {
            email: {
                type: String,
                unique: true
            },
            password: {
                type: String
            }
        },
        facebook: {
            id: String,
            token: String,
            email: String,
            name: String
        }
    });
    /**
     * Mongoose method for password validation
     */
    userSchema.methods.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };
    userSchema.methods.validPassword = function(password) {
        return bcrypt.compareSync(password, this.local.password);
    };
    var User = mongoose.model("User", userSchema);
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    passport.use("local-login", new LocalStrategy({
            usernameField : "email",
            passwordField : "password",
            passReqToCallback : true
        },
        function(req, email, password, done) {
            User.findOne({ "local.email" :  email }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, req.flash("loginMessage", "No user found."));
                }
                if (!user.validPassword(password))
                    return done(null, false, req.flash("loginMessage", "Oops! Wrong password."));
                return done(null, user);
            });
        }));
    passport.use("local-register", new LocalStrategy({
            usernameField : "email",
            passwordField : "password",
            passReqToCallback : true
        },
        function(req, email, password, done) {
            User.findOne({ "local.email" :  email }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, false, req.flash("signupMessage", "That email is already taken."));
                } else {
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.save(function(err) {
                        if (err) {
                            logger.logError(err);
                        }
                        return done(null, newUser);
                    });
                }
            });
        }));
    // passport.use('facebook', new FacebookStrategy({
    //         clientID : config.auth.facebook.clientID,
    //         clientSecret : config.auth.facebook.clientSecret,
    //         callbackURL : config.auth.facebook.callbackURL
    //     },
    //     function(token, refreshToken, profile, done) {
    //         process.nextTick(function() {
    //             User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
    //                 if (err)
    //                     return done(err);
    //                 if (user) {
    //                     return done(null, user);
    //                 } else {
    //                     var newUser = new User();
    //                     newUser.facebook.id    = profile.id;
    //                     newUser.facebook.token = token;
    //                     newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
    //                     newUser.facebook.email = profile.emails[0].value;
    //                     newUser.save(function(err) {
    //                         if (err)
    //                             throw err;
    //                         return done(null, newUser);
    //                     });
    //                 }
    //
    //             });
    //         });
    // }));

    var login = function (req, res, next) {
        passport.authenticate("local-login", {
            successRedirect : "/profile",
            failureRedirect : "/login",
            failureFlash : true
        })(req, res, next);
    };
    var register = function (req, res, next) {
        passport.authenticate("local-register", {
            successRedirect : "/profile",
            failureRedirect : "/signup",
            failureFlash : true
        })(req, res, next)
    };
    //
    var logout = function(req, res) {
        req.logout();
        res.redirect("/");
    };


    return {
        login: login,
        register: register,
        logout: logout
    };
}());