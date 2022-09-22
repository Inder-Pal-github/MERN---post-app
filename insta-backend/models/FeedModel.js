const { Schema, model } = require("mongoose");
const FeedSchema = Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], required: true },
  userId:{type:String, required: true},
  createdAt: { type: Date, default: Date.now },
});
const Feed = model("Feed", FeedSchema);
module.exports = { Feed };
