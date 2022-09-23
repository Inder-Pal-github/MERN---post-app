const jwt = require("jsonwebtoken");
require("dotenv").config();
const authenticate = (req, res, next) => {
  if (!req.headers?.authorization) {
    return res.status(403).send({ message: "Please Login", success: false });
  }
  let token = req.headers?.authorization.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, success) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Please Login Again, Token expired!", success: false });
    } else {
      (req.body.userId = success.userId),
        (req.body.email = success.email),
        next();
    }
  });
};
module.exports = { authenticate };
