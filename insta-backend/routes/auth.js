const { Router, request } = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { username, email } = { ...req.body };

    const isUserPresent = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (isUserPresent) {
      return res.send({ message: "User already exists", success: false });
    }
    const hash_password = await bcrypt.hash(req.body.password, 10);
    if (!hash_password)
      return res.status(403).send({ message: "Invalid password" });
    const user = new User({ ...req.body, password: hash_password });
    user.save((err, success) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send({ message: "Error saving user", success: false });
      } else {
        console.log(success);
        return res
          .status(201)
          .send({ message: "User saved successfully", success: true, user });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Something went wrong", success: false, error });
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }
    const hash = user.password;
    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) {
      return res
        .status(403)
        .send({ message: "Password mismatch", success: false });
    }
    const token = jwt.sign({ email:user.email,userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: 3600,
    });
    return res
      .status(200)
      .send({ message: "Login successful", success: true, userId:user._id,token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Something went wrong", success: false, error });
  }
});

module.exports = { authRouter };
/*
{
    "name":"Inder",
    "username":"inder231",
    "email":"inder@gmail.com",
    "password":"inder123456",
    "mobile":1234567890,
    "country":"India",
    "gender":"male"
  }
*/
