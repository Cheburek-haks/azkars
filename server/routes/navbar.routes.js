const chalk = require("chalk");
const express = require("express");
const NavBar = require("../models/NavBar");
const path = require("path");
const router = express.Router({ mergeParams: true });

router.post("/", async (req, res) => {
  try {
    const image = req.files["image"];

    const newNavBar = await NavBar.create({
      ...req.body,
      image: `/img/${image.name}`,
    });
    res.status(201).send(newNavBar);
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
