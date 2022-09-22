const { Schema, model } = require("mongoose");
const UserSchema = new Schema({
  name: { type: String, required: true, min: 3 },
  username: { type: String, required: true, min: 3 },
  email: { type: String, required: true },
  password: { type: String, required: true, min: 8 },
  mobile: { type: Number, required: true, length: 10 },
  country: { type: String, required: true },
  gender: { type: String, required: true, enum: ["male", "female"] },
});
const User = model("User", UserSchema);
module.exports = { User };
