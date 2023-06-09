const winston = require("winston");
// const {LoggingWinston} = require('@google-cloud/logging-winston');

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console(),
    // Add Cloud Logging
    // loggingWinston,
  ],
});

module.exports = { logger };
