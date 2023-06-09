require("dotenv").config();

const verifyKey = (req, _, next) => {
  var token = req.headers["apikey"];
  if (token && token === process.env.APIKEY) {
    next();
  } else {
    throw Error("Token missing");
  }
};

module.exports = { verifyKey };
