const chalk = require("chalk");
const express = require("express");
const User = require("../models/User");
const Content = require("../models/Content");
const Favourites = require("../models/Favourites");
const auth = require("../middleware/auth.middleware");
const router = express.Router({ mergeParams: true });

router.post("/:dataId", auth, async (req, res) => {
  try {
    const { dataId } = req.params;
    const data = await Content.findOne({ _id: dataId });
    if (data) {
      const updateData = { ...data._doc, userId: req.user.id };
      delete updateData._id;
      const newData = await Favourites.create({
        ...updateData,
      });

      res.status(201).send(newData);
    } else {
      res.status(404).json({
        message: "Проверьте свои данные ",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Сервер сдох иди отсюда ",
    });
  }
});

module.exports = router;
