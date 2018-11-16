const config = require('../config');
const winston = require('winston');
require('winston-mongodb');

winston.add(winston.transports.File, {
    filename: "errors-logfile.log",
    // handleExceptions: true,
    // humanReadableUnhandledException: true,
    // level: "info" // default ["error", "debug"]
});

winston.add(winston.transports.MongoDB, {
    db: config.DB_URL,
    collection: "errorslog", // The name of the collection you want to store log messages in, defaults to 'log'
    // level: "info" // default "info"
});

module.exports = winston;