const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const routes = require("./routes");
const { logger } = require("./utils/logger");
const { errorHandler } = require("./helpers/errorHandler");

const app = express();
const port = process.env.PORT || 8003;
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000,
});

app.use(limiter);
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/customer-service", routes);

app.use((err, _, res, next) => {
  errorHandler(err, res);
  return;
});

app.listen(port, () => {
  logger.info(`seller service started on ${port}`);
});
