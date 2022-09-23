const { User } = require("../models/UserModel");
const { Router } = require("express");
const multer = require("multer");
const { Feed } = require("../models/FeedModel");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploads = multer({
  storage: storage,
});

const userRouter = Router();

userRouter.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (user) {
    return res.send(user);
  } else {
    return res.status(404).send("User not found");
  }
});
userRouter.get("/:userId/feed", async (req, res) => {
  try {
    const { userId } = req.params;
    const feeds = await Feed.find({ userId });
    res.status(200).send({ message: "Feed found", data: feeds, success: true });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error getting feed",success:false });
  }
});
userRouter.post("/:userId/feed", uploads.single("image"), async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, description, tags } = req.body;
    const image = `${__dirname}/uploads/${req.file.originalname}`;
    const feed = new Feed({
      title,
      description,
      tags: tags.split(", "),
      image,
      userId,
    });
    await feed.save();
    return res
      .status(201)
      .send({ message: "New Feed created successfully", success: true, feed });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error creating feed", error: error });
  }
});
userRouter.get("/", (req, res) => {
  res.json({ success: true, user: req.body });
});

module.exports = { userRouter };
