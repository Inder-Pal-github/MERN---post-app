const { User } = require("../models/UserModel");
const { Router } = require("express");
require("dotenv").config();
const upload = require("../utils/multer");
const { Feed } = require("../models/FeedModel");
const cloudinary = require("../utils/cloudinary");

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

// GET YOUR FEEDS  =============================================================
userRouter.get("/:userId/feed", async (req, res) => {
  try {
    const { userId } = req.params;
    const feeds = await Feed.find({ userId });
    if (feeds.length > 0) {
      return res
        .status(200)
        .send({ message: "Your Feeds", data: feeds, success: true });
    } else {
      return res
        .status(200)
        .send({ message: "No Feeds Posted Yet!", data: feeds, success: true });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error getting feed", success: false });
  }
});
// =================================================================  ============

// UPLOAD A  NEW FEED =================================================================
userRouter.post("/:userId/feed", upload.single("image"), async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, description, tags } = req.body;
    const result = await cloudinary.uploader.upload(req.file.path);
    const feed = new Feed({
      title,
      description,
      tags: tags.split(", "),
      image: result.secure_url,
      cloudinary_id: result.public_id,
      userId,
    });
    await feed.save();
    return res
      .status(201)
      .send({ message: "New Feed created successfully", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Error creating feed", error: error });
  }
});
userRouter.patch("/:userId/feed/:postId", async (req, res) => {
  try {
    const { userId, postId } = req.params;
    const feed = await Feed.findOneAndUpdate(
      { userId, _id: postId },
      { ...req.body,tags:req.body.tags.split(", ") }
    );
    if (feed) {
      return res
        .status(200)
        .send({ message: "Feed updated successfully", success: true });
    } else {
      return res
        .status(404)
        .send({ message: "Feed not found", success: false });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error updating post", success: false });
  }
});
userRouter.delete("/:userId/feed/:postId", async (req, res) => {
  try {
    const { userId, postId } = req.params;
    const feed = await Feed.findOneAndDelete({ userId, _id: postId });
    if (feed) {
      return res
        .status(200)
        .send({ message: "Feed deleted successfully", success: true });
    } else {
      return res
        .status(404)
        .send({ message: "Feed not found", success: false });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error deleting post", success: false });
  }
});
userRouter.get("/", (req, res) => {
  res.json({ success: true, user: req.body });
});

module.exports = { userRouter };
