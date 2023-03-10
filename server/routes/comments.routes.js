const express = require("express");
const auth = require("../middleware/auth.middleware");
const Comment = require("../models/Comment");
const router = express.Router({ mergeParams: true });

router.get("/:commentType", async (req, res) => {
  try {
    const { commentType } = req.params;
    const list = await Comment.find({ type: commentType });

    res.send(list);
  } catch (error) {
    res.status(500).json({
      message: "Сервер сдох",
    });
  }
});
router.post("/", async (req, res) => {
  try {
    console.log("kak---", req.user);
    const newComment = await Comment.create({
      ...req.body,
      userId: req.user.id,
    });
    console.log(newComment);
    res.status(201).send(newComment);
  } catch (error) {
    res.status(500).json({
      message: "Сервер сдох ",
    });
  }
});

router.delete("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const removedComment = await Comment.findById(commentId);
    console.log(req.user.id, removedComment.userId);
    if (removedComment.userId.toString() === req.user.id) {
      console.log("commentId", commentId);

      await removedComment.remove();
      return res.send(null);
    } else {
      return res.status(401).json({ message: "Unauthorized middleware" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Сервер сдох",
    });
  }
});
module.exports = router;
