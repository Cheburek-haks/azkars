const chalk = require("chalk");
const express = require("express");
const User = require("../models/User");
const Favourites = require("../models/Favourites");
const auth = require("../middleware/auth.middleware");
const router = express.Router({ mergeParams: true });

router.patch("/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id || userId === req.user._id) {
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
      });
      const favourites = await Favourites.find({
        userId: req.user.id || req.user._id,
      });
      res.send({ ...updatedUser._doc, favourites: favourites });
    } else {
      res.status(401).json({
        message: "Unauthorized updated",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Сервер сдох иди отсюда ",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const list = await User.find();
    res.send(list);
  } catch (error) {
    res.status(500).json({
      message: "Сервер сдох иди отсюда ",
    });
  }
});

module.exports = router;
