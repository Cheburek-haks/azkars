const express = require("express");
const { check, validationResult } = require("express-validator");
const chalk = require("chalk");
const Content = require("../models/Content");
const router = express.Router({ mergeParams: true });
const contentMiddleware = require("../middleware/content.middleware");
const TitleType = require("../models/TitleType");
const Favourites = require("../models/Favourites");
router.post(
  "/create",

  [
    check("title", "Заполните поле title").isLength({
      min: 1,
    }),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty) {
          return res.status(400).json({
            error: {
              message: "INVALID_DATA",
              code: 400,
              errors: errors.array(),
            },
          });
        }
        const { title } = req.body;
        const exitingContent = await Content.findOne({ title });
        if (exitingContent) {
          return res.status(400).json({
            error: {
              message: "TITLE_EXISTS",
              code: 400,
            },
          });
        }

        const newContent = Content.create({
          ...req.body,
          id: Date.now(),
        });

        res.status(201).send({
          user: await newContent,
        });
        console.log(
          chalk.blueBright(`Created new content - ${await newContent}`)
        );
      } catch (error) {
        return res.status(500).json({
          message: "Что то пошло не так, так что вали от сюда",
        });
      }
    },
  ]
);
router.get("/getAll/:type", contentMiddleware, async (req, res) => {
  try {
    const { type } = req.params;

    const list = await Content.find({ type: type });
    let data;
    if (req.user) {
      if (list.length) {
        const updateData = list.map(async (item, index) => {
          const favourites = await Favourites.findOne({
            id: item._id + req.user.id,
          });
          console.log(item);
          return { ...item };

          // if (favourites) {
          //   // updateData[index].is_favourites = true;
          //   console.log(updateData[index]);
          //   console.log(index);
          // } else {
          //   console.log(false);
          //   // updateData[index].is_favourites = false;
          //   console.log(updateData[index]);
          // }
        });
        res.send(updateData);
      }
    } else {
      const title = await TitleType.findOne({ type: type });
      res.status(200).send({ data: list, title: title });
    }
  } catch (error) {
    res.status(500).json({
      message: "Сервер сдох",
    });
  }
});

module.exports = router;
