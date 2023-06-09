const { logger } = require("../utils/logger");

const errorHandler = (err, res) => {
  const { message, status = 500 } = err;
  logger.error(`Error occured - status : ${status} message : ${message}`);
  res.status(status ?? 500);
  res.send({
    message,
  });
};

module.exports = { errorHandler };
