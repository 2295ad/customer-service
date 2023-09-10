
const jwt = require('jsonwebtoken');
require("dotenv").config();

const jwtVerify = (req, _, next) => {
  var token = req.headers["auth"];
  if(token)
    {
        jwt.verify(token, process.env.SECRET_TOKEN,{algorithms:process.env.ALGORITHM},function(err, decoded){
            if(err){
                throw new Error('Invalid Token');
            }else{
                req.body.email = decoded.email;
                req.body.userId = decoded.userId;
                next()
            }
        })
    }else{
        throw new Error('Token missing');
    }
};

module.exports = { jwtVerify };
