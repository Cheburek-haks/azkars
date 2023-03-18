const express = require("express");
const router = express.Router({ mergeParams: true });
const TitleType = require("../models/TitleType");

router.post("/", async (req, res) => {
  try {
    const { title, type } = req.body;

    if (!title || !type) {
      res.send({ message: "Проверьте свои данные" });
      return;
    }

    const newTitle = await TitleType.create({ ...req.body });
    res.status(201).send({ title: newTitle });
  } catch (error) {
    res.status(500).json({
      message: "Сервер временно не доступен, проверьте свои данные",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const list = await NavBar.find();
    res.send(list);
  } catch (error) {
    res.status(500).json({
      message: "Сервер временно не доступен, проверьте свои данные",
    });
  }
});

module.exports = router;
