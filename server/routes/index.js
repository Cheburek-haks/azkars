const express = require("express");
const fileController = require("../controllers/fileController");

const router = express.Router({ mergeParams: true });

router.use("/auth", require("./auth.routes"));
router.use("/content", require("./content.routes"));
router.use("/users", require("./user.routes"));
router.use("/comments", require("./comments.routes"));
router.use("/navbar", require("./navbar.routes"));
router.use("/titletype", require("./titletype.routes"));
router.use("/favourites", require("./favourites.routes"));

module.exports = router;
