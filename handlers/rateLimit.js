const rateLimit = require("express-rate-limit");

exports.registerAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 2, // start blocking after 2 requests
    message:
        "Too many accounts registered from this IP, please try again after an hour"
});

exports.resetPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000 * 24, // 1 day window
    max: 1, // start blocking after 1 requests
    message:
        "Too many password reseted from this IP, please try again after an one day"
});

exports.updateAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // start blocking after 5 requests
    message:
        "Too many accounts updated from this IP, please try again after an hour"
});