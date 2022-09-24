import { User } from "../models/UserModel";

const authorization = (roles) => async (req, res, next) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (roles.includes(user.role)) {
    next();
  } else {
    res.status(403).send({ message: "Not Authorized!", success: false });
  }
};
module.exports = authorization;