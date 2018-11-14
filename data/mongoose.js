const config = require("../config");
const mongoose = require('mongoose');
const debug = require("debug")("password-reset:mongoose");

mongoose.Promise = global.Promise;
mongoose.set("debug", true)

mongoose.set("useCreateIndex", true); // на данный момент нужна эта настройка

mongoose.connect(config.DB_URL, {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
});


mongoose.connection.on("error", error => { debug("Mongoose error: " + error.name); });
mongoose.connection.on("connected", () => { debug("Mongoose connected"); });
mongoose.connection.on("reconnected", () => { debug("Mongoose reconnected"); });
mongoose.connection.on("disconnected", () => { debug("Mongoose disconnected"); });

process.on("SIGINT", () => {
    mongoose.connection.close(() => {
        debug("Mongoose default connection disconnected through app termination");
        process.exit(0);
    });
});


module.exports = mongoose;