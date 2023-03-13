const express = require("express");

const router = express.Router({ mergeParams: true });

router.use("/auth", require("./auth.routes"));
router.use("/content", require("./content.routes"));
router.use("/users", require("./user.routes"));
router.use("/comments", require("./comments.routes"));

module.exports = router;
